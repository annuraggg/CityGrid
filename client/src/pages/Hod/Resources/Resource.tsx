import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CheckCircle, Clock, Package2, Filter, Search, Download, ArrowUpDown, MoreHorizontal, Trash2, Edit, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

type ResourceStatus = 'Pending' | 'Distributed' | 'Delivered';
type AvailabilityStatus = number | string;

interface Resource {
  id: string;
  name: string;
  code: string;
  quantity: number;
  units: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  category?: string;
}

interface MyResource extends Resource {
  status: ResourceStatus;
}

interface MarketplaceResource extends Resource {
  available: AvailabilityStatus;
  provider?: string;
}

const Resource: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("my-resources");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Mock data remains the same
  const myResources: MyResource[] = [
    {
      id: "1",
      name: "Excavator EX200",
      code: "RES-101",
      quantity: 10,
      units: "KG",
      createdAt: "10-Mar-2025",
      updatedAt: "18-Mar-2025",
      status: "Pending",
      category: "Heavy Equipment"
    },
    {
      id: "2",
      name: "Bulldozer D6",
      code: "RES-102",
      quantity: 5,
      units: "Units",
      createdAt: "12-Mar-2025",
      updatedAt: "19-Mar-2025",
      status: "Distributed",
      category: "Heavy Equipment"
    },
    {
      id: "3",
      name: "Concrete Mixer",
      code: "RES-103",
      quantity: 8,
      units: "Units",
      createdAt: "14-Mar-2025",
      updatedAt: "20-Mar-2025",
      status: "Delivered",
      category: "Tools"
    }
  ];


  const marketplaceResources: MarketplaceResource[] = [
    {
      id: "4",
      name: "Bulldozer D8",
      code: "MKT-101",
      quantity: 3,
      units: "Units",
      createdAt: "10-Mar-2025",
      updatedAt: "18-Mar-2025",
      available: 2,
      category: "Heavy Equipment",
      provider: "ABC Construction"
    },
    {
      id: "5",
      name: "Survey Equipment",
      code: "MKT-102",
      quantity: 10,
      units: "Sets",
      createdAt: "12-Mar-2025",
      updatedAt: "19-Mar-2025",
      available: "5 sets",
      category: "Tools",
      provider: "XYZ Surveying"
    },
    {
      id: "6",
      name: "Crane 30T",
      code: "MKT-103",
      quantity: 2,
      units: "Units",
      createdAt: "14-Mar-2025",
      updatedAt: "20-Mar-2025",
      available: "Pending",
      category: "Heavy Equipment",
      provider: "Crane Specialists Inc."
    }
  ];


  const categories = ["All", "Heavy Equipment", "Tools", "Materials", "Safety"];

  // Update status colors to use slate variants for a more professional look
  const getStatusColor = (status: ResourceStatus): string => {
    switch (status) {
      case "Pending":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "Distributed":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "Delivered":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: ResourceStatus) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-slate-500" />;
      case "Distributed":
        return <Package2 className="h-4 w-4 text-slate-500" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-slate-500" />;
      default:
        return null;
    }
  };

  const getResourceInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Replace colorful gradients with professional slate backgrounds
  const getResourceBgColor = (id: string): string => {
    return "bg-slate-200";
  };

  // Sorting logic remains the same
  const sortResources = <T extends Resource>(resources: T[], column: string): T[] => {
    return [...resources].sort((a, b) => {
      let valueA = (a as any)[column];
      let valueB = (b as any)[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
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
    myResources.filter(resource =>
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterCategory.toLowerCase() === "all" || resource.category?.toLowerCase() === filterCategory.toLowerCase())
    ),
    sortColumn
  );

  const filteredMarketplaceResources = sortResources(
    marketplaceResources.filter(resource =>
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterCategory.toLowerCase() === "all" || resource.category?.toLowerCase() === filterCategory.toLowerCase())
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

  return (
    <div className="w-full mx-auto px-4 py-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Resource Management</h1>
            <p className="text-slate-500 mt-1">Track, allocate and request resources for your projects</p>
          </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Resource
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search resources by name, category or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-200">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs and Content */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-slate-200 mb-6 w-auto">
            <TabsTrigger value="my-resources">
              <span className="font-medium">My Resources</span>
              <Badge variant="outline" className="ml-2 bg-slate-100 text-slate-800 border-slate-200">
                {filteredMyResources.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="marketplace">
              <span className="font-medium">Resource Marketplace</span>
              <Badge variant="outline" className="ml-2 bg-slate-100 text-slate-800 border-slate-200">
                {filteredMarketplaceResources.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* My Resources Tab */}
          <TabsContent value="my-resources" className="mt-0">
            <Card className="border-slate-200 shadow-sm overflow-hidden p-0">
              {filteredMyResources.length > 0 ? (
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="w-[250px] text-slate-600">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900"
                        >
                          Resource
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-slate-600">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("category")}
                          className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900"
                        >
                          Category
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center text-slate-600">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("quantity")}
                          className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto"
                        >
                          Quantity
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center hidden md:table-cell text-slate-600">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("updatedAt")}
                          className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto"
                        >
                          Last Updated
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center text-slate-600">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto"
                        >
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right text-slate-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMyResources.map((resource) => (
                      <TableRow key={resource.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 rounded-md bg-slate-200">
                              <div className="text-slate-700 font-medium text-sm">{getResourceInitials(resource.name)}</div>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{resource.name}</p>
                              <p className="text-xs text-slate-500">{resource.code}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                            {resource.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div>
                            <p className="font-medium text-slate-700">{resource.quantity}</p>
                            <p className="text-xs text-slate-500">{resource.units}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center hidden md:table-cell text-slate-700">
                          {resource.updatedAt}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`flex items-center gap-1 justify-center mx-auto ${getStatusColor(resource.status)}`}>
                            {getStatusIcon(resource.status)}
                            {resource.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Resource Actions</DropdownMenuLabel>
                              <DropdownMenuItem className="text-slate-700">
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-700">
                                <Edit className="h-4 w-4 mr-2" /> Edit Resource
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-slate-700">
                                <Trash2 className="h-4 w-4 mr-2" /> Remove Resource
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No resources found matching your criteria.
                </div>
    )}
  </Card>
</TabsContent>

{/* Marketplace Tab */}
<TabsContent value="marketplace" className="mt-0">
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      {filteredMarketplaceResources.length > 0 ? (
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
                  <TableRow>
                    <TableHead className="w-[250px] text-slate-600">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900"
                      >
                        Resource
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-slate-600">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("provider")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900"
                      >
                        Provider
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-slate-600">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("category")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900"
                      >
                        Category
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center text-slate-600">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("quantity")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto"
                      >
                        Quantity
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center hidden md:table-cell text-slate-600">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("updatedAt")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto"
                      >
                        Last Updated
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center text-slate-600">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("available")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto"
                      >
                        Availability
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right text-slate-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMarketplaceResources.map((resource) => (
                    <TableRow key={resource.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-md bg-slate-200">
                            <div className="text-slate-700 font-medium text-sm">{getResourceInitials(resource.name)}</div>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{resource.name}</p>
                            <p className="text-xs text-slate-500">{resource.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {resource.provider}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                          {resource.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div>
                          <p className="font-medium text-slate-700">{resource.quantity}</p>
                          <p className="text-xs text-slate-500">{resource.units}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell text-slate-700">
                        {resource.updatedAt}
                      </TableCell>
                      <TableCell className="text-center text-slate-700">
                        {resource.available}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-8 text-slate-600 border-slate-200 hover:bg-slate-50">
                          Request Access
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                 ) : (
                  <div className="text-center py-8 text-slate-500">
                    No marketplace resources found matching your criteria.
                  </div>
                )}
              </Card>
              </TabsContent>
          </Tabs>
    </div>
  );
};

export default Resource;