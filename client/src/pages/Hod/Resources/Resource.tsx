import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Filter,
  Search,
  Download,
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Resource from "@/types/ExtendedResource";
import { useAuth, useUser } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import AddResourceModal from "./CreateResourceModal"; // Import the new modal component
import ResourceShare from "@/types/ResourceShare";
import { useNavigate } from "react-router-dom";

const ResourceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("my-resources");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [marketplaceResources, setMarketplaceResources] = useState<Resource[]>(
    []
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false); // New state for modal
  const [shareRequests, setShareRequests] = useState<ResourceShare[]>([]);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  const { user } = useUser();

  const navigate = useNavigate();

  const openProject = () => {};

  const fetchResources = () => {
    axios
      .get("/resources/my-resources")
      .then((res) => {
        setMyResources(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Failed to fetch resources");
      });

    axios
      .get("/resources/marketplace")
      .then((res) => {
        setMarketplaceResources(res.data.data);
      })
      .catch((err) => {
        toast.error(
          err.response.data.message || "Failed to fetch marketplace resources"
        );
      });

    const department = user?.publicMetadata.department;

    axios
      .post("/shares/department", {
        department: department,
      })
      .then((res) => {
        setShareRequests(res.data.data);
      })
      .catch((err) => {
        toast.error(
          err.response.data.message || "Failed to fetch share requests"
        );
      });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const getResourceInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Replace colorful gradients with professional slate backgrounds
  const getResourceBgColor = (id: string): string => {
    const colors = [
      "from-purple-500 to-indigo-600",
      "from-blue-500 to-cyan-600",
      "from-green-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-red-500 to-pink-600",
    ];
    const index = parseInt(id) % colors.length;
    return colors[index];
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const sortResources = (resources: Resource[], column: string): Resource[] => {
    return [...resources].sort((a, b) => {
      let valueA = (a as any)[column];
      let valueB = (b as any)[column];

      if (valueA instanceof Date && valueB instanceof Date) {
        valueA = valueA.getTime();
        valueB = valueB.getTime();
      } else if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortShares = (
    shares: ResourceShare[],
    column: string
  ): ResourceShare[] => {
    return [...shares].sort((a, b) => {
      let valueA = (a as any)[column];
      let valueB = (b as any)[column];

      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }


      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredMyResources = sortResources(
    myResources.filter(
      (resource) =>
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterDepartment.toLowerCase() === "all" ||
          resource.department?.name.toLowerCase() ===
            filterDepartment.toLowerCase()) &&
        (filterCategory.toLowerCase() === "all" ||
          resource.category.toLowerCase() === filterCategory.toLowerCase())
    ),
    sortColumn
  );

  const filteredMarketplaceResources = sortResources(
    marketplaceResources.filter(
      (resource) =>
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterDepartment.toLowerCase() === "all" ||
          resource.department?.name?.toLowerCase() ===
            filterDepartment.toLowerCase()) &&
        (filterCategory.toLowerCase() === "all" ||
          resource.category.toLowerCase() === filterCategory.toLowerCase())
    ),
    sortColumn
  );

  const filteredShareRequests = sortShares(
    shareRequests.filter(
      (share) =>
        share.resource
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        (filterDepartment.toLowerCase() === "all" ||
          share.department.toLowerCase() === filterDepartment.toLowerCase()) &&
        (filterStatus.toLowerCase() === "all" ||
          share.status.toLowerCase() === filterStatus.toLowerCase())
    ),
    sortColumn
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleResourceAdded = () => {
    fetchResources(); // Refresh the resources list after adding a new one
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "dispatched":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <Truck className="h-3 w-3" />
            Dispatched
          </Badge>
        );
      case "received":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Received
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleUpdateShareStatus = (
    shareId: string,
    newStatus: "pending" | "dispatched" | "received"
  ) => {
    axios
      .put(`/shares/${shareId}`, { status: newStatus })
      .then(() => {
        toast.success(`Share status updated to ${newStatus}`);
        fetchResources(); // Refresh the data
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Failed to update share status"
        );
      });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleResourceAdded}
      />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resources</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleOpenAddModal} // Add click handler to open modal
          >
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-gray-50 rounded-t-lg p-0 w-full">
              <TabsTrigger
                value="my-resources"
                className="flex items-center gap-2 py-4 px-6 rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium">My Resources</span>
                <Badge variant="secondary" className="ml-2">
                  {filteredMyResources.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="marketplace"
                className="flex items-center gap-2 py-4 px-6 rounded-none data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Resource Marketplace</span>
                <Badge variant="secondary" className="ml-2">
                  {filteredMarketplaceResources.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="flex items-center gap-2 py-4 px-6 rounded-none data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700"
              >
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Share Requests</span>
                <Badge variant="secondary" className="ml-2">
                  {filteredShareRequests.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-resources" className="p-4">
              {filteredMyResources.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("name")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Resource
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("category")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Category
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("department")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Department
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("quantity")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Quantity
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center hidden md:table-cell">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("updatedAt")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Updated
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMyResources.map((resource) => (
                        <TableRow key={resource._id} className="group">
                          <TableCell onClick={openProject}>
                            <div className="flex items-center gap-3">
                              {resource.photo ? (
                                <img
                                  src={resource.photo}
                                  alt={resource.name}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              ) : (
                                <Avatar
                                  className={`h-10 w-10 rounded-md bg-gradient-to-br ${getResourceBgColor(
                                    resource._id
                                  )}`}
                                >
                                  <div className="text-white font-medium text-sm">
                                    {getResourceInitials(resource.name)}
                                  </div>
                                </Avatar>
                              )}
                              <div>
                                <p className="font-medium text-gray-800">
                                  {resource.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                  {resource.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{resource.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {resource.department?.name || "General"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div>
                              <p className="font-medium">{resource.quantity}</p>
                              <p className="text-xs text-gray-500">
                                {resource.unit}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center hidden md:table-cell">
                            {formatDate(resource.updatedAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                  Resource
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No resources found matching your criteria.
                </div>
              )}
            </TabsContent>

            <TabsContent value="marketplace" className="p-4">
              {filteredMarketplaceResources.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("name")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Resource
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("category")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Category
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("department")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Department
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("quantity")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Quantity
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center hidden md:table-cell">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("updatedAt")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Updated
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMarketplaceResources.map((resource) => (
                        <TableRow key={resource._id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {resource.photo ? (
                                <img
                                  src={resource.photo}
                                  alt={resource.name}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              ) : (
                                <Avatar
                                  className={`h-10 w-10 rounded-md bg-gradient-to-br ${getResourceBgColor(
                                    resource._id
                                  )}`}
                                >
                                  <div className="text-white font-medium text-sm">
                                    {getResourceInitials(resource.name)}
                                  </div>
                                </Avatar>
                              )}
                              <div>
                                <p className="font-medium text-gray-800">
                                  {resource.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                  {resource.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{resource.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {resource.department.name || "General"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div>
                              <p className="font-medium">{resource.quantity}</p>
                              <p className="text-xs text-gray-500">
                                {resource.unit}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center hidden md:table-cell">
                            {formatDate(resource.updatedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No marketplace resources found matching your criteria.
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="p-4">
              {filteredShareRequests.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("resource")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Resource
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("department")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            From Department
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("sharedWith")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Shared With
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("quantity")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Quantity
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("status")}
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Status
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShareRequests.map((share) => (
                        <TableRow
                          key={share._id}
                          className="group"
                          onClick={() => navigate(`${share.project}`)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar
                                className={`h-10 w-10 rounded-md bg-gradient-to-br ${getResourceBgColor(
                                  share._id
                                )}`}
                              >
                                <div className="text-white font-medium text-sm">
                                  {getResourceInitials(share.resource.name)}
                                </div>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {share.resource.name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {share.department.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {share.sharedWith.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <p className="font-medium">{share.quantity}</p>
                          </TableCell>
                          <TableCell>{getStatusBadge(share.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateShareStatus(
                                      share._id,
                                      "pending"
                                    )
                                  }
                                  disabled={share.status === "pending"}
                                >
                                  <Clock className="h-4 w-4 mr-2" /> Mark as
                                  Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateShareStatus(
                                      share._id,
                                      "dispatched"
                                    )
                                  }
                                  disabled={share.status === "dispatched"}
                                >
                                  <Truck className="h-4 w-4 mr-2" /> Mark as
                                  Dispatched
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateShareStatus(
                                      share._id,
                                      "received"
                                    )
                                  }
                                  disabled={share.status === "received"}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" /> Mark
                                  as Received
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No share requests found matching your criteria.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceManagement;
