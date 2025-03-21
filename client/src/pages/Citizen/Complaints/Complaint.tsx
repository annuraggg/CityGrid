import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search,
  ArrowDownAZ,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Building,
  MapPin,
  RefreshCw,
  LayoutDashboard,
  Info,
  ChevronRight,
  UserCircle
} from "lucide-react";

const MyComplaints = () => {
  // Sample complaints data
  const complaints = [
    {
      id: "CMP-101",
      municipalCorp: "BMC",
      subject: "Road Damage",
      location: "Sector 12, Mumbai",
      lastUpdated: "15-Mar-2025",
      status: "Pending"
    },
    {
      id: "CMP-202",
      municipalCorp: "TMC",
      subject: "Water Leakage",
      location: "Thane West",
      lastUpdated: "10-Mar-2025",
      status: "Resolved"
    },
    {
      id: "CMP-303",
      municipalCorp: "PMC",
      subject: "Streetlight",
      location: "Pune City",
      lastUpdated: "12-Mar-2025",
      status: "Escalated"
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Count complaints by status
  const statusCounts = complaints.reduce((counts, complaint) => {
    const status = complaint.status.toLowerCase();
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});

  // Total count
  const totalCount = complaints.length;

  // Filter complaints based on search and active tab
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.municipalCorp.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      complaint.status.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'resolved':
        return (
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200">
            <CheckCircle2 size={16} />
            <span className="font-medium">Resolved</span>
          </div>
        );
      case 'escalated':
        return (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-200">
            <AlertTriangle size={16} />
            <span className="font-medium">Escalated</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-200">
            <Clock size={16} />
            <span className="font-medium">Pending</span>
          </div>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const getStatusIcon = (status, size = 18) => {
    switch(status.toLowerCase()) {
      case 'resolved':
        return <CheckCircle2 size={size} className="text-green-500" />;
      case 'escalated':
        return <AlertTriangle size={size} className="text-amber-500" />;
      case 'pending':
        return <Clock size={size} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white w-full">
      <div className="container px-0 mx-auto">
        {/* Header with Title and Button */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-gray-700" size={28} />
            <h1 className="text-3xl font-bold text-gray-800">My Complaints</h1>
          </div>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-2 flex items-center gap-2 md:w-auto w-full justify-center">
            <Plus size={18} />
            File a New Complaint
          </Button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search by ID, subject, location or department"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <Button className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-md px-4 py-2 flex items-center gap-2 whitespace-nowrap">
                  <ArrowDownAZ size={18} />
                  <span className="hidden md:inline">Sort:</span> Newest
                </Button>
                
                <Button className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-md px-4 py-2 flex items-center gap-2 whitespace-nowrap">
                  <SlidersHorizontal size={18} />
                  <span className="hidden md:inline">Filter:</span> All
                </Button>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="bg-gray-100 border-b border-gray-200 p-1 flex flex-wrap md:flex-nowrap gap-1">
            <button 
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('all')}
            >
              <FileText size={18} className="mr-2" />
              All Complaints
              <span className="ml-2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs text-white font-medium">
                {totalCount}
              </span>
            </button>
            
            <button 
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'resolved' ? 'bg-green-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('resolved')}
            >
              <CheckCircle2 size={18} className="mr-2" />
              Resolved 
              <span className="ml-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                {statusCounts.resolved || 0}
              </span>
            </button>
            
            <button 
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'escalated' ? 'bg-amber-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('escalated')}
            >
              <AlertTriangle size={18} className="mr-2" />
              Escalated 
              <span className="ml-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                {statusCounts.escalated || 0}
              </span>
            </button>
            
            <button 
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'pending' ? 'bg-red-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('pending')}
            >
              <Clock size={18} className="mr-2" />
              Pending 
              <span className="ml-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                {statusCounts.pending || 0}
              </span>
            </button>
          </div>

          {/* Complaints Table */}
          <div className="overflow-x-auto">
            {filteredComplaints.length > 0 ? (
              <table className="w-full min-w-full">
                <thead>
                  <tr className="text-left text-gray-600 bg-gray-50">
                    <th className="py-3 px-4 font-medium">Complaint ID</th>
                    <th className="py-3 px-4 font-medium">Municipal Corp</th>
                    <th className="py-3 px-4 font-medium">Subject</th>
                    <th className="py-3 px-4 font-medium">Location</th>
                    <th className="py-3 px-4 font-medium">Last Updated</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-500" />
                          <span className="font-medium">{complaint.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Building size={16} className="text-gray-500" />
                          {complaint.municipalCorp}
                        </div>
                      </td>
                      <td className="py-4 px-4">{complaint.subject}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          {complaint.location}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <RefreshCw size={16} className="text-gray-500" />
                          {complaint.lastUpdated}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(complaint.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Search size={48} className="mb-3 text-gray-300" />
                  <p className="text-lg font-medium mb-1">No complaints found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination/Summary */}
          {filteredComplaints.length > 0 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-200 text-sm text-gray-600">
              <div>Showing {filteredComplaints.length} of {totalCount} complaints</div>
              <div className="flex items-center">
                <button className="px-3 py-1 border border-gray-300 rounded-l-md bg-white hover:bg-gray-50">Previous</button>
                <button className="px-3 py-1 border-y border-r border-gray-300 rounded-r-md bg-white hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Information */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <Info size={16} />
            <span>Current Time: 2025-03-21 06:09:12 (UTC)</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCircle size={16} />
            <span>User: Ammar2123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;