import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  CheckCircle2,
  Truck,
  FileText,
  FileSignature,
  Package,
  Building,
  Share2,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import AddResourceModal from "./CreateResourceModal";
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
  const [requiredSignatures, setRequiredSignatures] = useState<ResourceShare[]>([]);
  const [marketplaceResources, setMarketplaceResources] = useState<Resource[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [shareRequests, setShareRequests] = useState<ResourceShare[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  const { user } = useUser();

  const navigate = useNavigate();

  const openProject = () => {};

  const fetchResources = () => {
    setIsLoading(true);
    
    axios
      .get("/resources/my-resources")
      .then((res) => {
        setMyResources(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to fetch resources");
      });

    axios
      .get("/resources/marketplace")
      .then((res) => {
        setMarketplaceResources(res.data.data);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Failed to fetch marketplace resources"
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
          err.response?.data?.message || "Failed to fetch share requests"
        );
      });

    axios
      .post("/shares/department/signatures", {
        department: department,
      })
      .then((res) => {
        setRequiredSignatures(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Failed to fetch signature requests"
        );
        setIsLoading(false);
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

  const getResourceBgColor = (id: string): string => {
    const colors = [
      "bg-indigo-600",
      "bg-emerald-600",
      "bg-amber-600",
      "bg-rose-600",
      "bg-cyan-600",
      "bg-violet-600",
    ];
    const index = id.charCodeAt(0) % colors.length;
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
      let valueA = column.includes('.') 
        ? column.split('.').reduce((obj, key) => obj && obj[key], a)
        : (a as any)[column];
      
      let valueB = column.includes('.')
        ? column.split('.').reduce((obj, key) => obj && obj[key], b)
        : (b as any)[column];

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
      let valueA = column.includes('.') 
        ? column.split('.').reduce((obj, key) => obj && obj[key], a)
        : (a as any)[column];
      
      let valueB = column.includes('.')
        ? column.split('.').reduce((obj, key) => obj && obj[key], b)
        : (b as any)[column];

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
    fetchResources();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge 
            variant="outline" 
            className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "dispatched":
        return (
          <Badge 
            variant="outline" 
            className="bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1"
          >
            <Truck className="h-3 w-3" />
            Dispatched
          </Badge>
        );
      case "received":
        return (
          <Badge 
            variant="outline" 
            className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
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
        fetchResources();
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Failed to update share status"
        );
      });
  };

  const getCategoryBadge = (category: string) => {
    const badgeClasses = {
      equipment: "bg-indigo-50 text-indigo-700 border-indigo-200",
      material: "bg-emerald-50 text-emerald-700 border-emerald-200",
      vehicle: "bg-amber-50 text-amber-700 border-amber-200",
      tool: "bg-cyan-50 text-cyan-700 border-cyan-200",
      personnel: "bg-violet-50 text-violet-700 border-violet-200",
      default: "bg-slate-50 text-slate-700 border-slate-200"
    };

    return (
      <Badge 
        variant="outline" 
        className={badgeClasses[category.toLowerCase()] || badgeClasses.default}
      >
        {category}
      </Badge>
    );
  };

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleResourceAdded}
      />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Resource Management</h1>
          <p className="text-slate-500">Manage your department resources and share requests</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-sm font-medium"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2 text-slate-500" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-sm font-medium"
          >
            <Download className="h-4 w-4 mr-2 text-slate-500" />
            Export
          </Button>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 h-9 px-3 text-sm font-medium"
            onClick={handleOpenAddModal}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search resources by name, category or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-slate-200 focus:border-indigo-500 h-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-slate-50 border-b border-slate-200 h-12 p-0 w-full rounded-t-md rounded-b-none flex">
            <TabsTrigger
              value="my-resources"
              className="flex-1 flex items-center justify-center gap-2 h-full rounded-none border-r border-slate-200 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            >
              <FileText className="h-4 w-4" />
              <span className="font-medium">My Resources</span>
              <Badge 
                variant="secondary" 
                className="ml-1 bg-indigo-100 text-indigo-700 border-none"
              >
                {filteredMyResources.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="marketplace"
              className="flex-1 flex items-center justify-center gap-2 h-full rounded-none border-r border-slate-200 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
            >
              <Package className="h-4 w-4" />
              <span className="font-medium">Resource Marketplace</span>
              <Badge 
                variant="secondary" 
                className="ml-1 bg-emerald-100 text-emerald-700 border-none"
              >
                {filteredMarketplaceResources.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="flex-1 flex items-center justify-center gap-2 h-full rounded-none border-r border-slate-200 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
            >
              <Share2 className="h-4 w-4" />
              <span className="font-medium">Share Requests</span>
              <Badge 
                variant="secondary" 
                className="ml-1 bg-amber-100 text-amber-700 border-none"
              >
                {filteredShareRequests.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="signatures"
              className="flex-1 flex items-center justify-center gap-2 h-full rounded-none data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
            >
              <FileSignature className="h-4 w-4" />
              <span className="font-medium">Pending Signatures</span>
              <Badge 
                variant="secondary" 
                className="ml-1 bg-rose-100 text-rose-700 border-none"
              >
                {requiredSignatures.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* My Resources Tab */}
          <TabsContent value="my-resources" className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                  <div className="h-4 w-48 bg-slate-200 rounded mb-3"></div>
                  <div className="h-3 w-32 bg-slate-200 rounded"></div>
                </div>
              </div>
            ) : filteredMyResources.length > 0 ? (
              <div className="rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Resource
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("category")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Category
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("department.name")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Department
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("quantity")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Quantity
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center hidden md:table-cell">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("updatedAt")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
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
                      <TableRow 
                        key={resource._id} 
                        className="group hover:bg-slate-50 transition-colors"
                      >
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
                                className={`h-10 w-10 rounded-md ${getResourceBgColor(resource._id)}`}
                              >
                                <div className="text-white font-medium text-sm">
                                  {getResourceInitials(resource.name)}
                                </div>
                              </Avatar>
                            )}
                            <div>
                              <p className="font-medium text-slate-800">
                                {resource.name}
                              </p>
                              <p className="text-xs text-slate-500 truncate max-w-[180px]">
                                {resource.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(resource.category)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1"
                          >
                            <Building className="h-3 w-3 text-slate-500" />
                            {resource.department?.name || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div>
                            <p className="font-medium text-slate-700">{resource.quantity}</p>
                            <p className="text-xs text-slate-500">
                              {resource.unit}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center hidden md:table-cell text-slate-600">
                          {formatDate(resource.updatedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-slate-600 hover:bg-slate-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-slate-200">
                              <DropdownMenuLabel className="text-slate-700">Actions</DropdownMenuLabel>
                              <DropdownMenuItem className="text-slate-700 hover:text-indigo-600 cursor-pointer">
                                <Eye className="h-4 w-4 mr-2 text-slate-500" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-700 hover:text-indigo-600 cursor-pointer">
                                <Edit className="h-4 w-4 mr-2 text-slate-500" /> Edit Resource
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-700 hover:text-indigo-600 cursor-pointer">
                                <Share2 className="h-4 w-4 mr-2 text-slate-500" /> Share Resource
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-100" />
                              <DropdownMenuItem className="text-rose-600 hover:text-rose-700 cursor-pointer">
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
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-700 font-medium mb-1">No resources found</p>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  You don't have any resources or none match your search criteria.
                </p>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
                  onClick={handleOpenAddModal}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Resource
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                  <div className="h-4 w-48 bg-slate-200 rounded mb-3"></div>
                  <div className="h-3 w-32 bg-slate-200 rounded"></div>
                </div>
              </div>
            ) : filteredMarketplaceResources.length > 0 ? (
              <div className="rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Resource
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("category")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Category
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("department.name")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Department
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("quantity")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Quantity
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center hidden md:table-cell">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("updatedAt")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Updated
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMarketplaceResources.map((resource) => (
                      <TableRow 
                        key={resource._id} 
                        className="group hover:bg-slate-50 transition-colors"
                      >
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
                                className={`h-10 w-10 rounded-md ${getResourceBgColor(resource._id)}`}
                              >
                                <div className="text-white font-medium text-sm">
                                  {getResourceInitials(resource.name)}
                                </div>
                              </Avatar>
                            )}
                            <div>
                              <p className="font-medium text-slate-800">
                                {resource.name}
                              </p>
                              <p className="text-xs text-slate-500 truncate max-w-[180px]">
                                {resource.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(resource.category)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1"
                          >
                            <Building className="h-3 w-3 text-slate-500" />
                            {resource.department?.name || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div>
                            <p className="font-medium text-slate-700">{resource.quantity}</p>
                            <p className="text-xs text-slate-500">
                              {resource.unit}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center hidden md:table-cell text-slate-600">
                          {formatDate(resource.updatedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 opacity-0 group-hover:opacity-100"
                          >
                            <Share2 className="h-4 w-4 mr-2 text-slate-500" />
                            Request
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-700 font-medium mb-1">No marketplace resources found</p>
                <p className="text-slate-500 mb-4 max-w-md mx-auto">
                  There are no marketplace resources available or none match your search criteria.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Share Requests Tab */}
          <TabsContent value="requests" className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                  <div className="h-4 w-48 bg-slate-200 rounded mb-3"></div>
                  <div className="h-3 w-32 bg-slate-200 rounded"></div>
                </div>
              </div>
            ) : filteredShareRequests.length > 0 ? (
              <div className="rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("resource.name")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Resource
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("department.name")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          From Department
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("sharedWith.name")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Shared With
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("quantity")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Quantity
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
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
                        className="group hover:bg-slate-50 transition-colors"
                        onClick={() => navigate(`${share.project}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              className={`h-10 w-10 rounded-md ${getResourceBgColor(share._id)}`}
                            >
                              <div className="text-white font-medium text-sm">
                                {getResourceInitials(share.resource.name)}
                              </div>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-800">
                                {share.resource.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1"
                          >
                            <Building className="h-3 w-3 text-slate-500" />
                            {share.department.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1"
                          >
                            <Building className="h-3 w-3 text-slate-500" />
                            {share.sharedWith.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <p className="font-medium text-slate-700">{share.quantity}</p>
                        </TableCell>
                        <TableCell>{getStatusBadge(share.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-slate-600 hover:bg-slate-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-slate-200">
                              <DropdownMenuLabel className="text-slate-700">Update Status</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleUpdateShareStatus(share._id, "pending")}
                                disabled={share.status === "pending"}
                                className={share.status === "pending" 
                                  ? "text-slate-400 cursor-not-allowed" 
                                  : "text-slate-700 hover:text-indigo-600 cursor-pointer"}
                              >
                                <Clock className="h-4 w-4 mr-2 text-amber-500" /> Mark as Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateShareStatus(share._id, "dispatched")}
                                disabled={share.status === "dispatched"}
                                className={share.status === "dispatched" 
                                  ? "text-slate-400 cursor-not-allowed" 
                                  : "text-slate-700 hover:text-indigo-600 cursor-pointer"}
                              >
                                <Truck className="h-4 w-4 mr-2 text-indigo-500" /> Mark as Dispatched
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateShareStatus(share._id, "received")}
                                disabled={share.status === "received"}
                                className={share.status === "received" 
                                  ? "text-slate-400 cursor-not-allowed" 
                                  : "text-slate-700 hover:text-indigo-600 cursor-pointer"}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> Mark as Received
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
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-700 font-medium mb-1">No share requests</p>
                <p className="text-slate-500 mb-4 max-w-md mx-auto">
                  There are no pending share requests for your department.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Signatures Tab */}
          <TabsContent value="signatures" className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                  <div className="h-4 w-48 bg-slate-200 rounded mb-3"></div>
                  <div className="h-3 w-32 bg-slate-200 rounded"></div>
                </div>
              </div>
            ) : requiredSignatures?.length > 0 ? (
              <div className="rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("resource.name")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Resource
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("department.name")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          From Department
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("sharedWith.name")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Shared With
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("quantity")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Quantity
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1 font-medium p-0 h-auto text-slate-700 hover:text-indigo-600"
                        >
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requiredSignatures.map((share) => (
                      <TableRow
                        key={share._id}
                        className="group hover:bg-slate-50 transition-colors"
                        onClick={() => navigate(`${share.project}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              className={`h-10 w-10 rounded-md ${getResourceBgColor(share._id)}`}
                            >
                              <div className="text-white font-medium text-sm">
                                {getResourceInitials(share.resource.name)}
                              </div>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-800">
                                {share.resource.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1"
                          >
                            <Building className="h-3 w-3 text-slate-500" />
                            {share.department.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1"
                          >
                            <Building className="h-3 w-3 text-slate-500" />
                            {share.sharedWith.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <p className="font-medium text-slate-700">{share.quantity}</p>
                        </TableCell>
                        <TableCell>{getStatusBadge(share.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 opacity-0 group-hover:opacity-100"
                          >
                            <FileSignature className="h-4 w-4 mr-2 text-slate-500" />
                            Sign Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSignature className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-700 font-medium mb-1">No pending signatures</p>
                <p className="text-slate-500 mb-4 max-w-md mx-auto">
                  You don't have any documents waiting for your signature.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ResourceManagement;
