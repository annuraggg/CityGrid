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
} from "lucide-react";
import { Link } from "react-router-dom";

type ProjectDetails = {
  id: string;
  name: string;
  department: string;
  status: "active" | "completed" | "delayed" | "planning";
  progress: number;
  location: string;
  lat: string;
  long: string;
  description: string;
  documents: { name: string; link: string; type: string; date: string }[];
  schedule: { label: string; date: string; checked: boolean }[];
  contacts: { name: string; role: string; email: string }[];
};

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // Expanded mock data for the project
  const project: ProjectDetails = {
    id: "PRJ-101",
    name: "Metro Waterline Upgrade",
    department: "Water Supply",
    status: "active",
    progress: 35,
    location: "Sector 12, Mumbai",
    lat: "19.1234",
    long: "72.8765",
    description: "Expansion of the metro water pipeline for increased urban demand. This project aims to upgrade the existing infrastructure to support the growing population in the eastern suburbs of Mumbai.",
    documents: [
      { name: "Project Proposal", link: "#", type: "PDF", date: "10-Feb-2025" },
      { name: "Engineering Plan", link: "#", type: "DWG", date: "02-Mar-2025" },
      { name: "Budget Report", link: "#", type: "XLSX", date: "05-Mar-2025" },
      { name: "Environmental Impact Study", link: "#", type: "PDF", date: "01-Mar-2025" },
    ],
    schedule: [
      { label: "Planning Phase", date: "01-Feb-2025", checked: true },
      { label: "Approval", date: "05-Mar-2025", checked: true },
      { label: "Start Date", date: "12-Mar-2025", checked: true },
      { label: "Phase 1 Completion", date: "15-May-2025", checked: false },
      { label: "Phase 2 Completion", date: "15-Jun-2025", checked: false },
      { label: "Est. End Date", date: "30-Jun-2025", checked: false },
      { label: "Extended End Date", date: "15-Jul-2025", checked: false },
    ],
    contacts: [
      { name: "Priya Sharma", role: "Project Manager", email: "priya.sharma@example.com" },
      { name: "Rajesh Kumar", role: "Lead Engineer", email: "rajesh.kumar@example.com" },
      { name: "Anita Desai", role: "Budget Analyst", email: "anita.desai@example.com" },
    ]
  };

  // Updated status styles to match dashboard design system
  const statusStyles = {
    active: "bg-indigo-50 text-indigo-700 border-indigo-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    delayed: "bg-amber-50 text-amber-700 border-amber-200",
    planning: "bg-blue-50 text-blue-700 border-blue-200"
  };

  // Updated document type badges to match design system
  const getDocTypeIcon = (type: string) => {
    switch(type) {
      case "PDF":
        return "bg-red-50 text-red-700 border-red-200";
      case "DWG":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "XLSX":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const calculateDaysRemaining = () => {
    const endDate = new Date("2025-07-15");
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link to="/hod/projects" className="text-sm text-slate-600 hover:text-indigo-600 flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>
      </div>

      {/* Project Header */}
      <Card className="border-slate-200 shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs font-medium text-slate-600 bg-slate-50 border-slate-200">
                  {project.id}
                </Badge>
                <Badge variant="outline" className={`${statusStyles[project.status]}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">{project.name}</h1>
              <div className="flex items-center text-slate-500 text-sm gap-4">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{project.department}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                  {daysRemaining} days remaining
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">{project.progress}% Complete</span>
                <Progress value={project.progress} className="w-24 h-2 [&>div]:bg-indigo-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <Card className="lg:col-span-2 border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900">Project Description</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-slate-700 leading-relaxed">{project.description}</p>

                <Separator className="my-6 bg-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 mb-4">Project Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Start Date</span>
                        <span className="text-sm font-medium text-slate-900">{project.schedule[2].date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Planned Completion</span>
                        <span className="text-sm font-medium text-slate-900">{project.schedule[5].date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Revised Completion</span>
                        <span className="text-sm font-medium text-slate-900">{project.schedule[6].date}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-600 mb-4">Key Contacts</h3>
                    <div className="space-y-4">
                      {project.contacts.slice(0, 2).map((contact, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                            <p className="text-xs text-slate-500">{contact.role}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-1 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-600"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="text-xs">Contact</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-900">Location Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="aspect-video bg-slate-50 rounded-md flex items-center justify-center mb-4 border border-slate-200">
                  <MapPin className="h-8 w-8 text-slate-400" />
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-slate-900">{project.location}</p>
                  <p className="text-xs text-slate-500">
                    Coordinates: {project.lat}, {project.long}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2 text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9"
                >
                  Open in Maps
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-0 w-full">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Project Documentation</CardTitle>
                <CardDescription className="text-slate-500">
                  Access and manage all project files and documentation
                </CardDescription>
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium">
                <FileText className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {project.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-md border border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getDocTypeIcon(doc.type)}>
                        {doc.type}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{doc.name}</p>
                        <p className="text-xs text-slate-500">Updated: {doc.date}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 ml-4 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="schedule" className="mt-0 w-full">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900">Project Timeline</CardTitle>
              <CardDescription className="text-slate-500">
                Track progress against key milestones and deliverables
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                <div className="space-y-6">
                  {project.schedule.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 relative">
                      <div className={`mt-0.5 h-8 w-8 rounded-full border flex items-center justify-center ${item.checked
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                          : "bg-white border-slate-200 text-slate-400"
                        }`}>
                        <Checkbox
                          checked={item.checked}
                          id={`schedule-${index}`}
                          className={item.checked ? "text-indigo-600" : "text-slate-400"}
                        />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-md p-4 w-full shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium text-slate-900">{item.label}</p>
                          <Badge
                            variant={item.checked ? "secondary" : "outline"}
                            className={item.checked 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-amber-50 text-amber-700 border-amber-200"}
                          >
                            {item.checked ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                          <p className="text-sm text-slate-600">{item.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="mt-0 w-full">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900">Project Team</CardTitle>
              <CardDescription className="text-slate-500">
                Personnel assigned to this project and their roles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.contacts.map((contact, index) => (
                  <Card key={index} className="border-slate-200 shadow-sm h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                        <span className="text-xl font-medium text-indigo-600">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <h3 className="font-medium text-slate-900">{contact.name}</h3>
                      <p className="text-sm text-slate-500 mb-2">{contact.role}</p>
                      <p className="text-xs text-slate-600">{contact.email}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-auto w-full text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9"
                      >
                        Contact
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
