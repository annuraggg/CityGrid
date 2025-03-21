import React from 'react';
import { 
  ChevronRight,
  MapPin,
  Building,
  FileText,
  ImageIcon,
  Calendar,
  Clock,
  Download,
  Circle,
  AlertCircle,
  MessageSquare,
  MapIcon
} from "lucide-react";

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

  // Status badge color mapping
  const statusConfig = {
    Pending: { bg: "bg-amber-50", text: "text-amber-600", icon: AlertCircle },
    InProgress: { bg: "bg-blue-50", text: "text-blue-600", icon: Clock },
    Completed: { bg: "bg-green-50", text: "text-green-600", icon: Circle },
    Rejected: { bg: "bg-red-50", text: "text-red-600", icon: Circle }
  };

  const statusStyle = statusConfig[complaint.status.replace(/\s+/g, '')] || statusConfig.Pending;

  return (
    <div className="p-6 bg-white w-full">
      <div className="container px-0 mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center text-gray-500 gap-2 mb-8">
          <span className="hover:text-gray-700 cursor-pointer">Complaints</span>
          <ChevronRight size={16} />
          <span className="font-medium text-gray-800">{complaint.id}</span>
        </div>

        {/* Complaint Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xl font-medium">{complaint.id}</h2>
            <div className={`flex items-center ${statusStyle.bg} ${statusStyle.text} px-3 py-1 rounded-full`}>
              <statusStyle.icon size={14} className="mr-1.5" strokeWidth={2.5} />
              <span className="font-medium">{complaint.status}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-6">{complaint.title}</h1>

          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center bg-blue-50 text-blue-700 rounded-md px-4 py-2.5 border border-blue-200">
              <MapPin size={18} className="mr-2 flex-shrink-0" strokeWidth={2} />
              <span>{complaint.location.address}</span>
            </div>
            
            <div className="flex items-center bg-gray-800 text-white rounded-md px-4 py-2.5">
              <MapIcon size={18} className="mr-2 flex-shrink-0" strokeWidth={2} />
              <span className="whitespace-nowrap">Lat: {complaint.location.coordinates.lat},</span>
              <span className="ml-1">Long: {complaint.location.coordinates.long}</span>
            </div>
          </div>
        </div>

        {/* Municipal Corporation */}
        <div className="flex flex-col sm:flex-row bg-gray-50 border border-gray-200 mb-8 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 flex items-center sm:w-48">
            <Building size={18} className="mr-2 text-gray-600" strokeWidth={2} />
            <span className="font-medium">Municipal Corp</span>
          </div>
          <div className="px-4 py-3 flex-grow">
            {complaint.municipalCorp}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-gray-600 font-medium flex items-center mb-3">
            <FileText size={18} className="mr-2 text-gray-500" />
            Description
          </h3>
          <div className="pl-6">
            <p className="text-gray-800">{complaint.description}</p>
          </div>
        </div>

        {/* Images */}
        <div className="mb-8">
          <h3 className="text-gray-600 font-medium flex items-center mb-3">
            <ImageIcon size={18} className="mr-2 text-gray-500" />
            Images
          </h3>
          <div className="space-y-2 pl-6">
            {complaint.images.map((image, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center text-blue-500 mr-3">
                    <ImageIcon size={20} strokeWidth={2} />
                  </div>
                  <span className="text-gray-700">{image.name}</span>
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors px-3 py-1.5 rounded-md hover:bg-blue-50">
                  <Download size={18} className="mr-1.5" strokeWidth={2} />
                  <span className="font-medium">Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h3 className="text-gray-600 font-medium flex items-center mb-3">
            <Clock size={18} className="mr-2 text-gray-500" />
            Timeline
          </h3>
          <div className="space-y-3 pl-6">
            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-700 mr-3">
                  <Calendar size={20} strokeWidth={2} />
                </div>
                <span className="font-medium">Reported On</span>
              </div>
              <span className="text-gray-700">{complaint.timeline.reportedOn}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-700 mr-3">
                  <Clock size={20} strokeWidth={2} />
                </div>
                <span className="font-medium">Last Updated</span>
              </div>
              <span className="text-gray-700">{complaint.timeline.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* HOD's Comments */}
        <div className="mb-6">
          <h3 className="text-gray-600 font-medium flex items-center mb-3">
            <MessageSquare size={18} className="mr-2 text-gray-500" />
            HOD's Comments
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 pl-6">
            <p className="text-gray-800 mb-4 italic">"{complaint.hodComments.text}"</p>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                {complaint.hodComments.author.charAt(0)}
              </div>
              <div>
                <p className="text-gray-800 font-medium">{complaint.hodComments.author}</p>
                <p className="text-gray-500 text-sm">{complaint.hodComments.department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;