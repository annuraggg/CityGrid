import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import ax from "@/config/axios";

// Define proper TypeScript interfaces
interface Schedule {
  start: string;
  end: string;
  isRescheduled?: boolean;
}

interface Project {
  _id: string;
  name: string;
  department?: string;
  manager?: string;
  schedule?: Schedule;
  createdAt: string;
  updatedAt: string;
}

interface Conflict {
  _id: string;
  project: string;
  conflictingProject: string;
  status: "pending" | "resolved" | "reviewing";
  createdAt: string;
  updatedAt: string;
}

const ProjectsDashboard: React.FC = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { getToken } = useAuth();
  const { user } = useUser();
  const axios = ax(getToken);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const department = user.publicMetadata.department as string;

        const [projectsRes, conflictsRes] = await Promise.all([
          axios.get(`/projects/department/${department}`),
          axios.get(`/conflicts/department/${department}`),
        ]);

        setProjects(projectsRes.data.data);
        setConflicts(conflictsRes.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, axios]);

  // Filter conflicts based on search query
  const filteredConflicts = conflicts.filter(
    (conflict) =>
      conflict.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conflict.conflictingProject
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.manager?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status badge styling helper function
  const getStatusBadgeStyles = (status: string): string => {
    switch (status) {
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "pending":
        return <Clock className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  // Format date helper
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Truncate ID for better display
  const truncateId = (id: string): string => {
    if (!id) return "N/A";

    return id.length > 10
      ? `${id.substring(0, 5)}...${id.substring(id.length - 5)}`
      : id;
  };

  return (
    <div className="w-full mx-auto p-6 space-y-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Projects Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Overview of municipal projects and resource conflicts
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search projects or conflicts..."
            className="pl-9 bg-white border-slate-300 focus:border-indigo-400 focus:ring-indigo-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="text-slate-600 border-slate-300"
          >
            <Filter className="mr-1.5 h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-slate-600 border-slate-300"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
          >
            <RefreshCw
              className={`mr-1.5 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
      ) : (
        <>
          <Card className="border border-slate-200 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 py-4 px-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-indigo-700 text-xl font-semibold">
                    Department Projects
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    Currently showing {filteredProjects.length} projects
                  </CardDescription>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700 border-none px-3 py-1">
                  {projects.length} Total
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-sm font-medium text-left px-6 py-3 text-slate-600">
                        Project ID
                      </th>
                      <th className="text-sm font-medium text-left px-6 py-3 text-slate-600">
                        Project Name
                      </th>
                      <th className="text-sm font-medium text-left px-6 py-3 text-slate-600">
                        Department
                      </th>
                      <th className="text-sm font-medium text-left px-6 py-3 text-slate-600">
                        Manager
                      </th>
                      <th className="text-sm font-medium text-left px-6 py-3 text-slate-600">
                        Schedule
                      </th>
                      <th className="text-sm font-medium text-center px-6 py-3 text-slate-600">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <tr
                          key={project._id}
                          className="border-b hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium">
                            <Link
                              to={`/hod/projects/${project._id}`}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                            >
                              <span className="bg-indigo-50 px-2 py-1 rounded text-xs font-mono">
                                {truncateId(project._id)}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {project.name}
                          </td>
                          <td className="px-6 py-4">
                            {project.department && (
                              <Badge
                                variant="outline"
                                className="bg-slate-50 text-slate-700 border-slate-200"
                              >
                                {project.department}
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-700">
                            <div className="flex items-center">
                              <User className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
                              {project.manager || "Unassigned"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
                              <span>
                                {project.schedule ? (
                                  <>
                                    {formatDate(project.schedule.start)} -{" "}
                                    {formatDate(project.schedule.end)}
                                  </>
                                ) : (
                                  "Not scheduled"
                                )}
                              </span>
                              {project.schedule?.isRescheduled && (
                                <Badge className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                                  Rescheduled
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Link
                              to={`/hod/projects/${project._id}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-full hover:bg-indigo-50"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-slate-500"
                        >
                          <div className="flex flex-col items-center">
                            <Search className="h-10 w-10 text-slate-300 mb-3" />
                            <p>No projects match your search criteria</p>
                            {searchQuery && (
                              <Button
                                variant="link"
                                className="mt-2 text-indigo-600"
                                onClick={() => setSearchQuery("")}
                              >
                                Clear search
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center py-3 px-6 bg-slate-50 text-sm text-slate-500 border-t border-slate-200">
              <div>
                Showing {filteredProjects.length} of {projects.length} projects
              </div>
              <Link
                to="/hod/projects"
                className="text-xs px-3 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 text-slate-700 transition-colors"
              >
                Show All Projects
              </Link>
            </CardFooter>
          </Card>

          <Card className="border border-slate-200 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-amber-50 py-4 px-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-rose-700 text-xl font-semibold flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Project Conflicts
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    Resource, schedule and location conflicts between projects
                  </CardDescription>
                </div>
                <Badge className="bg-rose-100 text-rose-700 border-none px-3 py-1">
                  {conflicts.filter((c) => c.status === "pending").length}{" "}
                  Pending Resolution
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-sm font-medium text-left px-6 py-3 text-slate-600">
                        Project
                      </th>
                      <th className="text-sm font-medium text-left px-6 py-3 text-slate-600">
                        Conflicting Project
                      </th>
                      <th className="text-sm font-medium text-left px-6 py-3 text-slate-600">
                        Status
                      </th>
                      <th className="text-sm font-medium text-left px-6 py-3 text-slate-600">
                        Created On
                      </th>
                      <th className="text-sm font-medium text-left px-6 py-3 text-slate-600">
                        Last Updated
                      </th>
                      <th className="text-sm font-medium text-center px-6 py-3 text-slate-600">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConflicts.length > 0 ? (
                      filteredConflicts.map((conflict) => (
                        <tr
                          key={conflict._id}
                          className="border-b hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium">
                            <Link
                              to={`/hod/projects/${conflict.project}`}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              <span className="bg-indigo-50 px-2 py-1 rounded text-xs font-mono">
                                {truncateId(conflict.project)}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4 font-medium">
                            <Link
                              to={`/hod/projects/${conflict.conflictingProject}`}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              <span className="bg-indigo-50 px-2 py-1 rounded text-xs font-mono">
                                {truncateId(conflict.conflictingProject)}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={`${getStatusBadgeStyles(
                                conflict.status
                              )} flex items-center`}
                            >
                              {getStatusIcon(conflict.status)}
                              {conflict.status.charAt(0).toUpperCase() +
                                conflict.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm">
                            {formatDate(conflict.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm">
                            {formatDate(conflict.updatedAt)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Link
                              to={`/hod/conflicts/${conflict._id}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-full hover:bg-indigo-50"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-slate-500"
                        >
                          <div className="flex flex-col items-center">
                            <Search className="h-10 w-10 text-slate-300 mb-3" />
                            <p>No conflicts match your search criteria</p>
                            {searchQuery && (
                              <Button
                                variant="link"
                                className="mt-2 text-indigo-600"
                                onClick={() => setSearchQuery("")}
                              >
                                Clear search
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center py-3 px-6 bg-slate-50 text-sm text-slate-500 border-t border-slate-200">
              <div>
                Showing {filteredConflicts.length} of {conflicts.length}{" "}
                conflicts
              </div>
              <Link
                to="/hod/conflicts"
                className="text-xs px-3 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 text-slate-700 transition-colors"
              >
                Show All Conflicts
              </Link>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProjectsDashboard;
