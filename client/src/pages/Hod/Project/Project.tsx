import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  SlidersHorizontal,
  RotateCw,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  FileDown
} from "lucide-react";
import { Link } from 'react-router-dom';

// Types defined with consistent naming conventions
type ProjectStatus = "In Progress" | "Completed" | "Planned";
type ProjectPriority = "High" | "Medium" | "Low";
type ConflictStatus = "Unresolved" | "Resolved" | "Under Review";
type ConflictSeverity = "Critical" | "Major" | "Minor";

interface Project {
  id: string;
  name: string;
  department: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  updatedAt: string;
}

interface Conflict {
  id: string;
  name: string;
  departmentsAffected: string[];
  status: ConflictStatus;
  severity: ConflictSeverity;
  createdAt: string;
}

// Status badge styling - using shadcn color system
const STATUS_STYLES = {
  Completed: "bg-slate-100 text-slate-800 border-slate-200",
  Resolved: "bg-slate-100 text-slate-800 border-slate-200",
  "In Progress": "bg-slate-100 text-slate-800 border-slate-200",
  "Under Review": "bg-slate-100 text-slate-800 border-slate-200",
  Planned: "bg-slate-100 text-slate-800 border-slate-200",
  Unresolved: "bg-slate-100 text-slate-800 border-slate-200"
};

// Priority badge styling - using shadcn color system
const PRIORITY_STYLES = {
  High: "bg-slate-100 text-slate-800 border-slate-200",
  Critical: "bg-slate-100 text-slate-800 border-slate-200",
  Medium: "bg-slate-100 text-slate-800 border-slate-200",
  Major: "bg-slate-100 text-slate-800 border-slate-200",
  Low: "bg-slate-100 text-slate-800 border-slate-200",
  Minor: "bg-slate-100 text-slate-800 border-slate-200"
};

// Status icons with consistent styling
const STATUS_ICONS = {
  Completed: <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />,
  Resolved: <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />,
  "In Progress": <Clock className="h-3 w-3 mr-1 text-amber-500" />,
  "Under Review": <Clock className="h-3 w-3 mr-1 text-amber-500" />,
  Planned: <Building className="h-3 w-3 mr-1 text-sky-500" />,
  Unresolved: <AlertTriangle className="h-3 w-3 mr-1 text-rose-500" />
};

// Component for page header with consistent styling
const DashboardHeader: React.FC<{
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
}> = ({ title, subtitle, actionLabel, onAction }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="text-slate-500 mt-1">{subtitle}</p>
    </div>
    <Button onClick={onAction}>
      <Plus className="mr-2 h-4 w-4" />
      {actionLabel}
    </Button>
  </div>
);

// Search and filter component
const SearchAndFilters: React.FC<{
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}> = ({ searchQuery, onSearchChange, onRefresh }) => (
  <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
    <div className="relative w-full sm:w-96">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
      <Input
        placeholder="Search by name, ID, or department..."
        className="pl-8 bg-white"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    
    <div className="flex items-center gap-2 ml-auto">
      <Button variant="outline" size="sm" className="text-slate-600">
        <SlidersHorizontal className="mr-1 h-4 w-4" />
        Filter
      </Button>
      <Button variant="outline" size="sm" className="text-slate-600" onClick={onRefresh}>
        <RotateCw className="mr-1 h-4 w-4" />
        Refresh
      </Button>
      <Button variant="outline" size="sm" className="text-slate-600">
        <FileDown className="mr-1 h-4 w-4" />
        Export
      </Button>
    </div>
  </div>
);

// Reusable DataTable column header
const TableHeader: React.FC<{label: string}> = ({ label }) => (
  <th className="text-sm font-medium text-left p-3 text-slate-600">
    {label}
  </th>
);

// Table row for "no results found"
const EmptyTableRow: React.FC<{colSpan: number, message: string}> = ({ colSpan, message }) => (
  <tr>
    <td colSpan={colSpan} className="p-8 text-center text-slate-500">
      {message}
    </td>
  </tr>
);

// Badge component with consistent styling
const StatusBadge: React.FC<{status: string}> = ({ status }) => (
  <Badge 
    variant="outline" 
    className={`${STATUS_STYLES[status as keyof typeof STATUS_STYLES]} flex items-center`}
  >
    {STATUS_ICONS[status as keyof typeof STATUS_ICONS]}
    {status}
  </Badge>
);

const PriorityBadge: React.FC<{priority: string}> = ({ priority }) => {
  const iconColor = priority === "High" || priority === "Critical" 
    ? "text-rose-500" 
    : priority === "Medium" || priority === "Major" 
      ? "text-amber-500" 
      : "text-emerald-500";
  
  return (
    <Badge 
      variant="outline" 
      className={`${PRIORITY_STYLES[priority as keyof typeof PRIORITY_STYLES]}`}
    >
      <span className={`mr-1 h-2 w-2 rounded-full ${iconColor} bg-current`}></span>
      {priority}
    </Badge>
  );
};

