"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, RotateCw, XCircle } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useSelector } from "react-redux";

const statusStyles = {
  Running: "bg-[#FFC043]/10 text-[#FFC043] border border-[#FFC043]/20",
  Completed: "bg-[#27C93F]/10 text-[#27C93F] border border-[#27C93F]/20",
  Scheduled: "bg-[#1E2A3A]/10 text-[#1E2A3A] border border-[#1E2A3A]/20",
  Failed: "bg-[#FF5F56]/10 text-[#FF5F56] border border-[#FF5F56]/20",
};

export default function TasksTable() {
  const [extractionJobs, setExtractionJobs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [ascending, setAscending] = useState(false);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  useEffect(() => {
    getExtractionJobs();
  }, [selectedUser]);

  const getExtractionJobs = async () => {
    try {
      const response = await axiosInstance.get(
        "/data-source/extraction-jobs-list",
      );
      setExtractionJobs(response.data.jobs);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const toggleSort = (column) => {
    if (sortBy === column) {
      setAscending(!ascending);
    } else {
      setSortBy(column);
      setAscending(true);
    }
  };

  const filteredTasks = extractionJobs
    .filter((task) => filterStatus === "all" || task.status === filterStatus)
    .sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (typeof valA === "string" && typeof valB === "string") {
        return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (sortBy === "createdAt") {
        return ascending
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }
      return 0;
    });

  const SortIcon = ({ column }) => {
    if (sortBy !== column)
      return <ChevronUp className="w-3.5 h-3.5 opacity-30" />;
    return ascending ? (
      <ChevronUp className="w-3.5 h-3.5" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5" />
    );
  };

  return (
    <div className="w-full">
      {/* Filter Bar */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#687076] uppercase tracking-wider">
            filter_by:
          </span>
          <Select
            value={filterStatus}
            onValueChange={(val) => setFilterStatus(val)}
          >
            <SelectTrigger className="w-[140px] px-3 py-1.5 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]">
              <SelectValue placeholder="all" />
            </SelectTrigger>
            <SelectContent className="border border-[#E6E8EA] rounded-none">
              <SelectItem value="all" className="font-mono text-sm">
                all
              </SelectItem>
              <SelectItem value="Running" className="font-mono text-sm">
                running
              </SelectItem>
              <SelectItem value="Completed" className="font-mono text-sm">
                completed
              </SelectItem>
              <SelectItem value="Scheduled" className="font-mono text-sm">
                scheduled
              </SelectItem>
              <SelectItem value="Failed" className="font-mono text-sm">
                failed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs font-mono text-[#687076]">
          {filteredTasks.length} job{filteredTasks.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="border border-[#E6E8EA] bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E6E8EA] bg-[#F8F9FA]">
              <TableHead
                className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider cursor-pointer hover:text-[#11181C] transition-colors duration-150"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center gap-1.5">
                  task_name
                  <SortIcon column="name" />
                </div>
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                source
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider cursor-pointer hover:text-[#11181C] transition-colors duration-150"
                onClick={() => toggleSort("status")}
              >
                <div className="flex items-center gap-1.5">
                  status
                  <SortIcon column="status" />
                </div>
              </TableHead>
              <TableHead
                className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider cursor-pointer hover:text-[#11181C] transition-colors duration-150"
                onClick={() => toggleSort("createdAt")}
              >
                <div className="flex items-center gap-1.5">
                  created_at
                  <SortIcon column="createdAt" />
                </div>
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-mono text-[#687076]">
                      no jobs found
                    </p>
                    <p className="text-xs font-mono text-[#687076]">
                      try changing the filter or create a new extraction
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="border-b border-[#E6E8EA] hover:bg-[#F8F9FA] transition-colors duration-150"
                >
                  <TableCell className="px-4 py-3 text-sm font-mono text-[#11181C]">
                    {task.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono text-[#687076]">
                    {task.source}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-mono rounded-sm ${statusStyles[task.status]}`}
                    >
                      {task.status.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono text-[#687076]">
                    {new Date(task.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {task.status === "Failed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 py-1 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-[#FFC043] hover:text-[#11181C] transition-all duration-150"
                      >
                        <RotateCw className="w-3 h-3 mr-1.5" />
                        retry
                      </Button>
                    )}
                    {task.status === "Running" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 py-1 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-red-500 hover:text-red-500 transition-all duration-150"
                      >
                        <XCircle className="w-3 h-3 mr-1.5" />
                        cancel
                      </Button>
                    )}
                    {task.status !== "Failed" && task.status !== "Running" && (
                      <span className="text-xs font-mono text-[#687076]">
                        —
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
