import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Building, 
  Calendar, 
  Clock, 
  Download, 
  FileImage, 
  ChevronLeft,
  MoreHorizontal,
  Send
} from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

interface ConflictProps {
  id: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  title: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      long: number;
    };
  };
  department: {
    name: string;
    division: string;
  };
  description: string;
  images: Array<{
    name: string;
    url: string;
  }>;
  timeline: {
    reportedOn: string;
    lastUpdated: string;
  };
}

const ConflictDetail: React.FC<ConflictProps> = ({ 
  id, 
  status, 
  title, 
  location, 
  department, 
  description, 
  images, 
  timeline 
}) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link to="/hod/projects" className="text-sm text-slate-600 hover:text-indigo-600 flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs font-medium text-slate-600 bg-slate-50 border-slate-200">
              {id}
            </Badge>
            <Badge variant="outline" className={`${getStatusColor(status)}`}>
              {status}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        </div>

        <Button 
          variant="outline" 
          className="h-10 gap-2 text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600"
        >
          <MoreHorizontal className="h-4 w-4" />
          Actions
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Location Section */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border-indigo-200">
              <MapPin size={14} /> {location.address}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 border-slate-200">
              <span className="font-medium">Coordinates:</span> {location.coordinates.lat}, {location.coordinates.long}
            </Badge>
          </div>

          {/* Department Section */}
          <div className="flex items-center p-4 rounded-md bg-indigo-50 border border-indigo-100">
            <Building size={18} className="text-indigo-600 mr-3" /> 
            <span className="text-slate-700 mr-auto">{department.name}</span>
            <span className="font-medium text-indigo-700">{department.division}</span>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-600">Description</h3>
            <p className="text-slate-700 leading-relaxed">{description}</p>
          </div>

          <Separator className="bg-slate-100" />

          {/* Images Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-600">Attached Images</h3>
            <div className="space-y-3">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-red-50 flex items-center justify-center mr-3">
                      <FileImage size={16} className="text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{image.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-1.5 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-600"
                  >
                    <Download size={14} />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Timeline Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-600">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md border border-slate-200 bg-slate-50">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mr-3">
                    <Calendar size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Reported On</p>
                    <p className="text-sm font-medium text-slate-800">{timeline.reportedOn}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-md border border-slate-200 bg-slate-50">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mr-3">
                    <Clock size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                    <p className="text-sm font-medium text-slate-800">{timeline.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Comments Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-600">Your Comments</h3>
            <Textarea 
              placeholder="Add your resolution or comment here..." 
              className="min-h-32 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-700 resize-none" 
            />
            <div className="flex justify-end">
              <Button className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium">
                <Send className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Example usage
export default function ConflictPage() {
  const conflictData: ConflictProps = {
    id: "CMP-101",
    status: "Pending",
    title: "Road Damage at Main Intersection",
    location: {
      address: "Sector 12, Mumbai",
      coordinates: {
        lat: 19.1234,
        long: 72.8765
      }
    },
    department: {
      name: "Municipal Corp",
      division: "Brihanmumbai MC"
    },
    description: "Large potholes forming after heavy rains causing traffic disruption and potential vehicle damage. The issue has been reported by multiple citizens and requires immediate attention to prevent accidents and further road deterioration.",
    images: [
      { name: "img2025-03-10-22-2.jpeg", url: "/images/pothole1.jpg" },
      { name: "img2025-03-10-22-5.jpeg", url: "/images/pothole2.jpg" }
    ],
    timeline: {
      reportedOn: "10-Mar-2025",
      lastUpdated: "15-Mar-2025"
    }
  };

  return <ConflictDetail {...conflictData} />;
}