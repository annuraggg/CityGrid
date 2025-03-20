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
  Clock 
} from "lucide-react";

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


  const statusColors = {
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    delayed: "bg-amber-100 text-amber-800",
    planning: "bg-purple-100 text-purple-800"
  };

  const getDocTypeIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'pdf': return "bg-red-100 text-red-800";
      case 'dwg': return "bg-blue-100 text-blue-800";
      case 'xlsx': return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
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
    <div className="w-full mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs font-normal">
                  {project.id}
                </Badge>
                <Badge className={`${statusColors[project.status]} border-0`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold mb-1">{project.name}</h1>
              <div className="flex items-center text-gray-500 text-sm gap-4">
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
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  {daysRemaining} days remaining
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{project.progress}% Complete</span>
                <Progress value={project.progress} className="w-24 h-2" />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-white w-full justify-start rounded-lg p-1 border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="bg-white pl-6">
                  <CardTitle className="text-xl font-semibold">Project Description</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  <p className="text-gray-700">{project.description}</p>
                  
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Start Date</span>
                          <span className="text-sm font-medium">{project.schedule[2].date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Original End Date</span>
                          <span className="text-sm font-medium">{project.schedule[5].date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Extended End Date</span>
                          <span className="text-sm font-medium text-amber-600">{project.schedule[6].date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Key Contacts</h3>
                      <div className="space-y-3">
                        {project.contacts.slice(0, 2).map((contact, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">{contact.name}</p>
                              <p className="text-xs text-gray-500">{contact.role}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
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
              
              <Card>
                <CardHeader className="bg-white pl-6">
                  <CardTitle className="text-xl font-semibold">Location</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{project.location}</p>
                    <p className="text-xs text-gray-500">
                      Latitude: {project.lat}
                    </p>
                    <p className="text-xs text-gray-500">
                      Longitude: {project.long}
                    </p>
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    View on Map
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0">
            <Card>
              <CardHeader className="bg-white p-6 pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">Project Documents</CardTitle>
                  <Button size="sm" className="h-9">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload New
                  </Button>
                </div>
                <CardDescription>
                  Access all project documentation and files
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {project.documents.map((doc, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className={`${getDocTypeIcon(doc.type)}`}>
                          {doc.type}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500">Last updated: {doc.date}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2 ml-4">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-0">
            <Card>
              <CardHeader className="bg-white p-6 pb-3">
                <CardTitle className="text-xl font-semibold">Project Timeline</CardTitle>
                <CardDescription>
                  Track the progress of project milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {project.schedule.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 relative">
                        <div className={`mt-0.5 h-8 w-8 rounded-full border flex items-center justify-center ${
                          item.checked 
                            ? "bg-blue-50 border-blue-200 text-blue-600" 
                            : "bg-white border-gray-200 text-gray-400"
                        }`}>
                          <Checkbox 
                            checked={item.checked} 
                            id={`schedule-${index}`}
                            className={item.checked ? "text-blue-600" : "text-gray-400"}
                          />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg p-4 w-full shadow-sm">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">{item.label}</p>
                            <Badge 
                              variant={item.checked ? "secondary" : "outline"}
                              className={item.checked ? "bg-green-100 text-green-800 border-0" : ""}
                            >
                              {item.checked ? "Completed" : "Pending"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <CalendarClock className="h-3.5 w-3.5 text-gray-400" />
                            <p className="text-sm text-gray-600">{item.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="mt-0">
            <Card>
              <CardHeader className="bg-white p-6 pb-3">
                <CardTitle className="text-xl font-semibold">Project Team</CardTitle>
                <CardDescription>
                  Team members and stakeholders involved in the project
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.contacts.map((contact, index) => (
                    <Card key={index} className="border border-gray-100">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 mt-4">
                          <span className="text-xl font-medium text-gray-500">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{contact.role}</p>
                        <p className="text-xs text-blue-600">{contact.email}</p>
                        <Button variant="outline" size="sm" className="mt-4 w-full">
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
    </div>
  );
};

export default ProjectDetails;