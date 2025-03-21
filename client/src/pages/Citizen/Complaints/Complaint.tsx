import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ChevronLeft,
  UserCircle,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  FileDown
} from "lucide-react";
import { Link } from "react-router-dom";

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
  const statusCounts = complaints.reduce((counts: { [key: string]: number }, complaint) => {
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

  const getStatusBadgeClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'resolved':
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 'escalated':
        return "bg-rose-50 text-rose-700 border-rose-200";
      case 'pending':
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string, size = 16) => {
    switch(status.toLowerCase()) {
      case 'resolved':
        return <CheckCircle2 size={size} className="mr-1.5 text-emerald-600" />;
      case 'escalated':
        return <AlertTriangle size={size} className="mr-1.5 text-rose-600" />;
      case 'pending':
        return <Clock size={size} className="mr-1.5 text-amber-600" />;
      default:
        return null;
    }
  };

  const TableHeader = ({ label }: { label: string }) => (
    <th className="text-sm font-medium text-left p-3 text-slate-600">
      {label}
    </th>
  );

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Dashboard Header with Title and Button */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">My Complaints</h1>
            <p className="text-slate-500 text-base">Track and manage your municipal complaints and issues</p>
          </div>
            <Link to="/citizen/create-complaints">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              File a New Complaint
            </Button>
            </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by ID, subject, location or department"
              className="pl-10 bg-white border-slate-200 h-10 text-slate-800 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
            >
              <ArrowDownAZ className="h-4 w-4 mr-2 text-slate-500" />
              Sort: Newest
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2 text-slate-500" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
            >
              <RotateCw className="h-4 w-4 mr-2 text-slate-500" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
            >
              <FileDown className="h-4 w-4 mr-2 text-slate-500" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Complaints Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
        <CardHeader className="bg-slate-50 py-4 px-5 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-slate-800 flex items-center text-lg font-semibold">
              <span className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></span>
              Complaint Dashboard
            </CardTitle>
            
            <Tabs defaultValue={activeTab} className="w-fit" onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-slate-200 h-9 p-1">
                <TabsTrigger 
                  value="all" 
                  className="px-3 h-7 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                >
                  All
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
                    {totalCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="pending" 
                  className="px-3 h-7 text-sm font-medium data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
                >
                  Pending
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-medium text-amber-700">
                    {statusCounts.pending || 0}
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="escalated" 
                  className="px-3 h-7 text-sm font-medium data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
                >
                  Escalated
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-xs font-medium text-rose-700">
                    {statusCounts.escalated || 0}
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="resolved" 
                  className="px-3 h-7 text-sm font-medium data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  Resolved
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-700">
                    {statusCounts.resolved || 0}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {filteredComplaints.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <TableHeader label="Complaint ID" />
                    <TableHeader label="Municipal Corp" />
                    <TableHeader label="Subject" />
                    <TableHeader label="Location" />
                    <TableHeader label="Last Updated" />
                    <TableHeader label="Status" />
                    <TableHeader label="View" />
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">
                        <Link to={`/citizen/complaints/${complaint.id}`} className="text-slate-900 hover:text-indigo-600">
                          {complaint.id}
                        </Link>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <Building size={16} className="text-slate-500" />
                          <span className="text-slate-700">{complaint.municipalCorp}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700">{complaint.subject}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={16} className="text-slate-500" />
                          <span className="text-slate-700">{complaint.location}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <RefreshCw size={16} className="text-slate-500" />
                          <span className="text-slate-700">{complaint.lastUpdated}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant="outline" 
                          className={`flex items-center ${getStatusBadgeClass(complaint.status)}`}
                        >
                          {getStatusIcon(complaint.status)}
                          {complaint.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Link to={`/citizen/complaints/${complaint.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Search size={48} className="mb-3 text-slate-300" />
                  <p className="text-lg font-medium mb-1">No complaints found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
          <div>Displaying {filteredComplaints.length} of {totalCount} complaints</div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled 
              className="text-slate-600 border-slate-200 h-9 px-3 text-xs font-medium"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-slate-600 border-slate-200 hover:bg-slate-50 h-9 px-3 text-xs font-medium"
            >
              Next
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MyComplaints;