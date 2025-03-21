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

  // Update status colors to use our dashboard color system
  const getStatusColor = (status: ResourceStatus): string => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Distributed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: ResourceStatus) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "Distributed":
        return <Package2 className="h-4 w-4 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
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
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Header with improved spacing and visual hierarchy */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Resource Management</h1>
            <p className="text-slate-500 text-base">Track, allocate and request resources for your projects</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
            >
              <Filter className="h-4 w-4 mr-2 text-slate-500" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
            >
              <Download className="h-4 w-4 mr-2 text-slate-500" />
              Export
            </Button>
            <Button 
              size="sm" 
              className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters - Updated with consistent styling */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search resources by name, category or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200 h-10 text-slate-800 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[180px] bg-white border-slate-200 h-10 text-slate-700">
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
        </div>
      </div>

      {/* Tabs and Content - Updated styling to match system */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white border border-slate-200 mb-6 w-auto h-11 p-1">
          <TabsTrigger 
            value="my-resources" 
            className="h-9 px-4 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
          >
            <span>My Resources</span>
            <Badge 
              variant="outline" 
              className="ml-2 bg-indigo-100 text-indigo-700 border-indigo-200 font-medium"
            >
              {filteredMyResources.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="marketplace" 
            className="h-9 px-4 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
          >
            <span>Resource Marketplace</span>
            <Badge 
              variant="outline" 
              className="ml-2 bg-indigo-100 text-indigo-700 border-indigo-200 font-medium"
            >
              {filteredMarketplaceResources.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* My Resources Tab */}
        <TabsContent value="my-resources" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
            {filteredMyResources.length > 0 ? (
              <Table>
                <TableHeader className="bg-slate-50 border-b border-slate-200">
                  <TableRow>
                    <TableHead className="w-[250px] text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Resource
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("category")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Category
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("quantity")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto font-medium"
                      >
                        Quantity
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center hidden md:table-cell text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("updatedAt")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto font-medium"
                      >
                        Last Updated
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto font-medium"
                      >
                        Status
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right text-slate-600 font-medium w-24 pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMyResources.map((resource) => (
                    <TableRow key={resource.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-md bg-indigo-100">
                            <div className="text-indigo-700 font-medium text-sm">{getResourceInitials(resource.name)}</div>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{resource.name}</p>
                            <p className="text-xs text-slate-500">{resource.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
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
                          <span>{resource.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 border-slate-200">
                            <DropdownMenuLabel className="text-slate-700">Resource Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-100" />
                            <DropdownMenuItem className="text-slate-700 cursor-pointer">
                              <Eye className="h-4 w-4 mr-2 text-slate-500" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-700 cursor-pointer">
                              <Edit className="h-4 w-4 mr-2 text-slate-500" /> Edit Resource
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100" />
                            <DropdownMenuItem className="text-red-600 cursor-pointer">
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
              <div className="flex flex-col items-center justify-center py-12">
                <Package2 className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 mb-1">No resources found</p>
                <p className="text-sm text-slate-400">
                  {searchQuery || filterCategory !== "all" 
                    ? "Try changing your search or filter criteria" 
                    : "Add a new resource to get started"}
                </p>
                {(searchQuery || filterCategory !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterCategory("all");
                    }}
                    className="mt-3 text-slate-600 border-slate-200 hover:bg-slate-50"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
            {filteredMyResources.length > 0 && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
                Showing {filteredMyResources.length} of {myResources.length} resources
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
            {filteredMarketplaceResources.length > 0 ? (
              <Table>
                <TableHeader className="bg-slate-50 border-b border-slate-200">
                  <TableRow>
                    <TableHead className="w-[250px] text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Resource
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("provider")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Provider
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("category")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Category
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("quantity")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto font-medium"
                      >
                        Quantity
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center hidden md:table-cell text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("updatedAt")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto font-medium"
                      >
                        Last Updated
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center text-slate-600 font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("available")}
                        className="flex items-center gap-1 p-0 h-auto text-slate-600 hover:text-slate-900 mx-auto font-medium"
                      >
                        Availability
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right text-slate-600 font-medium w-32 pr-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMarketplaceResources.map((resource) => (
                    <TableRow key={resource.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-md bg-indigo-100">
                            <div className="text-indigo-700 font-medium text-sm">{getResourceInitials(resource.name)}</div>
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
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-medium"
                        >
                          Request Access
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Package2 className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 mb-1">No marketplace resources found</p>
                <p className="text-sm text-slate-400">
                  {searchQuery || filterCategory !== "all" 
                    ? "Try changing your search or filter criteria" 
                    : "Check back later for new resources"}
                </p>
                {(searchQuery || filterCategory !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterCategory("all");
                    }}
                    className="mt-3 text-slate-600 border-slate-200 hover:bg-slate-50"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
            {filteredMarketplaceResources.length > 0 && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
                Showing {filteredMarketplaceResources.length} of {marketplaceResources.length} marketplace resources
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resource;