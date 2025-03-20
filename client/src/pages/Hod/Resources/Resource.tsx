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

  const getStatusColor = (status: ResourceStatus): string => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Distributed":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ResourceStatus) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "Distributed":
        return <Package2 className="h-4 w-4 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
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

  const getResourceBgColor = (id: string): string => {
    const colors = [
      "from-purple-500 to-indigo-600",
      "from-blue-500 to-cyan-600",
      "from-green-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-red-500 to-pink-600"
    ];
    const index = parseInt(id) % colors.length;
    return colors[index];
  };

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
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resources</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="default" size="sm" className="flex items-center gap-2">
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
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-50 rounded-t-lg p-0 w-full">
              <TabsTrigger
                value="my-resources"
                className="flex items-center gap-2 py-4 px-6 rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium">My Resources</span>
                <Badge variant="secondary" className="ml-2">{filteredMyResources.length}</Badge>
              </TabsTrigger>
              <TabsTrigger
                value="marketplace"
                className="flex items-center gap-2 py-4 px-6 rounded-none data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Resource Marketplace</span>
                <Badge variant="secondary" className="ml-2">{filteredMarketplaceResources.length}</Badge>
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
                        <TableHead className="text-center">
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
                      {filteredMyResources.map((resource) => (
                        <TableRow key={resource.id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className={`h-10 w-10 rounded-md bg-gradient-to-br ${getResourceBgColor(resource.id)}`}>
                                <div className="text-white font-medium text-sm">{getResourceInitials(resource.name)}</div>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800">{resource.name}</p>
                                <p className="text-xs text-gray-500">{resource.code}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{resource.category}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div>
                              <p className="font-medium">{resource.quantity}</p>
                              <p className="text-xs text-gray-500">{resource.units}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center hidden md:table-cell">
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
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" /> Edit Resource
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
                            onClick={() => handleSort("provider")} 
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Provider
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
                        <TableHead className="text-center">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort("available")} 
                            className="flex items-center gap-1 font-medium p-0 h-auto"
                          >
                            Available
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMarketplaceResources.map((resource) => (
                        <TableRow key={resource.id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className={`h-10 w-10 rounded-md bg-gradient-to-br ${getResourceBgColor(resource.id)}`}>
                                <div className="text-white font-medium text-sm">{getResourceInitials(resource.name)}</div>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800">{resource.name}</p>
                                <p className="text-xs text-gray-500">{resource.code}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {resource.provider}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{resource.category}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div>
                              <p className="font-medium">{resource.quantity}</p>
                              <p className="text-xs text-gray-500">{resource.units}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center hidden md:table-cell">
                            {resource.updatedAt}
                          </TableCell>
                          <TableCell className="text-center">
                            <p className="font-medium text-green-600">{resource.available}</p>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Button size="sm" variant="outline" className="h-8">Request</Button>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resource;