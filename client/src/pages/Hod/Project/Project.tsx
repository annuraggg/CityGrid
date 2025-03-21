import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
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
} from "lucide-react";
import { Link } from "react-router-dom";
import Conflict from "@/types/Conflict";
import Project from "@/types/Project";
import { useAuth, useUser } from "@clerk/clerk-react";
import ax from "@/config/axios";

const ProjectsDashboard: React.FC = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  const { getToken } = useAuth();
  const { user } = useUser();
  const axios = ax(getToken);

  useEffect(() => {
    if (!user) return;
    axios
      .get("/projects/department/" + user.publicMetadata.department)
      .then((res) => {
        setProjects(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get("/conflicts/department/" + user.publicMetadata.department)
      .then((res) => {
        setConflicts(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user]);

  // Filter conflicts based on search query
  const filteredConflicts = conflicts.filter(
    (conflict) =>
      conflict.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conflict.conflictingProject
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Status badge styling helper function
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-600 border-green-200";
      case "pending":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "pending":
        return <Clock className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Projects Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all your municipal projects and conflicts
          </p>
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
                    Manager
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Schedule
                  </th>
                  <th className="text-sm font-medium text-center p-3 text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <tr key={project._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        <Link
                          to={`/hod/projects/${project._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {project._id}
                        </Link>
                      </td>
                      <td className="p-3">{project.name}</td>
                      <td className="p-3">
                        {project.department && (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 font-normal"
                          >
                            {project.department}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">{project.manager}</td>
                      <td className="p-3 text-gray-500 text-sm">
                        {project.schedule?.start.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {" - "}
                        {project.schedule?.end.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {project.schedule?.isRescheduled && (
                          <Badge className="ml-2 bg-yellow-100 text-yellow-700 border-yellow-200">
                            Rescheduled
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <Link
                          to={`/hod/projects/${project._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No projects match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center p-2 bg-gray-50 text-sm text-gray-500">
          <div>
            Showing {projects.length} of {projects.length} projects
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            View All Projects
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-2 border-red-200 shadow-sm">
        <CardHeader className="bg-red-50 py-3 px-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-red-700 flex items-center text-lg">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              Project Conflicts
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-red-100 text-red-700 border-red-200"
            >
              {conflicts.filter((c) => c.status === "pending").length} Pending
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Project
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Conflicting Project
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Status
                  </th>
                  <th className="text-sm font-medium text-left p-3 text-gray-600">
                    Created On
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
                {filteredConflicts.length > 0 ? (
                  filteredConflicts.map((conflict, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        <Link
                          to={`/hod/projects/${conflict.project}`}
                          className="text-blue-600 hover:underline"
                        >
                          {conflict.project}
                        </Link>
                      </td>
                      <td className="p-3">
                        <Link
                          to={`/hod/projects/${conflict.conflictingProject}`}
                          className="text-blue-600 hover:underline"
                        >
                          {conflict.conflictingProject}
                        </Link>
                      </td>
                      <td className="p-3">
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
                      <td className="p-3 text-gray-500 text-sm">
                        {conflict.createdAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-3 text-gray-500 text-sm">
                        {conflict.updatedAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-3 text-center">
                        <Link
                          to={`/hod/conflicts/${index}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No conflicts match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center p-2 bg-gray-50 text-sm text-gray-500">
          <div>
            Showing {filteredConflicts.length} of {conflicts.length} conflicts
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            View All Conflicts
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectsDashboard;
