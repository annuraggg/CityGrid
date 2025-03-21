import Loader from "@/components/ui/Loader";
import ax from "@/config/axios";
import IProject from "@/types/Project";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  FolderOpen,
  Plus,
  Building,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Conflict from "@/types/Conflict";

const Project = () => {
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [viewType, setViewType] = useState("grid"); // grid or list
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects/manager");
      const conflictsRes = await axios.get("/conflicts/department");
      setConflicts(conflictsRes.data.data);
      setProjects(res.data.data);
      setLoading(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch projects");
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "NO Data";
    }
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    return `${diffDays} days remaining`;
  };

  // Calculate project status
  const getProjectStatus = (project: IProject) => {
    const today = new Date();
    const endDate = new Date(project.schedule?.end);

    if (today > endDate) return "completed";

    const startDate = new Date(project.schedule?.start);
    if (today < startDate) return "upcoming";

    return "in-progress";
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle redirect to project details
  const goToProjectDetails = (projectId: string) => {
    navigate(`/project-manager/projects/${projectId}`);
  };

  // Handle redirect to create new project
  const goToCreateProject = () => {
    navigate("create");
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and monitor your projects</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewType("grid")}
              className={`px-3 py-2 ${
                viewType === "grid" ? "bg-primary text-white" : "bg-white"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`px-3 py-2 ${
                viewType === "list" ? "bg-primary text-white" : "bg-white"
              }`}
            >
              List
            </button>
          </div>
          <Button
            className="flex items-center gap-2 cursor-pointer"
            onClick={goToCreateProject}
          >
            <Plus size={16} />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Projects
                </p>
                <p className="text-3xl font-bold mt-1">{projects.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-3xl font-bold mt-1">
                  {
                    projects.filter(
                      (p) => getProjectStatus(p) === "in-progress"
                    ).length
                  }
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-3xl font-bold mt-1">
                  {
                    projects.filter((p) => getProjectStatus(p) === "completed")
                      .length
                  }
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-3xl font-bold mt-1">
                  {
                    projects.filter((p) => getProjectStatus(p) === "upcoming")
                      .length
                  }
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project List View */}
      {viewType === "list" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {project.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {project.department || "General"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(project.schedule?.start.toString())} -{" "}
                      {formatDate(project.schedule?.end.toString())}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getDaysRemaining(project.schedule?.end.toString())}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        getProjectStatus(project)
                      )}`}
                    >
                      {getProjectStatus(project)}
                    </span>
                    {project.schedule?.isRescheduled && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Rescheduled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToProjectDetails(project._id!)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {viewType === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const isConflicting =
              conflicts.some((conflict) => conflict.project === project._id) ||
              conflicts.some(
                (conflict) => conflict.conflictingProject === project._id
              );
            return (
              <Card
                key={project.name}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <Badge
                      className={getStatusColor(getProjectStatus(project))}
                    >
                      {getProjectStatus(project)}
                    </Badge>
                    {isConflicting && (
                      <Badge className="bg-red-500">Conflicting</Badge>
                    )}
                  </div>
                  {project.department && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Building size={14} className="mr-1" />
                      {project.department}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <CalendarIcon size={14} className="mr-2" />
                    <div>
                      <span className="font-medium">Timeline: </span>
                      {formatDate(project.schedule?.start.toString())} -{" "}
                      {formatDate(project.schedule?.end.toString())}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      {project.documents.length > 0 && (
                        <span className="mr-4">
                          <FileText size={14} className="inline mr-1" />
                          {project.documents.length} document
                          {project.documents.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {project.resources.length > 0 && (
                        <span>
                          <FolderOpen size={14} className="inline mr-1" />
                          {project.resources.length} resource
                          {project.resources.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {project.schedule?.isRescheduled && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-800 border-yellow-200"
                      >
                        Rescheduled
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToProjectDetails(project._id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Show message if no projects */}
      {projects.length === 0 && (
        <Card className="p-8 text-center">
          <div className="mx-auto bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-gray-500" />
          </div>
          <CardTitle className="text-xl mb-2">No projects found</CardTitle>
          <CardDescription>
            Get started by creating your first project
          </CardDescription>
        </Card>
      )}
    </div>
  );
};

export default Project;
