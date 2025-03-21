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
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Page Header - Updated with improved spacing and visual hierarchy */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Team Management</h1>
            <p className="text-slate-500 text-base">Manage personnel and department assignments across the organization</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium">
                <UserPlus size={16} className="mr-2" />
                <span>Invite Team Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription className="text-slate-500">
                  Send an invitation email to add a new team member to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right text-slate-600">
                    Role
                  </Label>
                  <div className="col-span-3">
                    <Select
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right text-slate-600">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@municipality.gov"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="text-slate-600">
                  Cancel
                </Button>
                <Button type="submit" onClick={addTeamMember}>
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters - Updated with improved styling */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by name, department, or email address..."
              className="pl-10 bg-white border-slate-200 h-10 text-slate-800 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Button 
              variant="outline" 
              size="sm"
              className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
            >
              <FileDown className="h-4 w-4 mr-2 text-slate-500" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 font-medium"
            >
              <Filter className="h-4 w-4 mr-2 text-slate-500" />
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

      {/* Team Members Tabs - Updated to match Notifications component styling */}
      <Tabs defaultValue="project-managers" className="w-full">
        <TabsList className="bg-white border border-slate-200 mb-6 w-auto h-11 p-1">
          <TabsTrigger value="project-managers" className="h-9 px-4 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
            Project Managers
          </TabsTrigger>
          <TabsTrigger value="hods" className="h-9 px-4 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
            Department Heads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="project-managers" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden p-0">
            <Table className="w-full">
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow>
                  <TableHead className="w-12 text-slate-600 font-medium">ID</TableHead>
                  <TableHead className="text-slate-600 font-medium">Name</TableHead>
                  <TableHead className="text-slate-600 font-medium">Department</TableHead>
                  <TableHead className="text-slate-600 font-medium">Email</TableHead>
                  <TableHead className="text-slate-600 font-medium">Status</TableHead>
                  <TableHead className="text-slate-600 font-medium">Projects</TableHead>
                  <TableHead className="text-right w-24 text-slate-600 font-medium pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPMs.length > 0 ? (
                  filteredPMs.map((pm) => (
                    <TableRow key={pm.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-700">{pm.id}</TableCell>
                      <TableCell className="text-slate-900 font-medium">{pm.name}</TableCell>
                      <TableCell className="text-slate-700">{pm.department}</TableCell>
                      <TableCell className="text-slate-700">{pm.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`px-2 py-0.5 text-xs font-medium ${
                            pm.status === "Active" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {pm.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700">{pm.projects}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 h-8 w-8 rounded-full">
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 h-8 w-8 rounded-full">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                      {searchQuery ? "No project managers match your search criteria" : "No project managers found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
              <div>Displaying {filteredPMs.length} of {projectManagers.length} project managers</div>
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
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="hods" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow>
                  <TableHead className="w-12 text-slate-600 font-medium">ID</TableHead>
                  <TableHead className="text-slate-600 font-medium">Name</TableHead>
                  <TableHead className="text-slate-600 font-medium">Department</TableHead>
                  <TableHead className="text-slate-600 font-medium">Email</TableHead>
                  <TableHead className="text-slate-600 font-medium">Status</TableHead>
                  <TableHead className="text-slate-600 font-medium">Team Size</TableHead>
                  <TableHead className="text-right w-24 text-slate-600 font-medium  pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHODs.length > 0 ? (
                  filteredHODs.map((hod) => (
                    <TableRow key={hod.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-700">{hod.id}</TableCell>
                      <TableCell className="text-slate-900 font-medium">{hod.name}</TableCell>
                      <TableCell className="text-slate-700">{hod.department}</TableCell>
                      <TableCell className="text-slate-700">{hod.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`px-2 py-0.5 text-xs font-medium ${
                            hod.status === "Active" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {hod.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700">{hod.teamSize}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 h-8 w-8 rounded-full">
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-100 h-8 w-8 rounded-full">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                      {searchQuery ? "No department heads match your search criteria" : "No department heads found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
              <div>Displaying {filteredHODs.length} of {hods.length} department heads</div>
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
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Team;