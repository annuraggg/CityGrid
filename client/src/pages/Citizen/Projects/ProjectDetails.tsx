import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Building, 
  Calendar, 
  Clock,
  AlertCircle,
  PlusCircle, 
  ChevronRight,
  ChevronLeft,
  Globe,
  FileText,
  Info,
  CheckCircle2,
  CalendarClock,
  LayoutDashboard,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

const ProjectDetails = () => {
  // Sample project data
  const project = {
    id: "PRJ-101",
    name: "Metro Waterline Upgrade",
    status: "In Progress",
    location: {
      address: "Sector 12, Mumbai",
      coordinates: {
        lat: 19.1234,
        long: 72.8765
      }
    },
    department: "BMC: Water Supply",
    description: "Expansion of the metro water pipeline for increased urban demand.",
    schedule: {
      startDate: "12-Mar-2025",
      endDate: "30-Jun-2025",
      rescheduled: "Extended to 15-Jul"
    },
    lastUpdated: "2025-03-21 04:50:37",
    updatedBy: "Ammar2123"
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Completed':
        return { 
          bgColor: "bg-emerald-50", 
          textColor: "text-emerald-700", 
          borderColor: "border-emerald-200",
          icon: <CheckCircle2 size={16} className="mr-1.5 text-emerald-600" /> 
        };
      case 'In Progress':
        return { 
          bgColor: "bg-amber-50", 
          textColor: "text-amber-700", 
          borderColor: "border-amber-200",
          icon: <Clock size={16} className="mr-1.5 text-amber-600" /> 
        };
      default:
        return { 
          bgColor: "bg-slate-50", 
          textColor: "text-slate-700", 
          borderColor: "border-slate-200",
          icon: <AlertCircle size={16} className="mr-1.5 text-slate-600" /> 
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link to="/citizen/projects" className="text-sm text-slate-600 hover:text-indigo-600 flex items-center">
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
                <Badge 
                  variant="outline" 
                  className={`flex items-center ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                >
                  {statusConfig.icon} {project.status}
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">{project.name}</h1>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md px-3 py-1.5">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">{project.location.address}</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-md px-3 py-1.5">
                  <Globe size={16} />
                  <span className="text-sm font-medium">
                    Lat: {project.location.coordinates.lat}, Long: {project.location.coordinates.long}
                  </span>
                </div>
              </div>
            </div>
            <div>
                <Link to="/citizen/create-complaints"><Button 
                className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
                >
                <PlusCircle className="h-4 w-4 mr-2" />
                Raise a Complaint
                </Button></Link>
              
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Info */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Building className="h-5 w-5 text-slate-600" />
                Department
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-slate-700">{project.department}</p>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-slate-700 leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>

          {/* Related Resources */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-slate-600" />
                Related Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-md border border-slate-200 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-slate-500" />
                  <span className="font-medium text-sm text-slate-900">Project Proposal</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 h-8"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="text-xs">View</span>
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-md border border-slate-200 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-slate-500" />
                  <span className="font-medium text-sm text-slate-900">Environmental Impact Report</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 h-8"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="text-xs">View</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Schedule Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                Project Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 relative">
                    <div className="mt-0.5 h-8 w-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-md p-4 w-full shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-slate-900">Start Date</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-600">{project.schedule.startDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 relative">
                    <div className="mt-0.5 h-8 w-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-md p-4 w-full shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-slate-900">Est. End Date</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-600">{project.schedule.endDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 relative">
                    <div className="mt-0.5 h-8 w-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                      <CalendarClock className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-amber-50 rounded-md p-4 w-full shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-slate-900">Rescheduled</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-amber-700">{project.schedule.rescheduled}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Links */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9"
                >
                  <FileText className="h-4 w-4 mr-2 text-slate-500" />
                  View Documentation
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9"
                >
                  <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                  View on Map
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9"
                >
                  <Building className="h-4 w-4 mr-2 text-slate-500" />
                  Contact Department
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
};

export default ProjectDetails;