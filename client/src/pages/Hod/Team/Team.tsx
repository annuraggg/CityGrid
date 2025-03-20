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
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { Plus, Search, UserPlus, Edit, Trash2, MoreHorizontal } from "lucide-react";
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
        toast.success(`${newMemberRole === "project-manager" ? "Project Manager" : "Head of Department"} invited successfully`);
        setDialogOpen(false);
        setNewMemberEmail("");
      })
      .catch(() => {
        toast.error(`Failed to invite ${newMemberRole === "project-manager" ? "Project Manager" : "Head of Department"}`);
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
    <div className="w-full h-full">
      <div className="bg-gray-50 border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-gray-500 mt-1">Manage your project managers and department heads</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus size={16} />
                <span>Add Team Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Invite a new team member by entering their email address.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <div className="col-span-3">
                    <select 
                      id="role"
                      className="w-full rounded-md border border-input p-2"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                    >
                      <option value="project-manager">Project Manager</option>
                      <option value="hod">Head of Department</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@company.com"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
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

      <div className="p-6">
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search team members by name, department, or email..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Export</Button>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <Tabs defaultValue="project-managers" className="w-full">
          <TabsList className="grid grid-cols-2 w-64 mb-6">
            <TabsTrigger value="project-managers">Project Managers</TabsTrigger>
            <TabsTrigger value="hods">Department Heads</TabsTrigger>
          </TabsList>

          <TabsContent value="project-managers" className="w-full">
            <div className="bg-white rounded-md border shadow-sm w-full overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead className="text-right w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPMs.length > 0 ? (
                    filteredPMs.map((pm) => (
                      <TableRow key={pm.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{pm.id}</TableCell>
                        <TableCell>{pm.name}</TableCell>
                        <TableCell>{pm.department}</TableCell>
                        <TableCell>{pm.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            pm.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {pm.status}
                          </span>
                        </TableCell>
                        <TableCell>{pm.projects}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                        {searchQuery ? "No project managers match your search" : "No project managers added yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredPMs.length} of {projectManagers.length} project managers
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hods" className="w-full">
            <div className="bg-white rounded-md border shadow-sm w-full overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead className="text-right w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHODs.length > 0 ? (
                    filteredHODs.map((hod) => (
                      <TableRow key={hod.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{hod.id}</TableCell>
                        <TableCell>{hod.name}</TableCell>
                        <TableCell>{hod.department}</TableCell>
                        <TableCell>{hod.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            hod.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {hod.status}
                          </span>
                        </TableCell>
                        <TableCell>{hod.teamSize}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                        {searchQuery ? "No HODs match your search" : "No HODs added yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredHODs.length} of {hods.length} department heads
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-4 gap-6 p-6 mt-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium">Total Team Members</h3>
          <p className="text-3xl font-bold mt-2">{projectManagers.length + hods.length}</p>
          <p className="text-sm text-gray-500 mt-2">Across all departments</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium">Active Projects</h3>
          <p className="text-3xl font-bold mt-2">{projectManagers.reduce((sum, pm) => sum + pm.projects, 0)}</p>
          <p className="text-sm text-gray-500 mt-2">Managed by PMs</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium">Total Departments</h3>
          <p className="text-3xl font-bold mt-2">{new Set(hods.map(hod => hod.department)).size}</p>
          <p className="text-sm text-gray-500 mt-2">Active departments</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium">Team Size</h3>
          <p className="text-3xl font-bold mt-2">{hods.reduce((sum, hod) => sum + hod.teamSize, 0)}</p>
          <p className="text-sm text-gray-500 mt-2">Total employees</p>
        </div>
      </div>
    </div>
  );
};

export default Team;