// Main component
const ProjectsDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data - would typically come from an API
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

  // Memoize filtered data to prevent unnecessary recalculations
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
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
  }, [projects, searchQuery, activeTab]);

  const filteredConflicts = useMemo(() => {
    return conflicts.filter(conflict => 
      conflict.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      conflict.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conflict.departmentsAffected.some(dept => dept.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [conflicts, searchQuery]);

  // Handler functions
  const handleRefresh = () => {
    // This would typically fetch fresh data from the API
    console.log("Refreshing data...");
  };

  const handleCreateProject = () => {
    // Navigate to create project page or open modal
    console.log("Creating new project...");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <DashboardHeader 
        title="Projects Management"
        subtitle="Monitor and coordinate municipal projects and resolve interdepartmental conflicts"
        actionLabel="New Project"
        onAction={handleCreateProject}
      />

      <SearchAndFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
      />

      {/* Projects Card */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden py-0">
        <CardHeader className="bg-slate-50 py-3 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-slate-700 flex items-center text-lg">
              <span className="h-3 w-3 rounded-full bg-slate-400 mr-2"></span>
              Department Projects
            </CardTitle>

            <Tabs defaultValue="all" className="w-fit" onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-slate-200">
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
                <tr className="border-b bg-slate-50">
                  <TableHeader label="Project ID" />
                  <TableHeader label="Project Name" />
                  <TableHeader label="Department" />
                  <TableHeader label="Priority" />
                  <TableHeader label="Status" />
                  <TableHeader label="Last Updated" />
                  <TableHeader label="View" />
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">
                        <Link to={`/hod/projects/${project.id}`} className="text-slate-900 hover:text-slate-700">
                          {project.id}
                        </Link>
                      </td>
                      <td className="p-3 font-medium text-slate-900">{project.name}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="bg-slate-50 font-normal text-slate-700">
                          {project.department}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <PriorityBadge priority={project.priority} />
                      </td>
                      <td className="p-3">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="p-3 text-slate-500 text-sm">
                        {formatDate(project.updatedAt)}
                      </td>
                      <td className="p-3 text-center">
                        <Link to={`/hod/projects/${project.id}`} className="text-slate-500 hover:text-slate-700">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyTableRow colSpan={7} message="No matching projects found" />
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center p-3 bg-slate-50 text-sm text-slate-500">
          <div>Displaying {filteredProjects.length} of {projects.length} projects</div>
          <Button variant="outline" size="sm" className="text-slate-600">View All Projects</Button>
        </CardFooter>
      </Card>

      {/* Conflicts Card */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden py-0">
        <CardHeader className="bg-slate-50 py-3 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-slate-700 flex items-center text-lg">
              <span className="h-3 w-3 rounded-full bg-slate-400 mr-2"></span>
              Project Conflicts
            </CardTitle>
            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
              {conflicts.filter(c => c.status === "Unresolved").length} Unresolved
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <TableHeader label="Conflict ID" />
                  <TableHeader label="Issue Description" />
                  <TableHeader label="Departments Involved" />
                  <TableHeader label="Severity" />
                  <TableHeader label="Status" />
                  <TableHeader label="Reported" />
                  <TableHeader label="View" />
                </tr>
              </thead>
              <tbody>
                {filteredConflicts.length > 0 ? (
                  filteredConflicts.map((conflict) => (
                    <tr key={conflict.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">
                        <Link to={`/hod/conflicts/${conflict.id}`} className="text-slate-900 hover:text-slate-700">
                          {conflict.id}
                        </Link>
                      </td>
                      <td className="p-3 font-medium text-slate-900">{conflict.name}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {conflict.departmentsAffected.map((dept, i) => (
                            <Badge key={i} variant="outline" className="bg-slate-50 font-normal text-slate-700">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <PriorityBadge priority={conflict.severity} />
                      </td>
                      <td className="p-3">
                        <StatusBadge status={conflict.status} />
                      </td>
                      <td className="p-3 text-slate-500 text-sm">
                        {formatDate(conflict.createdAt)}
                      </td>
                      <td className="p-3 text-center">
                        <Link to={`/hod/conflicts/${conflict.id}`} className="text-slate-500 hover:text-slate-700">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyTableRow colSpan={7} message="No matching conflicts found" />
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center p-3 bg-slate-50 text-sm text-slate-500">
          <div>Displaying {filteredConflicts.length} of {conflicts.length} conflicts</div>
          <Button variant="outline" size="sm" className="text-slate-600">View All Conflicts</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectsDashboard;