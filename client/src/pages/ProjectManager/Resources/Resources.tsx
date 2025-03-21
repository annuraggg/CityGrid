import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Search, Download, ArrowUpDown } from "lucide-react";
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
import Resource from "@/types/ExtendedResource";
import { useAuth, useUser } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Project from "@/types/Project";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ResourceManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [marketplaceResources, setMarketplaceResources] = useState<Resource[]>(
    []
  );
  const [projects, setProjects] = useState<Project[]>([]);

  const [quantity, setQuantity] = useState<number>(0);
  const [projectId, setProjectId] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const fetchResources = () => {
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

    axios
      .get("/projects/manager")
      .then((res) => {
        setProjects(res.data.data);
      })
      .catch((err) => {
        toast.error(
          err.response.data.message || "Failed to fetch manager projects"
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const { user } = useUser();

  const requestResource = (resourceId: string) => {
    if (!projectId) {
      return toast.error("Please select a project to request the resource");
    }

    if (quantity <= 0) {
      return toast.error(
        "Please enter a valid quantity to request the resource"
      );
    }

    axios
      .post("/shares", {
        sharedWith: user?.publicMetadata.department,
        department: user?.publicMetadata.department,
        resource: resourceId,
        quantity,
        project: projectId,
      })
      .then((res) => {
        toast.success(res.data.message);
        fetchResources();
        setOpen(false);
      })
      .catch((err) => {
        toast.error(
          err.response.data.message || "Failed to request the resource"
        );
      });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Resource Marketplace
        </h1>
      </div>

      <div className="relative flex-grow mb-3">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-4">
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
                    <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger>
                              {" "}
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                Request
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="mb-2">
                                  Request a Resource
                                </DialogTitle>
                                <div className="flex gap-3 items-center">
                                  <p className="w-42">Select a Project: </p>
                                  <Select
                                    value={projectId}
                                    onValueChange={(e) => setProjectId(e)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {projects.map((project) => (
                                        <SelectItem value={project._id}>
                                          {project.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex gap-3 items-center">
                                  <p className="w-full">
                                    Enter Quanity less than {resource.quantity}:{" "}
                                  </p>
                                  <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                      setQuantity(+e.target.value)
                                    }
                                    className="w-24"
                                  />
                                </div>
                                <Button
                                  onClick={() => requestResource(resource._id)}
                                >
                                  Request
                                </Button>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceManagement;
