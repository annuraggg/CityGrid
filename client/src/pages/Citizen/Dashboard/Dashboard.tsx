import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  BarChart2, 
  Calendar, 
  MapPin, 
  FileText,
  Building,
  RefreshCw,
  Bell
} from "lucide-react";

const CitizenDashboard = () => {
  // Sample data for recent complaints
  const recentComplaints = [
    { id: "CMP-101", department: "BMC", subject: "Road Damage", location: "Sector 12, Mumbai", lastUpdated: "15-Mar-2025", status: "Pending" },
    { id: "CMP-202", department: "TMC", subject: "Water Leakage", location: "Thane West", lastUpdated: "10-Mar-2025", status: "Resolved" },
    { id: "CMP-303", department: "PMC", subject: "Streetlight", location: "Pune City", lastUpdated: "12-Mar-2025", status: "Escalated" }
  ];

  // Sample data for recent updates
  const recentUpdates = [
    { id: "CMP-101", message: "has been successfully filed", date: "Last updated 3 days ago", status: "Pending" },
    { id: "CMP-1301", message: "has been escalated to BMC", date: "Last updated 1 day ago", status: "Escalated" },
    { id: "CMP-201", message: "has been successfully resolved", date: "Last updated 4 days ago", status: "Resolved" },
    { id: "CMP-11", message: "has been successfully resolved", date: "Last updated 2 weeks ago", status: "Resolved" }
  ];

  const getStatusIcon = (status:any) => {
    switch(status) {
      case 'Pending':
        return <Clock className="text-red-500" size={20} />;
      case 'Resolved':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'Escalated':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getUpdateIcon = (status:any) => {
    switch(status) {
      case 'Pending':
        return <Clock className="text-red-500 bg-red-50 p-1 rounded-full" size={22} />;
      case 'Escalated':
        return <AlertTriangle className="text-yellow-500 bg-yellow-50 p-1 rounded-full" size={22} />;
      case 'Resolved':
        return <CheckCircle2 className="text-green-500 bg-green-50 p-1 rounded-full" size={22} />;
      default:
        return <Clock className="text-gray-500" size={22} />;
    }
  };

  return (
    <div className="p-6 bg-white w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-medium">Citizen Dashboard</h1>
      </div>
      
      <div className="container px-0 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Complaints Chart */}
          <Card className="w-full border shadow-sm h-full">
            <CardHeader className="p-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BarChart2 className="text-gray-700" size={20} />
                  <h2 className="text-base font-medium">Complaints Chart</h2>
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 border rounded p-2 text-sm">
                    <Calendar size={16} className="text-gray-500" />
                    <select className="appearance-none bg-transparent pr-8 focus:outline-none">
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-5xl font-bold">100</p>
                <p className="text-sm text-gray-500 mt-1">Total complaints filed</p>
              </div>
            </CardHeader>
          </Card>
          
          {/* Recent Updates */}
          <Card className="w-full border shadow-sm h-full">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center gap-2">
                <Bell className="text-gray-700" size={20} />
                <h2 className="text-base font-medium">Recent Updates</h2>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-2">
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {getUpdateIcon(update.status)}
                    <div>
                      <p className="text-base">
                        <span className="font-medium">Complaint {update.id}</span> {update.message}
                      </p>
                      <p className="text-sm text-gray-500">{update.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
          
        {/* Recent Complaints Table */}
        <div className="w-full">
          <div className="bg-gray-900 text-white p-4 rounded-t-md flex items-center gap-2">
            <FileText size={18} />
            <h2 className="text-base">Recent Complaints</h2>
          </div>
          <div className="border border-gray-300 rounded-b-md overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="text-left p-4">Complaint ID</th>
                  <th className="text-left p-4">Municipal Corp</th>
                  <th className="text-left p-4">Subject</th>
                  <th className="text-left p-4">Location</th>
                  <th className="text-left p-4">Last Updated</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-base">
                {recentComplaints.map((complaint, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4 font-medium">{complaint.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-gray-500" />
                        {complaint.department}
                      </div>
                    </td>
                    <td className="p-4">{complaint.subject}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-500" />
                        {complaint.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <RefreshCw size={16} className="text-gray-500" />
                        {complaint.lastUpdated}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(complaint.status)}
                        <span className={`text-base font-medium ${
                          complaint.status === "Pending" ? "text-red-500" : 
                          complaint.status === "Resolved" ? "text-green-500" : 
                          "text-yellow-500"
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;