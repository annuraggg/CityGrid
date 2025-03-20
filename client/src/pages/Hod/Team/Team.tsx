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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Users, BriefcaseBusiness, Mail } from "lucide-react";

const Team = () => {
  const [newPMEmail, setNewPMEmail] = useState("");
  const [newHODEmail, setNewHODEmail] = useState("");
  const [pmAddOpen, setPMAddOpen] = useState(false);
  const [hodAddOpen, setHODAddOpen] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  // Sample data - replace with actual data from your API
  const projectManagers = [
    { id: 1, name: "John Doe", department: "IT", status: "active" },
    { id: 2, name: "Jane Doe", department: "HR", status: "active" },
    { id: 3, name: "Robert Smith", department: "Finance", status: "pending" },
  ];

  const hodMembers = [
    { id: 1, name: "John Doe", department: "IT", status: "active" },
    { id: 2, name: "Jane Doe", department: "HR", status: "active" },
    {
      id: 3,
      name: "Alice Johnson",
      department: "Marketing",
      status: "pending",
    },
  ];

  const addPM = async () => {
    axios
      .post("/invites/project-manager", { email: newPMEmail })
      .then(() => {
        toast.success("Project Manager invited successfully");
        setPMAddOpen(false);
        setNewPMEmail("");
      })
      .catch(() => {
        toast.error("Failed to invite Project Manager");
      });
  };

  const addHOD = async () => {
    axios
      .post("/invites/hod", { email: newHODEmail })
      .then(() => {
        toast.success("Head of Department invited successfully");
        setHODAddOpen(false);
        setNewHODEmail("");
      })
      .catch(() => {
        toast.error("Failed to invite Head of Department");
      });
  };

  // Function to render status badge
  const StatusBadge = ({ status }) => {
    if (status === "active") {
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    } else if (status === "pending") {
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600">
          Pending Invite
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-blue-600" size={28} />
            Team Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Manage your organization's team members, send invitations, and track
            statuses.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="project-managers" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="bg-slate-100">
            <TabsTrigger
              value="project-managers"
              className="data-[state=active]:bg-white"
            >
              Project Managers
            </TabsTrigger>
            <TabsTrigger value="hod" className="data-[state=active]:bg-white">
              Head of Departments
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8 w-64 bg-white"
              />
            </div>

            <TabsContent value="project-managers" className="mt-0">
              <Dialog open={pmAddOpen} onOpenChange={setPMAddOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Project Manager
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Add Project Manager
                    </DialogTitle>
                    <DialogDescription>
                      Please enter the email address of the Project Manager you
                      want to invite.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-6 w-full">
                      <Label htmlFor="pm-email" className="text-right w-64">
                        Email Address
                      </Label>
                      <div className="col-span-3 relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          id="pm-email"
                          value={newPMEmail}
                          onChange={(e) => setNewPMEmail(e.target.value)}
                          className="pl-8"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={addPM}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="hod" className="mt-0">
              <Dialog open={hodAddOpen} onOpenChange={setHODAddOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="mr-2 h-4 w-4" /> Add HOD
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Add Head of Department
                    </DialogTitle>
                    <DialogDescription>
                      Please enter the email address of the Head of Department
                      you want to invite.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-6 w-full">
                      <Label htmlFor="hod-email" className="text-right w-64">
                        Email Address
                      </Label>
                      <div className="col-span-3 relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          id="hod-email"
                          value={newHODEmail}
                          onChange={(e) => setNewHODEmail(e.target.value)}
                          className="pl-8"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={addHOD}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </div>
        </div>

        <TabsContent value="project-managers" className="mt-0">
          <Card className="shadow-md border-none">
            <CardHeader className="bg-blue-50 flex flex-row items-center justify-between p-4 border-b">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <BriefcaseBusiness className="text-blue-600" size={20} />
                Project Managers
              </CardTitle>
              <span className="text-sm text-slate-500 font-medium">
                {projectManagers.length} members
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectManagers.map((pm) => (
                    <TableRow key={pm.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{pm.id}</TableCell>
                      <TableCell>{pm.name}</TableCell>
                      <TableCell>{pm.department}</TableCell>
                      <TableCell>
                        <StatusBadge status={pm.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hod" className="mt-0">
          <Card className="shadow-md border-none">
            <CardHeader className="bg-blue-50 flex flex-row items-center justify-between p-4 border-b">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <BriefcaseBusiness className="text-blue-600" size={20} />
                Head of Departments
              </CardTitle>
              <span className="text-sm text-slate-500 font-medium">
                {hodMembers.length} members
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hodMembers.map((hod) => (
                    <TableRow key={hod.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{hod.id}</TableCell>
                      <TableCell>{hod.name}</TableCell>
                      <TableCell>{hod.department}</TableCell>
                      <TableCell>
                        <StatusBadge status={hod.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Team;
