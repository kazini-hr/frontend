import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee, RoleKey } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/lib/constants";

export default function EmployeesTable({
  data,
  editButtonAction,
}: {
  data: Employee[];
  editButtonAction: (employee: Employee) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Role</TableHead>

          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((emp) => (
          <TableRow key={emp.id}>
            <TableCell>{emp.firstName + " " + emp.lastName}</TableCell>
            <TableCell>{emp.workEmail}</TableCell>
            <TableCell>{emp.internalEmployeeId}</TableCell>
            <TableCell>{emp.location?.name || "No location"}</TableCell>
            <TableCell>
              {emp.userProfile.roles
                .map((role: string) => ROLES[role as RoleKey])
                .join(", ") || "No role"}
            </TableCell>
            <TableCell>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => editButtonAction(emp)}
              >
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
