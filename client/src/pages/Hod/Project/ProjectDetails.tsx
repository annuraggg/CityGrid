import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  MapPin,
  Building,
  CalendarClock,
  FileText,
  ExternalLink,
  Clock,
  ChevronLeft
  Share2,
  Edit,
  Download,
  Upload,
  ArrowLeft,
  User,
  Timer,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ExtendedProject from "@/types/ExtendedProject";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ViewProject = () => {
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [project, setProject] = useState<ExtendedProject>(
    {} as ExtendedProject
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProject = () => {
    const pid = window.location.pathname.split("/").pop();
    setLoading(true);

    axios
      .get(`projects/${pid}`)
      .then((res) => {
        setProject(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load project details");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const uploadDoc = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const pid = window.location.pathname.split("/").pop();

    const formData = new FormData();
    formData.append("document", file);
    formData.append("project", pid!);

    setUploading(true);

    try {
      await axios.post(`documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Document uploaded successfully");
      fetchProject();
    } catch (err) {
      console.error("Error uploading document:", err);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const downloadFile = (id: string) => {
    axios
      .get(`documents/${id}/${project?._id}`)
      .then((res) => {
        window.open(res.data.data.url, "_blank");
      })
      .catch((err) => {
        console.error("Error downloading file:", err);
        toast.error("Failed to download file");
      });
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!project) {
    return <ErrorState message="Project not found" />;
  }

  // Format dates
  const startDate = project.schedule?.start
    ? format(new Date(project.schedule?.start), "MMMM dd, yyyy")
    : "Not set";
  const endDate = project.schedule?.end
    ? format(new Date(project.schedule?.end), "MMMM dd, yyyy")
    : "Not set";

  const getProgressColor = (progress: number) => {
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-amber-500";
    if (progress < 75) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const progressPercentage = calculateProgress(
    project.schedule?.start,
    project.schedule?.end
  );

  return (
    <div className="container mx-auto py-8 px-4 ">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.ppt,.pptx"
      />

      <div className="flex items-center text-muted-foreground mb-6">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            {project.schedule?.isRescheduled && (
              <Badge variant="outline" className="ml-2">
                Rescheduled
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>{project.department?.name || "No Department"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Project</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Project
          </Button>
        </div>
      </div>

      {/* Project Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white border border-slate-200 mb-6 w-auto h-11 p-1">
          <TabsTrigger 
            value="overview" 
            className="h-9 px-4 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className="h-9 px-4 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="schedule" 
            className="h-9 px-4 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
          >
            Timeline
          </TabsTrigger>
          <TabsTrigger 
            value="team" 
            className="h-9 px-4 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
          >
            Team Members
          </TabsTrigger>
        </TabsList>

            <TabsContent value="overview">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Complete overview of {project.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {project.description || "No description provided."}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Start Date</p>
                          <p className="text-muted-foreground">{startDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">End Date</p>
                          <p className="text-muted-foreground">{endDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {project.location && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-medium mb-2">Location</h3>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-md">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Coordinates</p>
                            <p className="text-muted-foreground">
                              {project.location.latitude},{" "}
                              {project.location.longitude}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Project Documents</CardTitle>
                  <CardDescription>
                    All documents associated with this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.documents.length > 0 ? (
                    <div className="space-y-2">
                      {project.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(doc._id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No documents available</p>
                      <p className="text-sm mt-1">
                        Upload a document to get started
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={uploadDoc}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload Document"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Project Resources</CardTitle>
                  <CardDescription>
                    Resources allocated to this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.resources.length > 0 ? (
                    <div className="space-y-2">
                      {project.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <Users className="h-5 w-5 mr-3 text-muted-foreground" />
                          <span className="font-medium">{resource}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No resources assigned</p>
                      <p className="text-sm mt-1">
                        Add resources to improve project management
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-2">
                    <Users className="h-4 w-4" />
                    Add Resource
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-2">Project Manager</p>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {project.manager._id.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.manager._id}</p>
                    <p className="text-sm text-muted-foreground">Manager</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Project ID</p>
                <div className="p-3 border rounded-lg flex items-center justify-between">
                  <code className="font-mono text-sm text-muted-foreground truncate">
                    {project._id}
                  </code>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Project Timeline</p>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Duration:{" "}
                        {calculateDuration(
                          project.schedule?.start,
                          project.schedule?.end
                        )}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(
                        progressPercentage
                      )}`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Project Status Summary */}
              <div>
                <p className="text-sm font-medium mb-2">Status Summary</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-semibold mb-1">
                      {project.documents.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Documents</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-semibold mb-1">
                      {project.resources.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Resources</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Detailed Reports
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper components
const LoadingSkeleton = () => (
  <div className="container mx-auto py-8 px-4 max-w-6xl">
    <div className="mb-8">
      <Skeleton className="h-10 w-1/3 mb-2" />
      <Skeleton className="h-4 w-1/5" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
      <div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="container mx-auto py-16 px-4 text-center">
    <Alert variant="destructive" className="max-w-md mx-auto">
      <div className="flex flex-col items-center py-4">
        <FileText className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-bold mb-2">{message}</h2>
        <AlertDescription className="mb-6">
          Unable to display project information
        </AlertDescription>
        <Button variant="outline">Return to Dashboard</Button>
      </div>
    </Alert>
  </div>
);

// Helper functions
const calculateDuration = (start: Date, end: Date): string => {
  if (!start || !end) return "No timeline set";

  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays} days`;
};

const calculateProgress = (start: Date, end: Date): number => {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);
  const currentDate = new Date();

  if (currentDate < startDate) return 0;
  if (currentDate > endDate) return 100;

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = currentDate.getTime() - startDate.getTime();

  return Math.round((elapsedDuration / totalDuration) * 100);
};

export default ViewProject;
