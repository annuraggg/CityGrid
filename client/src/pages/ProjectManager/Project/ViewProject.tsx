import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  Users,
  Briefcase,
  PlusCircle,
  ArrowLeftRight,
  Terminal,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { toast } from "sonner";
import ExtendedProject from "@/types/ExtendedProject";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Conflict from "@/types/Conflict";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ViewProject = () => {
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [project, setProject] = useState<ExtendedProject>();
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [newStartDate, setNewStartDate] = useState<string>("");
  const [newEndDate, setNewEndDate] = useState<string>("");
  const [aiSUggestion, setAiSuggestion] = useState<string>("");

  const fetchProject = () => {
    const pid = window.location.pathname.split("/").pop();
    setLoading(true);

    axios
      .get("projects/" + pid)
      .then((res) => {
        setProject(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load project details");
        setLoading(false);
      });

    axios.get("conflicts/department").then((res) => {
      setConflicts(res.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    if (project?.schedule.start) {
      setNewStartDate(
        new Date(project.schedule.start).toISOString().split("T")[0]
      );
    }
    if (project?.schedule.end) {
      setNewEndDate(new Date(project.schedule.end).toISOString().split("T")[0]);
    }
  }, [project]);

  useEffect(() => {
    if (conflicts.some((conflict) => conflict.project === project?._id)) {
      axios
        .post("projects/llm", {
          conflictId: conflicts[0]._id,
        })
        .then((res) => {
          setAiSuggestion(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching LLM response:", err);
          toast.error("Failed to fetch LLM response");
        });
    }
  }, [conflicts, project]);

  const handleReschedule = async () => {
    if (!newStartDate || !newEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    const pid = window.location.pathname.split("/").pop();

    axios
      .put(`projects/${pid}/reschedule`, {
        start: newStartDate,
        end: newEndDate,
      })
      .then((res) => {
        toast.success("Project rescheduled successfully");
        fetchProject(); // Refresh project data
        setIsRescheduleModalOpen(false);
      })
      .catch((err) => {
        console.error("Error rescheduling project:", err);
        toast.error(
          err.response?.data?.message || "Failed to reschedule project"
        );
      });
  };

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

      // Refresh project data
      fetchProject();
    } catch (err) {
      console.error("Error uploading document:", err);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
      // Reset the file input
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
  const startDate = project.schedule.start
    ? format(new Date(project.schedule.start), "MMMM dd, yyyy")
    : "Not set";
  const endDate = project.schedule.end
    ? format(new Date(project.schedule.end), "MMMM dd, yyyy")
    : "Not set";
  const isConflict = conflicts.some(
    (conflict) => conflict.project === project._id
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.ppt,.pptx"
      />

      {/* Reschedule Modal */}
      <Dialog
        open={isRescheduleModalOpen}
        onOpenChange={setIsRescheduleModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Project</DialogTitle>
            <DialogDescription>
              Update the project timeline by selecting new start and end dates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-date" className="text-right">
                Start Date
              </Label>
              <input
                id="start-date"
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="col-span-3 p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-date" className="text-right">
                End Date
              </Label>
              <input
                id="end-date"
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="col-span-3 p-2 border rounded"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRescheduleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-sm font-medium"
              onClick={handleReschedule}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isConflict && (
        <Alert variant={"destructive"} className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Conflict Detected</AlertTitle>
          <AlertDescription>
            You can reschedule the project to avoid conflicts with other
            projects. Schedule of conflicting project:
          </AlertDescription>
        </Alert>
      )}

      {aiSUggestion && (
        <div className="border-green-500 border p-5 my-2 rounded-2xl bg-green-100">
          <p>Suggestion: {aiSUggestion}</p>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>{project.department?.name || "No Department"}</span>
          </div>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
          onClick={() => setIsRescheduleModalOpen(true)}
        >
          <ArrowLeftRight size={16} className="mr-2" />
          Reschedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">
                Documents ({project.documents.length})
              </TabsTrigger>
              <TabsTrigger value="resources">
                Resources ({project.resources.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Overview of {project.name}</CardDescription>
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
                    <h3 className="text-lg font-medium mb-2 flex justify-between items-center">
                      <span>Schedule</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Start Date</p>
                          <p className="text-muted-foreground">{startDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">End Date</p>
                          <p className="text-muted-foreground">{endDate}</p>
                        </div>
                      </div>
                    </div>
                    {project.schedule.isRescheduled && (
                      <Badge className="mt-2" variant="outline">
                        Rescheduled
                      </Badge>
                    )}
                  </div>

                  {project.location && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-medium mb-2">Location</h3>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/10 rounded-md">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Coordinates: {project.location.latitude},{" "}
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
              <Card>
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
                          className="flex items-center p-3 border rounded-lg hover:bg-accent cursor-pointer"
                          onClick={() => downloadFile(doc._id)}
                        >
                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>{doc.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No documents available</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={uploadDoc}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload Document"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Users size={18} className="text-slate-600" />
                    Project Resources
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    Resources allocated to this project
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {project.resources.length > 0 ? (
                    <div className="space-y-2">
                      {project.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <Users className="h-5 w-5 mr-2 text-slate-500" />
                          <span className="text-slate-700">{resource}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500">No resources assigned</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Add resources to track project allocation
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-3 border-t border-slate-100">
                  <Button
                    variant="outline"
                    className="w-full text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 text-sm font-medium"
                  >
                    <PlusCircle size={16} className="mr-2 text-slate-500" />
                    Add Resource
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Project Manager</p>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {project.manager._id.charAt(0).toUpperCase()}
                  </div>
                  <span>{project.manager._id}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Project ID</p>
                <div className="p-3 border rounded-lg truncate font-mono text-sm text-muted-foreground">
                  {project._id}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Project Timeline</p>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {calculateDuration(
                        project.schedule.start,
                        project.schedule.end
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${calculateProgress(
                          project.schedule.start,
                          project.schedule.end
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
    <div className="bg-destructive/10 text-destructive p-4 rounded-lg inline-block mb-4">
      <FileText className="h-12 w-12" />
    </div>
    <h2 className="text-2xl font-bold mb-2">{message}</h2>
    <p className="text-muted-foreground mb-6">
      Unable to display project information
    </p>
    <Button variant="outline">Go Back</Button>
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
