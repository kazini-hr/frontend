import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompanyLocation } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function CompanyLocationsTable({
  data,
  editButtonAction,
}: {
  data: CompanyLocation[];
  editButtonAction: (location: CompanyLocation) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((location) => (
          <TableRow key={location.id}>
            <TableCell>{location.name}</TableCell>
            <TableCell>{location.description || "No description"}</TableCell>
            <TableCell>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => editButtonAction(location)}
              >
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
