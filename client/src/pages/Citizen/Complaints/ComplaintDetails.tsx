import React from 'react';
import { 
  ChevronLeft,
  MapPin,
  Building,
  FileText,
  ImageIcon,
  Calendar,
  Clock,
  Download,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  MapIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const ComplaintDetails = () => {
  // Sample complaint data
  const complaint = {
    id: "CMP-101",
    status: "Pending",
    title: "Road Damage",
    location: {
      address: "Sector 12, Mumbai",
      coordinates: {
        lat: "19.1234",
        long: "72.8765"
      }
    },
    municipalCorp: "Brihanmumbai Municipal Corporation",
    description: "Large potholes forming after heavy rains.",
    images: [
      { name: "img2025-03-10-22-2.jpeg" },
      { name: "img2025-03-10-22-5.jpeg" }
    ],
    timeline: {
      reportedOn: "10-Mar-2025",
      lastUpdated: "15-Mar-2025"
    },
    hodComments: {
      text: "Work order has been issued. Inspection, will be conducted before repair starts.",
      author: "Mr. Raj Sharma",
      department: "Public Works HOD"
    }
  };

  // Status badge configuration updated to match dashboard
  const getStatusConfig = (status: string) => {
    switch(status) {
      case "Pending":
        return { 
          bgColor: "bg-amber-50", 
          textColor: "text-amber-700", 
          borderColor: "border-amber-200",
          icon: <AlertTriangle size={14} className="mr-1.5" /> 
        };
      case "In Progress":
        return { 
          bgColor: "bg-blue-50", 
          textColor: "text-blue-700", 
          borderColor: "border-blue-200",
          icon: <Clock size={14} className="mr-1.5" /> 
        };
      case "Completed":
        return { 
          bgColor: "bg-emerald-50", 
          textColor: "text-emerald-700", 
          borderColor: "border-emerald-200",
          icon: <CheckCircle2 size={14} className="mr-1.5" /> 
        };
      case "Rejected":
        return { 
          bgColor: "bg-rose-50", 
          textColor: "text-rose-700", 
          borderColor: "border-rose-200",
          icon: <AlertTriangle size={14} className="mr-1.5" /> 
        };
      default:
        return { 
          bgColor: "bg-slate-50", 
          textColor: "text-slate-700", 
          borderColor: "border-slate-200",
          icon: <Clock size={14} className="mr-1.5" /> 
        };
    }
  };

  const statusConfig = getStatusConfig(complaint.status);

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link to="/citizen/complaints" className="text-sm text-slate-600 hover:text-indigo-600 flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Complaints
        </Link>
      </div>

      {/* Complaint Header */}
      <Card className="border-slate-200 shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs font-medium text-slate-600 bg-slate-50 border-slate-200">
                  {complaint.id}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`flex items-center ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                >
                  {statusConfig.icon} {complaint.status}
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">{complaint.title}</h1>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md px-3 py-1.5">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">{complaint.location.address}</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-md px-3 py-1.5">
                  <MapIcon size={16} />
                  <span className="text-sm font-medium">
                    Lat: {complaint.location.coordinates.lat}, Long: {complaint.location.coordinates.long}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Municipal Corporation */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Building className="h-5 w-5 text-slate-600" />
                Municipal Corporation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-slate-700">{complaint.municipalCorp}</p>
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
              <p className="text-slate-700 leading-relaxed">{complaint.description}</p>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-slate-600" />
                Uploaded Images
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              {complaint.images.map((image, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-md border border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-rose-50 flex items-center justify-center">
                      <ImageIcon size={20} className="text-rose-600" />
                    </div>
                    <span className="font-medium text-sm text-slate-900">{image.name}</span>
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
            </CardContent>
          </Card>

          {/* HOD's Comments */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-slate-600" />
                HOD's Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="p-4 border border-slate-200 bg-slate-50 rounded-md mb-4">
                <p className="text-slate-700 italic mb-4">"{complaint.hodComments.text}"</p>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center mr-3">
                    <span className="font-medium text-indigo-600">{complaint.hodComments.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{complaint.hodComments.author}</p>
                    <p className="text-xs text-slate-500">{complaint.hodComments.department}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Timeline Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-600" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 relative">
                    <div className="mt-0.5 h-8 w-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-md p-4 w-full shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-slate-900">Reported On</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-600">{complaint.timeline.reportedOn}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 relative">
                    <div className="mt-0.5 h-8 w-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-md p-4 w-full shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-slate-900">Last Updated</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-600">{complaint.timeline.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900">Status Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-2">Current Status</h3>
                  <Badge 
                    className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} inline-flex items-center px-2.5 py-1`}
                    variant="outline"
                  >
                    {statusConfig.icon}
                    {complaint.status}
                  </Badge>
                </div>
                
                <Separator className="my-3 bg-slate-100" />
                
                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-2">Expected Resolution</h3>
                  <p className="text-sm text-slate-700">
                    {complaint.status === "Pending" ? "2-3 business days" : 
                     complaint.status === "In Progress" ? "1-2 business days" :
                     complaint.status === "Completed" ? "Resolved" : "Pending review"}
                  </p>
                </div>
                
                <Separator className="my-3 bg-slate-100" />
                
                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-2">Need Help?</h3>
                  <Button 
                    variant="outline" 
                    className="w-full text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9 mt-1"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;