import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  Clock, 
  Filter, 
  ArrowDownWideNarrow, 
  ChevronDown, 
  Search,
  Building,
  FileText,
  Briefcase,
  LayoutGrid
} from "lucide-react";

const OngoingProjects = () => {
  // Sample data for ongoing projects
  const projects = [
    { id: "PRJ-101", name: "Metro Waterline Upgrade", department: "Water Supply", status: "In Progress" },
    { id: "PRJ-202", name: "Smart Grid Installation", department: "Energy", status: "Completed" },
    { id: "PRJ-303", name: "Road Expansion Phase 2", department: "Public Works", status: "In Progress" }
  ];

  const getStatusIcon = (status:any) => {
    switch(status) {
      case 'Completed':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'In Progress':
        return <Clock className="text-amber-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="p-6 bg-white w-full">
      <div className="container px-0 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-gray-700" size={24} />
            <h1 className="text-3xl font-medium">Ongoing Projects</h1>
          </div>
          <Button variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2">
            <Building size={18} className="text-gray-600" />
            Municipal Corp: BMC
            <ChevronDown size={18} />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input 
              type="text" 
              placeholder="Search Projects" 
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2 min-w-[140px]">
              <ArrowDownWideNarrow size={18} className="text-gray-600" />
              <span>Sort: Newest</span>
            </Button>
            
            <Button variant="outline" className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-4 py-2 flex items-center gap-2 min-w-[120px]">
              <Filter size={18} />
              <span>Filter: All</span>
            </Button>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-4 rounded-t-md flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-400" />
            <span>Completed</span>
            <div className="bg-white text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium ml-1">
              1
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-amber-400" />
            <span>In Progress</span>
            <div className="bg-white text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium ml-1">
              2
            </div>
          </div>
        </div>

        <div className="border border-gray-300 rounded-b-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="text-left p-4 font-medium">Project ID</th>
                <th className="text-left p-4 font-medium">Project Name</th>
                <th className="text-left p-4 font-medium">Department</th>
                <th className="text-left p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-base">
              {projects.map((project, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      {project.id}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-gray-500" />
                      {project.name}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-gray-500" />
                      {project.department}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <span className={`font-medium ${
                        project.status === "Completed" ? "text-green-500" : 
                        "text-amber-500"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div>Showing 3 of 3 projects</div>
          <div className="flex items-center gap-2">
            <span>Updated: 2025-03-21</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingProjects;