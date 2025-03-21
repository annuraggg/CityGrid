import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { 
  Search, 
  UserPlus, 
  Edit, 
  MoreHorizontal,
  Download,
  SlidersHorizontal,
  Users,
  Building,
  Mail,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCog,
  Plus,
  Trash2,
  MoreVertical,
  UserCircle,
  UserRoundPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ExtendedUser from "@/types/ExtendedUser";

const Team = () => {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("project-manager");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { getToken } = useAuth();
  const { user } = useUser();
  const axios = ax(getToken);

  const [team, setTeam] = useState<ExtendedUser[]>([]);

  useEffect(() => {
    fetchTeamMembers();
  }, [user]);

  const fetchTeamMembers = async () => {
    if (!user || !user.publicMetadata.department) return;
    
    setIsLoading(true);
    const dept = user.publicMetadata.department;
    
    try {
      const response = await axios.get("/users/team/" + dept);
      setTeam(response.data.data);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast.error("Failed to fetch team members");
    } finally {
      setIsLoading(false);
    }
  };

  const addTeamMember = async () => {
    if (!newMemberEmail) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      await axios.post(`/invites/${newMemberRole}`, { email: newMemberEmail });
      
      // Create notification for new team member
      await axios.post("/notifications", {
        recipient: "all",
        message: `New team member (${newMemberEmail}) has been invited as ${
          newMemberRole === "project-manager" ? "Project Manager" : "Head of Department"
        }.`,
        type: "system",
        title: "New Team Member Invited", 
        avatar: "TM"
      });
      
      toast.success(
        `${
          newMemberRole === "project-manager"
            ? "Project Manager"
            : "Head of Department"
        } invited successfully`
      );
      
      setDialogOpen(false);
      setNewMemberEmail("");
      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to invite team member:", error);
      toast.error(
        `Failed to invite ${
          newMemberRole === "project-manager"
            ? "Project Manager"
            : "Head of Department"
        }`
      );
    }
  };

  const filteredTeam = team.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (id: string): string => {
    const colors = [
      "bg-indigo-600",
      "bg-emerald-600",
      "bg-amber-600",
      "bg-rose-600",
      "bg-cyan-600",
      "bg-violet-600",
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Team Management</h1>
          <p className="text-slate-500">Manage department personnel and team members</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border-slate-200 bg-white p-0 overflow-hidden">
            <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <DialogTitle className="text-xl font-semibold text-slate-900 flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-indigo-600" />
                Add Team Member
              </DialogTitle>
              <DialogDescription className="text-slate-500 mt-1">
                Invite a new team member by entering their email address.
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-700 font-medium">
                    Role
                  </Label>
                  <Select
                    value={newMemberRole}
                    onValueChange={setNewMemberRole}
                  >
                    <SelectTrigger id="role" className="border-slate-200 focus:border-indigo-500 h-10">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-200">
                      <SelectItem value="project-manager" className="text-slate-700">
                        Project Manager
                      </SelectItem>
                      <SelectItem value="hod" className="text-slate-700">
                        Head of Department
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">
                    {newMemberRole === "project-manager"
                      ? "Project Managers can create and manage projects in their department."
                      : "Heads of Department have full access to manage their department and team."}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address <span className="text-rose-600">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@company.com"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="border-slate-200 focus:border-indigo-500 h-10"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="text-slate-700 border-slate-200 hover:bg-slate-50 h-10 px-4 text-sm font-medium"
              >
                Cancel
              </Button>
              <Button 
                onClick={addTeamMember}
                className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
              >
                <UserRoundPlus className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary statistics cards - moved from bottom to top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Active
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Team Members</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {team.filter((t) => t.role === "pm").length +
                  team.filter((t) => t.role === "hod").length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Across all departments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-amber-600" />
              </div>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                Management
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Departments</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {
                  new Set(
                    team
                      .filter((t) => t.role === "hod")
                      .map((hod) => hod.department?._id)
                  ).size
                }
              </h3>
              <p className="text-xs text-slate-500 mt-1">Active departments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center">
                <UserCog className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                Operations
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Project Managers</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {team.filter((t) => t.role === "pm").length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Managing projects</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-rose-50 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-rose-600" />
              </div>
              <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                Leadership
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Department Heads</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {team.filter((t) => t.role === "hod").length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Leading departments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm mb-6">
        <CardContent className="">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              />
              <Input
                placeholder="Search by name, department, or email..."
                className="pl-10 border-slate-200 focus:border-indigo-500 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 self-end">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-sm font-medium"
              >
                <Download className="h-4 w-4 mr-2 text-slate-500" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-sm font-medium"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2 text-slate-500" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
        <Tabs defaultValue="project-managers" className="w-full">
          <TabsList className="bg-slate-50 border-b border-slate-200 h-12 p-0 w-full rounded-t-md rounded-b-none flex">
            <TabsTrigger
              value="project-managers"
              className="flex-1 flex items-center justify-center gap-2 h-full rounded-none border-r border-slate-200 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            >
              <UserCog className="h-4 w-4" />
              <span className="font-medium">Project Managers</span>
              <Badge 
                variant="secondary" 
                className="ml-1 bg-indigo-100 text-indigo-700 border-none"
              >
                {filteredTeam.filter((t) => t.role === "pm").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="hods"
              className="flex-1 flex items-center justify-center gap-2 h-full rounded-none data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            >
              <Shield className="h-4 w-4" />
              <span className="font-medium">Department Heads</span>
              <Badge 
                variant="secondary" 
                className="ml-1 bg-indigo-100 text-indigo-700 border-none"
              >
                {filteredTeam.filter((t) => t.role === "hod").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project-managers" className="pt-4">
            {isLoading ? (
              <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 border-r-2 border-slate-300 mx-auto mb-4"></div>
                <p className="text-slate-500">Loading team members...</p>
              </div>
            ) : filteredTeam.filter((t) => t.role === "pm").length > 0 ? (
              <div className="rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                      <TableRow>
                        <TableHead className="w-[250px] text-slate-700 font-medium">Team Member</TableHead>
                        <TableHead className="text-slate-700 font-medium">Department</TableHead>
                        <TableHead className="text-slate-700 font-medium">Email</TableHead>
                        <TableHead className="text-right w-20 text-slate-700 font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeam
                        .filter((t) => t.role === "pm")
                        .map((pm) => (
                          <TableRow key={pm._id} className="group hover:bg-slate-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div 
                                  className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(pm._id)}`}
                                >
                                  {getInitials(pm.name)}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">
                                    {pm.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    ID: {pm._id.substring(0, 8)}...
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1 w-fit"
                              >
                                <Building className="h-3 w-3 text-slate-500" />
                                {pm.department?.name || "Not assigned"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-slate-500" />
                                <span className="text-slate-600">{pm.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-slate-600 hover:bg-slate-100"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="border-slate-200">
                                  <DropdownMenuLabel className="text-slate-700">Actions</DropdownMenuLabel>
                                  <DropdownMenuItem className="text-slate-700 hover:text-indigo-600 cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2 text-slate-500" /> Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-slate-700 hover:text-indigo-600 cursor-pointer">
                                    <UserCircle className="h-4 w-4 mr-2 text-slate-500" /> View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-slate-100" />
                                  <DropdownMenuItem className="text-rose-600 hover:text-rose-700 cursor-pointer">
                                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="py-3 px-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    Showing {filteredTeam.filter((t) => t.role === "pm").length} of{" "}
                    {team.filter((t) => t.role === "pm").length} project managers
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-sm font-medium"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-sm font-medium"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCog className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-700 font-medium mb-1">No project managers found</p>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? "No project managers match your search criteria"
                    : "You haven't added any project managers to your team yet"}
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Project Manager
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hods" className="p-0">
            {isLoading ? (
              <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 border-r-2 border-slate-300 mx-auto mb-4"></div>
                <p className="text-slate-500">Loading team members...</p>
              </div>
            ) : filteredTeam.filter((t) => t.role === "hod").length > 0 ? (
              <div className="rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                      <TableRow>
                        <TableHead className="w-[250px] text-slate-700 font-medium">Team Member</TableHead>
                        <TableHead className="text-slate-700 font-medium">Department</TableHead>
                        <TableHead className="text-slate-700 font-medium">Email</TableHead>
                        <TableHead className="text-right w-20 text-slate-700 font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeam
                        .filter((t) => t.role === "hod")
                        .map((hod) => (
                          <TableRow key={hod._id} className="group hover:bg-slate-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div 
                                  className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(hod._id)}`}
                                >
                                  {getInitials(hod.name)}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">
                                    {hod.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    ID: {hod._id.substring(0, 8)}...
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1 w-fit"
                              >
                                <Building className="h-3 w-3 text-slate-500" />
                                {hod.department?.name || "Not assigned"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-slate-500" />
                                <span className="text-slate-600">{hod.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-slate-600 hover:bg-slate-100"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="border-slate-200">
                                  <DropdownMenuLabel className="text-slate-700">Actions</DropdownMenuLabel>
                                  <DropdownMenuItem className="text-slate-700 hover:text-indigo-600 cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2 text-slate-500" /> Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-slate-700 hover:text-indigo-600 cursor-pointer">
                                    <UserCircle className="h-4 w-4 mr-2 text-slate-500" /> View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-slate-100" />
                                  <DropdownMenuItem className="text-rose-600 hover:text-rose-700 cursor-pointer">
                                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="py-3 px-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    Showing {filteredTeam.filter((t) => t.role === "hod").length} of{" "}
                    {team.filter((t) => t.role === "hod").length} department heads
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-sm font-medium"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-sm font-medium"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-700 font-medium mb-1">No department heads found</p>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? "No department heads match your search criteria"
                    : "You haven't added any department heads to your team yet"}
                </p>
                <Button
                  onClick={() => {
                    setNewMemberRole("hod");
                    setDialogOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 text-sm font-medium"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Department Head
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Team;
