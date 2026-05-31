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
import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, RotateCw, XCircle } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

const statusStyles = {
  Running: "text-[#FFC043] border-[#FFC043]/20 bg-[#FFC043]/5",
  Completed: "text-[#27C93F] border-[#27C93F]/20 bg-[#27C93F]/5",
  Scheduled: "text-[#1E2A3A] border-[#1E2A3A]/20 bg-[#1E2A3A]/5",
  Failed: "text-[#FF5F56] border-[#FF5F56]/20 bg-[#FF5F56]/5",
};

export default function TasksTable() {
  const [enrichmentJobs, setEnrichmentJobs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [ascending, setAscending] = useState(false);

  useEffect(() => {
    getEnrichmentJobs();
  }, []);

  const getEnrichmentJobs = async () => {
    try {
      const response = await axiosInstance.get(
        "/data-enrichment/enrichment-jobs-list",
      );
      setEnrichmentJobs(response.data.jobs);
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

  const filteredTasks = enrichmentJobs
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
          >
            <option value="all">all</option>
            <option value="Running">running</option>
            <option value="Completed">completed</option>
            <option value="Scheduled">scheduled</option>
            <option value="Failed">failed</option>
          </select>
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
                      no_jobs_found
                    </p>
                    <p className="text-xs font-mono text-[#687076]">
                      try changing the filter or create a new enrichment job
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
                      className={`inline-block px-2 py-1 text-xs font-mono border ${statusStyles[task.status]}`}
                    >
                      {task.status.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-mono text-[#687076]">
                    {new Date(task.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {task.status === "Failed" && (
                      <button className="px-3 py-1 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-1.5">
                        <RotateCw className="w-3 h-3" />
                        retry
                      </button>
                    )}
                    {task.status === "Running" && (
                      <button className="px-3 py-1 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-red-500 hover:text-red-500 transition-all duration-150 flex items-center gap-1.5">
                        <XCircle className="w-3 h-3" />
                        cancel
                      </button>
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
