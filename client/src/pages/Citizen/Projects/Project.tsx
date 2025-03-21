import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Clock,
  Filter,
  ArrowDownAZ,
  ChevronDown,
  Search,
  Building,
  FileText,
  Briefcase,
  LayoutGrid,
  RotateCw,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const OngoingProjects = () => {
  // Sample data for ongoing projects
  const projects = [
    { id: "PRJ-101", name: "Metro Waterline Upgrade", department: "Water Supply", status: "In Progress", location: "Sector 12, Mumbai" },
    { id: "PRJ-202", name: "Smart Grid Installation", department: "Energy", status: "Completed", location: "Thane West" },
    { id: "PRJ-303", name: "Road Expansion Phase 2", department: "Public Works", status: "In Progress", location: "Pune City" }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Define interface for status counts
  interface StatusCounts {
    [key: string]: number;
  }

  // Count projects by status
  const statusCounts = projects.reduce((counts: StatusCounts, project) => {
    const status = project.status.replace(/\s+/g, '').toLowerCase();
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {} as StatusCounts);

  // Total count
  const totalCount = projects.length;

  // Filter projects based on search and active tab
  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      project.status.replace(/\s+/g, '').toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesTab;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 'In Progress':
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="text-emerald-600" size={16} />;
      case 'In Progress':
        return <Clock className="text-amber-600" size={16} />;
      default:
        return <Clock className="text-slate-500" size={16} />;
    }
  };

  const TableHeader = ({ label }: { label: string }) => (
    <th className="text-sm font-medium text-left p-3 text-slate-600">
      {label}
    </th>
  );

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Dashboard Header with Title and Button */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Ongoing Projects</h1>
            <p className="text-slate-500 text-base">Monitor and track municipal development projects</p>
          </div>
          <Button
            variant="outline"
            className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 text-sm font-medium"
          >
            <Building className="h-4 w-4 mr-2 text-slate-500" />
            Municipal Corp: BMC
            <ChevronDown className="h-4 w-4 ml-2 text-slate-500" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by ID, name or department"
              className="pl-10 bg-white border-slate-200 h-10 text-slate-800 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
            >
              <ArrowDownAZ className="h-4 w-4 mr-2 text-slate-500" />
              Sort: Newest
            </Button>
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
              <RotateCw className="h-4 w-4 mr-2 text-slate-500" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
        <CardHeader className="bg-slate-50 py-4 px-5 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-slate-800 flex items-center text-lg font-semibold">
              <span className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></span>
              Project Dashboard
            </CardTitle>

            <Tabs defaultValue={activeTab} className="w-fit" onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-slate-200 h-9 p-1">
                <TabsTrigger
                  value="all"
                  className="px-3 h-7 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                >
                  All
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
                    {totalCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="inprogress"
                  className="px-3 h-7 text-sm font-medium data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
                >
                  In Progress
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-medium text-amber-700">
                    {statusCounts.inprogress || 0}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="px-3 h-7 text-sm font-medium data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  Completed
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-700">
                    {statusCounts.completed || 0}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {filteredProjects.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <TableHeader label="Project ID" />
                    <TableHeader label="Project Name" />
                    <TableHeader label="Department" />
                    <TableHeader label="Location" />
                    <TableHeader label="Status" />
                    <TableHeader label="View" />
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-slate-500" />
                          <span className="text-slate-900">{project.id}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-slate-500" />
                          <span className="text-slate-700">{project.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Building size={16} className="text-slate-500" />
                          <span className="text-slate-700">{project.department}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700">{project.location}</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={`flex items-center gap-1.5 px-2.5 py-0.5 ${getStatusBadgeClass(project.status)}`}
                        >
                          {getStatusIcon(project.status)}
                          {project.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Link to={`/citizen/projects/${project.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Search size={48} className="mb-3 text-slate-300" />
                  <p className="text-lg font-medium mb-1">No projects found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
          <div>Showing {filteredProjects.length} of {totalCount} projects</div>
          <div className="flex items-center gap-2">
            <span>Updated: 2025-03-21</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OngoingProjects;