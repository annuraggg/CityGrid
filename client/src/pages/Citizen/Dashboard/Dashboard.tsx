import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Bell,
  ChevronDown,
  Filter,
  Download,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Link } from 'react-router-dom';

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return "bg-amber-50 text-amber-700 border-amber-200";
      case 'Resolved':
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 'Escalated':
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="text-amber-600" size={18} />;
      case 'Resolved':
        return <CheckCircle2 className="text-emerald-600" size={18} />;
      case 'Escalated':
        return <AlertTriangle className="text-rose-600" size={18} />;
      default:
        return <Clock className="text-slate-500" size={18} />;
    }
  };

  const getUpdateIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="text-amber-600 bg-amber-50 p-1 rounded-full" size={20} />;
      case 'Escalated':
        return <AlertTriangle className="text-rose-600 bg-rose-50 p-1 rounded-full" size={20} />;
      case 'Resolved':
        return <CheckCircle2 className="text-emerald-600 bg-emerald-50 p-1 rounded-full" size={20} />;
      default:
        return <Clock className="text-slate-500 bg-slate-50 p-1 rounded-full" size={20} />;
    }
  };

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Header with improved spacing and visual hierarchy */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Citizen Dashboard</h1>
            <p className="text-slate-500 text-base">Track and manage your municipal complaints and issues</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
            >
              <Filter className="h-4 w-4 mr-2 text-slate-500" />
              Filter
            </Button>
            <Link to="/citizen/create-complaints">         <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              New Complaint
            </Button></Link>

          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="flex items-center p-5">
            <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Complaints</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-slate-900 mr-2">100</p>
                <p className="text-sm text-slate-500">all time</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="flex items-center p-5">
            <div className="flex-shrink-0 bg-amber-50 p-3 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-slate-500 mb-1">Pending</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-slate-900 mr-2">24</p>
                <p className="text-sm text-slate-500">complaints</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="flex items-center p-5">
            <div className="flex-shrink-0 bg-emerald-50 p-3 rounded-lg mr-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-slate-500 mb-1">Resolved</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-slate-900 mr-2">65</p>
                <p className="text-sm text-slate-500">complaints</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="flex items-center p-5">
            <div className="flex-shrink-0 bg-rose-50 p-3 rounded-lg mr-4">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-slate-500 mb-1">Escalated</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-slate-900 mr-2">11</p>
                <p className="text-sm text-slate-500">complaints</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Complaints Chart */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-slate-600" />
                <span>Complaints Overview</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-xs font-medium"
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                Last 30 Days
                <ChevronDown className="h-3.5 w-3.5 ml-1.5 text-slate-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col">
              <div className="mt-2 mb-6">
                <p className="text-4xl font-semibold text-slate-900">100</p>
                <p className="text-sm text-slate-500 mt-1">Total complaints filed</p>
              </div>
              <div className="h-48 w-full bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center">
                <p className="text-slate-400 text-sm">Chart visualization goes here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-slate-600" />
              <span>Recent Updates</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              {recentUpdates.map((update, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
                  {getUpdateIcon(update.status)}
                  <div>
                    <p className="text-slate-800">
                      <span className="font-medium">Complaint {update.id}</span> {update.message}
                    </p>
                    <p className="text-sm text-slate-500">{update.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
        <CardHeader className="bg-slate-50 py-4 px-5 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-600" />
              <span>Recent Complaints</span>
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
              >
                <Download className="h-4 w-4 mr-2 text-slate-500" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left p-4 text-sm font-medium text-slate-600">Complaint ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Municipal Corp</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Subject</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Location</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Last Updated</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">View</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.map((complaint, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{complaint.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Building size={16} className="text-slate-500" />
                      {complaint.department}
                    </div>
                  </td>
                  <td className="p-4 text-slate-700">{complaint.subject}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin size={16} className="text-slate-500" />
                      {complaint.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <RefreshCw size={16} className="text-slate-500" />
                      {complaint.lastUpdated}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1.5 px-2.5 py-0.5 ${getStatusBadgeClass(complaint.status)}`}
                    >
                      {getStatusIcon(complaint.status)}
                      {complaint.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
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
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
          Displaying {recentComplaints.length} of 100 complaints
        </div>
      </Card>
    </div>
  );
};

export default CitizenDashboard;