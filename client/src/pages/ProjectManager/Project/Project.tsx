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
  ChevronRight,
  LayoutGrid,
  List,
  AlertCircle,
  CheckCircle2,
  RotateCw
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Project = () => {
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [viewType, setViewType] = useState("grid"); // grid or list
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects/manager");
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
      return "No Data";
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

  // Get status badge config
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { 
          bgColor: "bg-emerald-50", 
          textColor: "text-emerald-700", 
          borderColor: "border-emerald-200",
          icon: <CheckCircle2 size={14} className="mr-1.5" />
        };
      case "in-progress":
        return { 
          bgColor: "bg-amber-50", 
          textColor: "text-amber-700", 
          borderColor: "border-amber-200",
          icon: <Clock size={14} className="mr-1.5" />
        };
      case "upcoming":
        return { 
          bgColor: "bg-indigo-50", 
          textColor: "text-indigo-700", 
          borderColor: "border-indigo-200",
          icon: <CalendarIcon size={14} className="mr-1.5" /> 
        };
      default:
        return { 
          bgColor: "bg-slate-50", 
          textColor: "text-slate-700", 
          borderColor: "border-slate-200",
          icon: <AlertCircle size={14} className="mr-1.5" /> 
        };
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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <RotateCw className="animate-spin h-8 w-8 text-indigo-600" />
    </div>
  );

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Dashboard Header with Title and Button */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Projects Dashboard</h1>
            <p className="text-slate-500 text-base">Manage and monitor your assigned projects</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex border border-slate-200 rounded-md overflow-hidden">
              <Button
                type="button"
                onClick={() => setViewType("grid")}
                variant="ghost"
                size="sm"
                className={`h-9 px-3 text-sm rounded-none border-r border-slate-200 ${
                  viewType === "grid" 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid size={16} className="mr-1.5" />
                Grid
              </Button>
              <Button
                type="button"
                onClick={() => setViewType("list")}
                variant="ghost"
                size="sm"
                className={`h-9 px-3 text-sm rounded-none ${
                  viewType === "list" 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <List size={16} className="mr-1.5" />
                List
              </Button>
            </div>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
              onClick={goToCreateProject}
            >
              <Plus size={16} className="mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Projects
                </p>
                <p className="text-3xl font-bold mt-1 text-slate-900">{projects.length}</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-full">
                <FolderOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">In Progress</p>
                <p className="text-3xl font-bold mt-1 text-slate-900">
                  {
                    projects.filter(
                      (p) => getProjectStatus(p) === "in-progress"
                    ).length
                  }
                </p>
              </div>
              <div className="bg-amber-50 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Completed</p>
                <p className="text-3xl font-bold mt-1 text-slate-900">
                  {
                    projects.filter((p) => getProjectStatus(p) === "completed")
                      .length
                  }
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Upcoming</p>
                <p className="text-3xl font-bold mt-1 text-slate-900">
                  {
                    projects.filter((p) => getProjectStatus(p) === "upcoming")
                      .length
                  }
                </p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project List View */}
      {viewType === "list" && (
        <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
          <CardHeader className="bg-slate-50 py-4 px-5 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-slate-800 flex items-center text-lg font-semibold">
                <FolderOpen className="h-5 w-5 text-indigo-600 mr-2" />
                Assigned Projects
              </CardTitle>
              <Badge 
                className="bg-indigo-50 text-indigo-700 border border-indigo-200"
              >
                {projects.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-sm font-medium text-left p-3 text-slate-600">
                      Project
                    </th>
                    <th className="text-sm font-medium text-left p-3 text-slate-600">
                      Department
                    </th>
                    <th className="text-sm font-medium text-left p-3 text-slate-600">
                      Timeline
                    </th>
                    <th className="text-sm font-medium text-left p-3 text-slate-600">
                      Status
                    </th>
                    <th className="text-sm font-medium text-right p-3 text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => {
                    const status = getProjectStatus(project);
                    const statusConfig = getStatusConfig(status);
                    return (
                      <tr key={project.name} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium text-slate-900">
                                {project.name}
                              </div>
                              <div className="text-sm text-slate-500 truncate max-w-xs">
                                {project.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <Building size={16} className="text-slate-500" />
                            <span className="text-slate-700">{project.department || "General"}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm text-slate-700">
                            {formatDate(project.schedule?.start.toString())} -{" "}
                            {formatDate(project.schedule?.end.toString())}
                          </div>
                          <div className="text-xs text-slate-500">
                            {getDaysRemaining(project.schedule?.end.toString())}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant="outline" 
                            className={`flex items-center ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                          >
                            {statusConfig.icon} {status}
                          </Badge>
                          {project.schedule?.isRescheduled && (
                            <Badge
                              variant="outline"
                              className="mt-1 bg-rose-50 text-rose-700 border-rose-200"
                            >
                              Rescheduled
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost" 
                            size="sm" 
                            className="h-8 gap-1 text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                            onClick={() => goToProjectDetails(project._id)}
                          >
                            <span className="text-xs">View</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
            <div>Showing {projects.length} projects</div>
          </CardFooter>
        </Card>
      )}

      {/* Grid View */}
      {viewType === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const status = getProjectStatus(project);
            const statusConfig = getStatusConfig(status);
            return (
              <Card
                key={project.name}
                className="border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-slate-900">{project.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                    >
                      {statusConfig.icon} {status}
                    </Badge>
                  </div>
                  {project.department && (
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                      <Building size={16} className="mr-1.5" />
                      {project.department}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <CalendarIcon size={16} className="mr-2 text-slate-400" />
                    <div>
                      <span className="font-medium">Timeline: </span>
                      {formatDate(project.schedule?.start.toString())} -{" "}
                      {formatDate(project.schedule?.end.toString())}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-500">
                      {project.documents.length > 0 && (
                        <span className="mr-4">
                          <FileText size={16} className="inline mr-1 text-slate-400" />
                          {project.documents.length} document
                          {project.documents.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {project.resources.length > 0 && (
                        <span>
                          <FolderOpen size={16} className="inline mr-1 text-slate-400" />
                          {project.resources.length} resource
                          {project.resources.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {project.schedule?.isRescheduled && (
                      <Badge
                        variant="outline"
                        className="bg-rose-50 text-rose-700 border-rose-200"
                      >
                        Rescheduled
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t border-slate-100">
                  <Button
                    variant="outline" 
                    size="sm" 
                    className="text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9"
                    onClick={() => goToProjectDetails(project._id)}
                  >
                    View Details
                    <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Show message if no projects */}
      {projects.length === 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="mx-auto bg-slate-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-slate-500" />
            </div>
            <CardTitle className="text-xl mb-2 text-slate-900">No projects found</CardTitle>
            <CardDescription className="text-slate-500 max-w-md mx-auto">
              You don't have any assigned projects yet. Get started by creating your first project or contact your department head.
            </CardDescription>
            <Button
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
              onClick={goToCreateProject}
            >
              <Plus size={16} className="mr-2" />
              Create New Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Project;
