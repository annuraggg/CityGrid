import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Calendar, Clock, Download, FileImage } from "lucide-react";

interface ComplaintProps {
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

const ComplaintDetail: React.FC<ComplaintProps> = ({ 
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
      case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-300';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <h1 className="text-xl text-gray-500 mr-2">Complaints &gt;</h1>
        <h1 className="text-xl font-medium">{id}</h1>
        <div className="ml-auto">
          <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700">
            Actions
          </Button>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">{id}</span>
            <Badge className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold pb-0">{title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1 p-2 bg-blue-50 text-blue-700 border-blue-200">
              <MapPin size={16} /> {location.address}
            </Badge>
            <Badge variant="outline" className="p-2 bg-gray-800 text-white">
              Lat: {location.coordinates.lat}, Long: {location.coordinates.long}
            </Badge>
          </div>

          <div className="flex items-center bg-gray-500 text-white p-3 rounded">
            <Building size={20} className="mr-2" /> 
            <span className="mr-auto">Municipal Corp</span>
            <span className="font-medium">{department.division}</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-500">Description</h3>
            <p>{description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-500">Images</h3>
            <div className="space-y-2">
              {images.map((image, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <div className="flex items-center">
                    <FileImage size={20} className="mr-2 text-red-500" />
                    <span>{image.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Download size={16} className="mr-1" /> Download
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-500">Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <Calendar size={20} className="mr-2 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Reported On</p>
                  <p>{timeline.reportedOn}</p>
                </div>
                <div className="ml-auto">
                  <p>{timeline.reportedOn}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock size={20} className="mr-2 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p>{timeline.lastUpdated}</p>
                </div>
                <div className="ml-auto">
                  <p>{timeline.lastUpdated}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-500">Your Comments</h3>
            <Textarea placeholder="Type your comment here..." className="min-h-24" />
            <div className="flex justify-end">
              <Button className="bg-gray-500 hover:bg-gray-600">
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
export default function ComplaintPage() {
  const complaintData: ComplaintProps = {
    id: "CMP-101",
    status: "Pending",
    title: "Road Damage",
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
    description: "Large potholes forming after heavy rains.",
    images: [
      { name: "img2025-03-10-22-2.jpeg", url: "/images/pothole1.jpg" },
      { name: "img2025-03-10-22-5.jpeg", url: "/images/pothole2.jpg" }
    ],
    timeline: {
      reportedOn: "10-Mar-2025",
      lastUpdated: "15-Mar-2025"
    }
  };

  return <ComplaintDetail {...complaintData} />;
}