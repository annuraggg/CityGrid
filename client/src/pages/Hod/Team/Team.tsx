// merge conflict

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import {
  Search,
  UserPlus,
  Edit,
  MoreHorizontal,
  FileDown,
  Filter,
  ArrowLeft,
  ArrowRight,
  Users,
  ClipboardList,
  Building
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Team = () => {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("project-manager");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const addTeamMember = async () => {
    axios
      .post(`/invites/${newMemberRole}`, { email: newMemberEmail })
      .then(() => {
        toast.success(`${newMemberRole === "project-manager" ? "Project Manager" : "Department Head"} invitation sent successfully`);
        setDialogOpen(false);
        setNewMemberEmail("");
      })
      .catch(() => {
        toast.error(`Failed to send invitation to ${newMemberRole === "project-manager" ? "Project Manager" : "Department Head"}`);
      });
  };

  const projectManagers = [
    { id: 1, name: "John Doe", department: "IT", email: "john.doe@example.com", status: "Active", projects: 5 },
    { id: 2, name: "Jane Doe", department: "HR", email: "jane.doe@example.com", status: "Active", projects: 3 },
    { id: 3, name: "Robert Smith", department: "Marketing", email: "robert.smith@example.com", status: "On Leave", projects: 2 },
    { id: 4, name: "Emily Johnson", department: "Finance", email: "emily.j@example.com", status: "Active", projects: 4 },
    { id: 5, name: "Michael Brown", department: "Operations", email: "m.brown@example.com", status: "Active", projects: 7 },
  ];

  const hods = [
    { id: 1, name: "Jennifer White", department: "IT", email: "j.white@example.com", status: "Active", teamSize: 15 },
    { id: 2, name: "David Wilson", department: "HR", email: "d.wilson@example.com", status: "Active", teamSize: 8 },
    { id: 3, name: "Sarah Miller", department: "Marketing", email: "s.miller@example.com", status: "Active", teamSize: 12 },
    { id: 4, name: "James Taylor", department: "Finance", email: "j.taylor@example.com", status: "On Leave", teamSize: 7 },
    { id: 5, name: "Lisa Anderson", department: "Operations", email: "l.anderson@example.com", status: "Active", teamSize: 20 },
  ];

  const filteredPMs = projectManagers.filter(
    pm => pm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pm.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pm.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHODs = hods.filter(
    hod => hod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hod.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hod.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Team Management</h1>
            <p className="text-gray-500 text-sm">Manage department personnel</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <UserPlus size={14} />
                <span>Add Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Invite a new team member by entering their email.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-3">
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="role" className="text-right text-sm">
                    Role
                  </Label>
                  <div className="col-span-3">
                    <select
                      id="role"
                      className="w-full rounded-md border border-input p-2 text-sm"
                      value={newMemberRole}
                      onValueChange={setNewMemberRole}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="project-manager">Project Manager</SelectItem>
                        <SelectItem value="hod">Department Head</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-3">
                  <Label htmlFor="email" className="text-right text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@municipality.gov"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="col-span-3 text-sm"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" type="submit" onClick={addTeamMember}>
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 flex space-x-3">
          <div className="relative flex-grow">
            <Search
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              placeholder="Search by name, department, or email..."
              className="pl-8 w-full text-sm h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Updated with consistent styling */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="flex items-center p-5">
            <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg mr-4">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-slate-500 mb-1">Team Members</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-slate-900 mr-2">{projectManagers.length + hods.length}</p>
                <p className="text-sm text-slate-500">management personnel</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="flex items-center p-5">
            <div className="flex-shrink-0 bg-emerald-50 p-3 rounded-lg mr-4">
              <ClipboardList className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-slate-500 mb-1">Active Projects</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-slate-900 mr-2">{projectManagers.reduce((sum, pm) => sum + pm.projects, 0)}</p>
                <p className="text-sm text-slate-500">in progress</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="flex items-center p-5">
            <div className="flex-shrink-0 bg-blue-50 p-3 rounded-lg mr-4">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-slate-500 mb-1">Departments</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-slate-900 mr-2">{new Set(hods.map(hod => hod.department)).size}</p>
                <p className="text-sm text-slate-500">active units</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="flex items-center p-5">
            <div className="flex-shrink-0 bg-purple-50 p-3 rounded-lg mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Staff</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-slate-900 mr-2">{hods.reduce((sum, hod) => sum + hod.teamSize, 0)}</p>
                <p className="text-sm text-slate-500">across all departments</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

        <Tabs defaultValue="project-managers" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="project-managers">Project Managers</TabsTrigger>
            <TabsTrigger value="hods">Department Heads</TabsTrigger>
          </TabsList>

          <TabsContent value="project-managers" className="w-full">
            <div className="bg-white rounded-md border shadow-sm w-full overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-12 py-2 text-xs">ID</TableHead>
                    <TableHead className="py-2 text-xs">Name</TableHead>
                    <TableHead className="py-2 text-xs">Department</TableHead>
                    <TableHead className="py-2 text-xs">Email</TableHead>
                    <TableHead className="text-right w-16 py-2 text-xs">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.filter((t) => t.role === "pm").length > 0 ? (
                    team
                      .filter((t) => t.role === "pm")
                      .map((pm) => (
                        <TableRow key={pm._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium py-2 text-xs">
                            {pm._id}
                          </TableCell>
                          <TableCell className="py-2 text-sm">
                            {pm.name}
                          </TableCell>
                          <TableCell className="py-2 text-sm">
                            {pm.department.name}
                          </TableCell>
                          <TableCell className="py-2 text-sm">
                            {pm.email}
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                              >
                                <MoreHorizontal size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-gray-500 text-sm"
                      >
                        {searchQuery
                          ? "No project managers match your search"
                          : "No project managers added yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Showing {team.filter((t) => t.role === "pm").length} of{" "}
                {team.filter((t) => t.role === "pm").length} project managers
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  disabled
                >
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

          <TabsContent value="hods" className="w-full">
            <div className="bg-white rounded-md border shadow-sm w-full overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-12 py-2 text-xs">ID</TableHead>
                    <TableHead className="py-2 text-xs">Name</TableHead>
                    <TableHead className="py-2 text-xs">Department</TableHead>
                    <TableHead className="py-2 text-xs">Email</TableHead>
                    <TableHead className="text-right w-16 py-2 text-xs">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.filter((t) => t.role === "hod").length > 0 ? (
                    team
                      .filter((t) => t.role === "hod")
                      .map((hod) => (
                        <TableRow key={hod._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium py-2 text-xs">
                            {hod._id}
                          </TableCell>
                          <TableCell className="py-2 text-sm">
                            {hod.name}
                          </TableCell>
                          <TableCell className="py-2 text-sm">
                            {hod.department.name}
                          </TableCell>
                          <TableCell className="py-2 text-sm">
                            {hod.email}
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                              >
                                <MoreHorizontal size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-gray-500 text-sm"
                      >
                        {searchQuery
                          ? "No HODs match your search"
                          : "No HODs added yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Showing {team.filter((t) => t.role === "hod").length} of{" "}
                {team.filter((t) => t.role === "hod").length} department heads
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  disabled
                >
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-4 gap-4 px-4 mt-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium">Total Team Members</h3>
          <p className="text-2xl font-bold mt-1">
            {team.filter((t) => t.role === "pm").length +
              team.filter((t) => t.role === "hod").length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Across all departments</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium">Total Departments</h3>
          <p className="text-2xl font-bold mt-1">
            {
              new Set(
                team
                  .filter((t) => t.role === "hod")
                  .map((hod) => hod.department)
              ).size
            }
          </p>
          <p className="text-xs text-gray-500 mt-1">Active departments</p>
        </div>
      </div>
    </div>
  );
};

export default Team;