"use client";

import FullLayout from "@/components/layout/full-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEmployees, useTimesheets } from "@/lib/api-hooks";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { Timesheet } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { dateFormatter } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCompanyLocations } from "@/lib/api-hooks";

import {
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  Pagination,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TimesheetsFilters from "./filters";
import TimesheetCreateForm from "@/components/forms/timesheet-create-form";
import TimesheetUpdateForm from "@/components/forms/timesheet-update-form";
import { TimesheetDetails } from "./details";

interface DateFilter {
  startDate: string;
  endDate: string;
  locationId?: string;
  employeeId?: string;
  activeShift?: boolean;
}

export default function Timesheets() {
  const { user: userData } = useAuth();
  const user = userData?.user;
  const company = userData?.company;

  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);

  const { getEmployees } = useEmployees(company?.id ?? "");
  const { data: companyEmployees, isPending: isEmployeesPending } =
    getEmployees;

  const { getCompanyLocations } = useCompanyLocations(company?.id ?? "");
  const { data: companyLocations, isPending: isLocationsPending } =
    getCompanyLocations;

  const { getTimesheets } = useTimesheets(company?.id || "");
  const [filters, setFilters] = useState<DateFilter>({
    startDate: "",
    endDate: "",
  });
  const {
    data: timesheetsData,
    refetch: refetchTimesheets,
    isFetching: isTimesheetsFetching,
  } = getTimesheets({
    pagination: { page: currentPage },
    filters,
  });

  const updateFilters = useCallback((patch: Partial<DateFilter>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
    });
  }, []);

  useEffect(() => {
    if (company?.id) refetchTimesheets();
  }, [company?.id, currentPage, filters]);

  const handlePageChange = (value: number | string) => {
    const page = parseInt(value.toString());
    if (isNaN(page) || page < 1) return setCurrentPage(1);
    if (page > timesheetsData?.total_pages || !timesheetsData?.total_pages)
      return setCurrentPage(timesheetsData?.total_pages ?? 1);
    setCurrentPage(page);
  };

  const handleClockIn = () => {
    setShowUpdateForm(false);
    setShowDetails(false);
    setTimesheet(null);
    setShowForm(true);
  };

  const handleClockOut = () => {
    setShowDetails(false);
    setShowForm(false);
    setTimesheet(null);
    setShowUpdateForm(true);
  };

  const handleShowDetails = (timesheet: Timesheet) => {
    setShowForm(false);
    setShowUpdateForm(false);
    setShowDetails(true);
    setTimesheet(timesheet);
  };

  const handleClose = () => {
    setShowForm(false);
    setShowUpdateForm(false);
    setShowDetails(false);
    setTimesheet(null);
  };

  const isLoading =
    isEmployeesPending || isLocationsPending || isTimesheetsFetching;

  return (
    <FullLayout
      title="Timesheets"
      description="Manage your employee timesheets"
    >
      <Dialog open={showForm} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timesheet (Clock In)</DialogTitle>
          </DialogHeader>

          <TimesheetCreateForm
            closeForm={handleClose}
            locations={companyLocations || []}
            employees={companyEmployees || []}
            refetch={refetchTimesheets}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showUpdateForm} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timesheet (Clock Out)</DialogTitle>
          </DialogHeader>

          <TimesheetUpdateForm
            closeForm={handleClose}
            locations={companyLocations || []}
            employees={companyEmployees || []}
            refetch={refetchTimesheets}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDetails} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timesheet</DialogTitle>
          </DialogHeader>

          <TimesheetDetails closeForm={handleClose} timesheet={timesheet} />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Timesheets</CardTitle>
          {!user?.roles.includes("EMPLOYEE") && (
            <div className="flex gap-4">
              <Button onClick={handleClockIn}>Clock In Employees</Button>

              <Button onClick={handleClockOut} variant="outline">
                Clock Out Employees
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <TimesheetsFilters
            locations={companyLocations || []}
            employees={companyEmployees || []}
            setFilters={updateFilters}
          />

          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : !timesheetsData?.items.length ? (
            <div className="flex items-center justify-center font">
              No Entries
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Time Out</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesheetsData?.items?.map((timesheet: Timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell>
                      {timesheet.employee.firstName +
                        " " +
                        timesheet.employee.lastName}
                    </TableCell>
                    <TableCell>
                      {timesheet.employee.internalEmployeeId}
                    </TableCell>
                    <TableCell>{timesheet.companyLocation.name}</TableCell>
                    <TableCell>
                      {dateFormatter.format(new Date(timesheet.timeIn))}
                    </TableCell>
                    <TableCell>
                      {timesheet.timeOut
                        ? dateFormatter.format(new Date(timesheet.timeOut))
                        : "Active Shift"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleShowDetails(timesheet)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center my-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem className="cursor-pointer">
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>
                <PaginationItem className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={currentPage}
                    onChange={(e) => handlePageChange(e.target.value)}
                    className="w-24"
                  />{" "}
                  of {timesheetsData?.total_pages ?? 1}
                </PaginationItem>

                <PaginationItem className="cursor-pointer">
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </FullLayout>
  );
}
