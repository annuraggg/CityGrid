import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

type Project = {
  id: string;
  name: string;
  department: string;
  status: "In Progress" | "Completed";
};

type Conflict = {
  id: string;
  name: string;
  departmentsAffected: string;
  status: "Unresolved" | "Resolved";
};

const ProjectsDashboard: React.FC = () => {
  const projects: Project[] = [
    {
      id: "PRJ-101",
      name: "Metro Waterline Upgrade",
      department: "Water Supply",
      status: "In Progress",
    },
    {
      id: "PRJ-202",
      name: "Smart Grid Installation",
      department: "Energy",
      status: "Completed",
    },
    {
      id: "PRJ-303",
      name: "Road Expansion Phase 2",
      department: "Public Works",
      status: "In Progress",
    },
  ];

  const conflicts: Conflict[] = [
    {
      id: "CNF-001",
      name: "Waterline vs Gas Pipeline",
      departmentsAffected: "Water Supply, Gas",
      status: "Unresolved",
    },
    {
      id: "CNF-002",
      name: "Road Expansion vs Telecom...",
      departmentsAffected: "Public Works, Tele...",
      status: "Resolved",
    },
    {
      id: "CNF-003",
      name: "Smart Grid vs Underground...",
      departmentsAffected: "Energy, Sanitation",
      status: "Unresolved",
    },
  ];

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects Dashboard</h1>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Create New Project
        </Button>
      </div>

      <Card className="mb-6 border-dotted border-2 border-blue-200">
        <CardHeader className="bg-blue-100 p-2 flex flex-row justify-between items-center">
          <CardTitle className="text-blue-500 flex items-center">
            <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
            Department Projects
          </CardTitle>

        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-sm font-normal text-left p-3">
                    Project ID
                  </th>
                  <th className="text-sm font-normal text-left p-3">
                    Project Name
                  </th>
                  <th className="text-sm font-normal text-left p-3">
                    Department
                  </th>
                  <th className="text-sm font-normal text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b">
                    <td className="p-3">{project.id}</td>
                    <td className="p-3">{project.name}</td>
                    <td className="p-3">{project.department}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          project.status === "Completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        • {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dotted border-2 border-red-200">
        <CardHeader className="bg-red-100 p-2 flex flex-row justify-between items-center">
          <CardTitle className="text-red-500 flex items-center">
            <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
            Project Conflicts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-sm font-normal text-left p-3">
                    Conflict ID
                  </th>
                  <th className="text-sm font-normal text-left p-3">
                    Conflict Name
                  </th>
                  <th className="text-sm font-normal text-left p-3">
                    Departments Affected
                  </th>
                  <th className="text-sm font-normal text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {conflicts.map((conflict) => (
                  <tr key={conflict.id} className="border-b">
                    <td className="p-3">{conflict.id}</td>
                    <td className="p-3">{conflict.name}</td>
                    <td className="p-3">{conflict.departmentsAffected}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          conflict.status === "Resolved"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        • {conflict.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsDashboard;
