"use client";

import PageViewLayout from "@/components/layout/page-view-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useTimesheetOperations } from "@/lib/api-hooks";

interface DateFilter {
  startDate: string;
  endDate: string;
}

// TODO: add pagination
// change query to mutation
// Add no data found display
export default function TimesheetsPage() {
  const { getTimesheets } = useTimesheetOperations();
  const { toast } = useToast();
  const today = new Date().toISOString().split("T")[0];
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: "",
    endDate: "",
  });

  const handleDateChange = useCallback(
    (field: keyof DateFilter, value: string) => {
      setDateFilter((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const setFilters = () => {
    const filters: any = {};
    if (dateFilter.startDate && dateFilter.endDate) {
      if (dateFilter.startDate > dateFilter.endDate) {
        toast({
          title: "Invalid Date Range",
          description: "End date cannot be before start date.",
          variant: "destructive",
        });
        throw new Error("Invalid Date Range");
      }

      filters.startDate = dateFilter.startDate;
      filters.endDate = dateFilter.endDate;
    }

    return {
      pagination: {},
      filters,
    };
  };

  const {
    data: timesheetsData,
    isPending,
    error,
    refetch,
  } = getTimesheets(setFilters());

  const handleClearFilters = useCallback(() => {
    setDateFilter({ startDate: "", endDate: "" });
    refetch();
  }, []);

  useEffect(() => {
    if (error)
      toast({
        title: "Error",
        description: "Failed to fetch timesheets.",
        variant: "destructive",
      });
  }, [error]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <PageViewLayout
      title="Timesheets"
      description="Track work hours and manage time entries"
    >
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Date Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="start-date" className="text-xs">
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateFilter.startDate}
                  max={today}
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="end-date" className="text-xs">
                  End Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateFilter.endDate}
                  max={today}
                  min={dateFilter.startDate || undefined}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <Button
                onClick={() => refetch()}
                className="flex-1 sm:flex-none"
                disabled={isPending}
              >
                <Search className="h-4 w-4 mr-2" />
                {isPending ? "Searching..." : "Search"}
              </Button>

              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex-1 sm:flex-none"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {JSON.stringify(timesheetsData)}
      {JSON.stringify(isPending)}
      {error && <p>Error: {JSON.stringify(error)}</p>}

      {isPending && (
        <Card>
          <CardHeader>
            <CardTitle>Timesheets</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      )}

      {!isPending && (
        <Card>
          <CardHeader>
            <CardTitle>Timesheets</CardTitle>
          </CardHeader>
          <CardContent>
            {timesheetsData?.items?.length === 0 ? (
              <p>No timesheets found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>

                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheetsData?.items?.map((timesheet: any) => (
                    <TableRow key={timesheet.id}>
                      <TableCell>
                        {timesheet.employee.firstName +
                          " " +
                          timesheet.employee.lastName}
                      </TableCell>
                      <TableCell>{timesheet.companyLocation.name}</TableCell>
                      <TableCell>{timesheet.timeIn}</TableCell>
                      <TableCell>
                        {timesheet.timeOut ?? "Active Shift"}
                      </TableCell>
                      <TableCell>
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </PageViewLayout>
  );
}
