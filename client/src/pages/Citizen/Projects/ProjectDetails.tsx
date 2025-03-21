import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building, 
  Calendar, 
  Clock,
  AlertCircle,
  PlusCircle, 
  ChevronRight,
  Globe,
  FileText,
  Info,
  CheckCircle2,
  CalendarClock,
  LayoutDashboard
} from "lucide-react";

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

  const getStatusIcon = (status:any) => {
    switch(status) {
      case 'Completed':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'In Progress':
        return <Clock className="text-amber-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="p-6 bg-white w-full">
      <div className="container px-0 mx-auto">
        {/* Breadcrumb and Action Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center text-xl text-gray-500 gap-2">
            <LayoutDashboard size={18} />
            <span>Projects</span>
            <ChevronRight size={18} />
            <span className="font-medium text-gray-800">{project.id}</span>
          </div>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2 flex items-center gap-2">
            <PlusCircle size={18} />
            Raise a Complaint
          </Button>
        </div>

        {/* Project Header */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-medium text-gray-700">{project.id}</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
              {getStatusIcon(project.status)}
              <span className="text-amber-600 font-medium">{project.status}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{project.name}</h1>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center bg-blue-50 text-blue-700 rounded-md px-4 py-2 border border-blue-200">
              <MapPin size={18} className="mr-2" />
              {project.location.address}
            </div>
            
            <div className="flex items-center bg-gray-900 text-white rounded-md px-4 py-2">
              <Globe size={18} className="mr-2" />
              <span>Lat: {project.location.coordinates.lat},</span>
              <span className="ml-1">Long: {project.location.coordinates.long}</span>
            </div>
          </div>
        </div>

        {/* Department Info */}
        <div className="flex items-center bg-gray-100 border border-gray-200 p-4 rounded-lg mb-6">
          <Building size={20} className="mr-3 text-gray-700" />
          <span className="font-medium text-gray-700 mr-auto">Department</span>
          <span className="text-gray-900 font-medium">{project.department}</span>
        </div>

        {/* Description */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={20} className="text-gray-700" />
            <h3 className="text-xl font-medium">Description</h3>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed pl-8">{project.description}</p>
        </div>

        {/* Schedule */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-gray-700" />
            <h3 className="text-xl font-medium">Schedule</h3>
          </div>
          
          <div className="space-y-4 pl-8">
            <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200">
              <Calendar size={18} className="mr-4 text-green-600" />
              <span className="mr-auto font-medium">Start Date</span>
              <span className="text-gray-700">{project.schedule.startDate}</span>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200">
              <Calendar size={18} className="mr-4 text-red-600" />
              <span className="mr-auto font-medium">Est. End Date</span>
              <span className="text-gray-700">{project.schedule.endDate}</span>
            </div>
            
            <div className="flex items-center p-3 bg-amber-50 rounded-md border border-amber-200">
              <CalendarClock size={18} className="mr-4 text-amber-600" />
              <span className="mr-auto font-medium">Rescheduled</span>
              <span className="text-amber-700">{project.schedule.rescheduled}</span>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between text-sm text-gray-500 mt-8 border-t pt-4">
          <div className="flex items-center gap-2">
            <Info size={16} />
            <span>Last updated: {project.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Updated by: {project.updatedBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;