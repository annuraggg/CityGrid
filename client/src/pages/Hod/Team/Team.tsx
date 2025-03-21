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
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { Search, UserPlus, Edit, MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExtendedUser from "@/types/ExtendedUser";

const Team = () => {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("project-manager");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { getToken } = useAuth();
  const { user } = useUser();
  const axios = ax(getToken);

  const [team, setTeam] = useState<ExtendedUser[]>([]);

  useEffect(() => {
    if (!user || !user.publicMetadata.department) return;
    const dept = user.publicMetadata.department;
    axios
      .get("/users/team/" + dept)
      .then((res) => {
        setTeam(res.data.data);
      })
      .catch(() => {
        toast.error("Failed to fetch team members");
      });
  }, [user]);

  const addTeamMember = async () => {
    axios
      .post(`/invites/${newMemberRole}`, { email: newMemberEmail })
      .then(() => {
        toast.success(
          `${
            newMemberRole === "project-manager"
              ? "Project Manager"
              : "Head of Department"
          } invited successfully`
        );
        setDialogOpen(false);
        setNewMemberEmail("");
      })
      .catch(() => {
        toast.error(
          `Failed to invite ${
            newMemberRole === "project-manager"
              ? "Project Manager"
              : "Head of Department"
          }`
        );
      });
  };

  return (
    <div className="w-full h-full">
      <div className="bg-gray-50 border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-gray-500 mt-1">
              Manage your project managers and department heads
            </p>
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
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
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
                    <TableHead className="text-right w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.filter((t) => t.role === "pm").length > 0 ? (
                    team
                      .filter((t) => t.role === "pm")
                      .map((pm) => (
                        <TableRow key={pm._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {pm._id}
                          </TableCell>
                          <TableCell>{pm.name}</TableCell>
                          <TableCell>{pm.department.name}</TableCell>
                          <TableCell>{pm.email}</TableCell>
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
                      <TableCell
                        colSpan={7}
                        className="h-32 text-center text-gray-500"
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
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {team.filter((t) => t.role === "pm").length} of{" "}
                {team.filter((t) => t.role === "pm").length} project managers
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
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
                    <TableHead className="text-right w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.filter((t) => t.role === "hod").length > 0 ? (
                    team
                      .filter((t) => t.role === "hod")
                      .map((hod) => (
                        <TableRow key={hod._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {hod._id}
                          </TableCell>
                          <TableCell>{hod.name}</TableCell>
                          <TableCell>{hod.department.name}</TableCell>
                          <TableCell>{hod.email}</TableCell>
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
                      <TableCell
                        colSpan={7}
                        className="h-32 text-center text-gray-500"
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
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {team.filter((t) => t.role === "hod").length} of{" "}
                {team.filter((t) => t.role === "hod").length} department heads
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-4 gap-6 p-6 mt-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium">Total Team Members</h3>
          <p className="text-3xl font-bold mt-2">
            {team.filter((t) => t.role === "pm").length +
              team.filter((t) => t.role === "hod").length}
          </p>
          <p className="text-sm text-gray-500 mt-2">Across all departments</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium">Total Departments</h3>
          <p className="text-3xl font-bold mt-2">
            {
              new Set(
                team
                  .filter((t) => t.role === "hod")
                  .map((hod) => hod.department)
              ).size
            }
          </p>
          <p className="text-sm text-gray-500 mt-2">Active departments</p>
        </div>
      </div>
    </div>
  );
};

export default Team;
