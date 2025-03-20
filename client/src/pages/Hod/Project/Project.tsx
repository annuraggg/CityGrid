import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building
} from "lucide-react";
import { Link } from 'react-router-dom';

// Enhanced type definitions with more properties
type Project = {
  id: string;
  name: string;
  department: string;
  status: "In Progress" | "Completed" | "Planned";
  priority: "High" | "Medium" | "Low";
  updatedAt: string;
};

type Conflict = {
  id: string;
  name: string;
  departmentsAffected: string[];
  status: "Unresolved" | "Resolved" | "Under Review";
  severity: "Critical" | "Major" | "Minor";
  createdAt: string;
};

const ProjectsDashboard: React.FC = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Enhanced mock data
  const projects: Project[] = [
    {
      id: "PRJ-101",
      name: "Metro Waterline Upgrade",
      department: "Water Supply",
      status: "In Progress",
      priority: "High",
      updatedAt: "2025-03-15",
    },
    {
      id: "PRJ-202",
      name: "Smart Grid Installation",
      department: "Energy",
      status: "Completed",
      priority: "Medium",
      updatedAt: "2025-03-10",
    },
    {
      id: "PRJ-303",
      name: "Road Expansion Phase 2",
      department: "Public Works",
      status: "In Progress",
      priority: "High",
      updatedAt: "2025-03-18",
    },
    {
      id: "PRJ-404",
      name: "City Park Renovation",
      department: "Parks & Recreation",
      status: "Planned",
      priority: "Medium",
      updatedAt: "2025-03-05",
    },
  ];

  const conflicts: Conflict[] = [
    {
      id: "CNF-001",
      name: "Waterline vs Gas Pipeline Intersection",
      departmentsAffected: ["Water Supply", "Gas"],
      status: "Unresolved",
      severity: "Critical",
      createdAt: "2025-03-12",
    },
    {
      id: "CNF-002",
      name: "Road Expansion vs Telecom Infrastructure",
      departmentsAffected: ["Public Works", "Telecommunications"],
      status: "Resolved",
      severity: "Major",
      createdAt: "2025-03-08",
    },
    {
      id: "CNF-003",
      name: "Smart Grid vs Underground Drainage Work",
      departmentsAffected: ["Energy", "Sanitation"],
      status: "Under Review",
      severity: "Minor",
      createdAt: "2025-03-14",
    },
  ];

  // Filter projects based on search query and active tab
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "inProgress" && project.status === "In Progress") ||
      (activeTab === "completed" && project.status === "Completed") ||
      (activeTab === "planned" && project.status === "Planned");
    
    return matchesSearch && matchesTab;
  });

  // Filter conflicts based on search query
  const filteredConflicts = conflicts.filter(conflict => 
    conflict.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    conflict.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conflict.departmentsAffected.some(dept => dept.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Status badge styling helper function
  const getStatusBadgeStyles = (status: string) => {
    switch(status) {
      case "Completed":
      case "Resolved":
        return "bg-green-100 text-green-600 border-green-200";
      case "In Progress":
      case "Under Review":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "Planned":
        return "bg-purple-100 text-purple-600 border-purple-200";
      case "Unresolved":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Completed":
      case "Resolved":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "In Progress":
      case "Under Review":
        return <Clock className="h-3 w-3 mr-1" />;
      case "Planned":
        return <Building className="h-3 w-3 mr-1" />;
      case "Unresolved":
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  // Priority badge styling helper function
  const getPriorityBadgeStyles = (priority: string) => {
    switch(priority) {
      case "High":
      case "Critical":
        return "bg-red-50 text-red-600 border-red-200";
      case "Medium":
      case "Major":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "Low":
      case "Minor":
        return "bg-green-50 text-green-600 border-green-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage all your municipal projects and conflicts</p>
        </div>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Create New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search projects or conflicts..."
            className="pl-8 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" className="text-gray-500">
            <Filter className="mr-1 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="text-gray-500">
            <RefreshCw className="mr-1 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="border-2 border-blue-200 shadow-sm">
        <CardHeader className="bg-blue-50 py-3 px-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-700 flex items-center text-lg">
              <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
              Department Projects
            </CardTitle>

            <Tabs defaultValue="all" className="w-fit" onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-blue-100">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                <TabsTrigger value="planned">Planned</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Project ID
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Project Name
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Department
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Priority
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Status
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Last Updated
                  </th>
                  <th className="text-sm font-medium text-center p-3 text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        <Link to={`/hod/projects/${project.id}`} className="text-blue-600 hover:underline">
                          {project.id}
                        </Link>
                      </td>
                      <td className="p-3">{project.name}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="bg-gray-50 font-normal">
                          {project.department}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`${getPriorityBadgeStyles(project.priority)} font-normal`}>
                          {project.priority}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`${getStatusBadgeStyles(project.status)} flex items-center`}>
                          {getStatusIcon(project.status)}
                          {project.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-500 text-sm">
                        {new Date(project.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-3 text-center">
                        <Link to={`/hod/projects/${project.id}`} className="text-blue-600 hover:text-blue-800">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No projects match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center p-2 bg-gray-50 text-sm text-gray-500">
          <div>Showing {filteredProjects.length} of {projects.length} projects</div>
          <Button variant="outline" size="sm" className="text-xs">View All Projects</Button>
        </CardFooter>
      </Card>

      <Card className="border-2 border-red-200 shadow-sm">
        <CardHeader className="bg-red-50 py-3 px-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-red-700 flex items-center text-lg">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              Project Conflicts
            </CardTitle>
            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
              {conflicts.filter(c => c.status === "Unresolved").length} Unresolved
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Conflict ID
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Conflict Name
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Departments Affected
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Severity
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Status
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Created On
                  </th>
                  <th className="text-sm font-medium text-center p-3 text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredConflicts.length > 0 ? (
                  filteredConflicts.map((conflict) => (
                    <tr key={conflict.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        <Link to={`/hod/conflicts/${conflict.id}`} className="text-blue-600 hover:underline">
                          {conflict.id}
                        </Link>
                      </td>
                      <td className="p-3">{conflict.name}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {conflict.departmentsAffected.map((dept, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-50 font-normal">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`${getPriorityBadgeStyles(conflict.severity)} font-normal`}>
                          {conflict.severity}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`${getStatusBadgeStyles(conflict.status)} flex items-center`}>
                          {getStatusIcon(conflict.status)}
                          {conflict.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-500 text-sm">
                        {new Date(conflict.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-3 text-center">
                        <Link to={`/hod/conflicts/${conflict.id}`} className="text-blue-600 hover:text-blue-800">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No conflicts match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center p-2 bg-gray-50 text-sm text-gray-500">
          <div>Showing {filteredConflicts.length} of {conflicts.length} conflicts</div>
          <Button variant="outline" size="sm" className="text-xs">View All Conflicts</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectsDashboard;