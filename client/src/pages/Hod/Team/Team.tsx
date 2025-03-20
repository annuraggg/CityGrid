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
import { useAuth, useUser } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";

const Team = () => {
  const [newPMEmail, setNewPMEmail] = useState("");
  const [pmAddOpen, setPMAddOpen] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const addPM = async () => {
    axios
      .post("/invites/project-manager", { email: newPMEmail })
      .then(() => {
        toast.success("Project Manager invited successfully");
        setPMAddOpen(false);
      })
      .catch(() => {
        toast.error("Failed to invite Project Manager");
      });
  };

  return (
    <div className="p-5 w-full">
      <div className="flex gap-3">
        <Dialog open={pmAddOpen} onOpenChange={setPMAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Project Manager</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Project Manager</DialogTitle>
              <DialogDescription>
                Please enter the details of the Project Manager you want to add.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-6 w-full">
                <Label htmlFor="email" className="text-right w-64">
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={newPMEmail}
                  onChange={(e) => setNewPMEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={addPM}>
                Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button className="mb-5">Add HOD</Button>
      </div>

      <h2 className="text-2xl mb-5">Project Managers</h2>
      <Table>
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead>Project Manager ID</TableHead>
            <TableHead>Project Manager Name</TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>IT</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>Jane Doe</TableCell>
            <TableCell>HR</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className="text-2xl mb-5 mt-20">Head of Departments</h2>
      <Table>
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead>Project Manager ID</TableHead>
            <TableHead>Project Manager Name</TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>IT</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>Jane Doe</TableCell>
            <TableCell>HR</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Team;
