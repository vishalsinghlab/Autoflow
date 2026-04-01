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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";



const statusColor = {
  Running: "bg-yellow-200 text-yellow-800",
  Completed: "bg-green-200 text-green-800",
  Scheduled: "bg-blue-200 text-blue-800",
  Failed: "bg-red-200 text-red-800",
};

export default function TasksTable() {
  const [enrichmentJobs,setEnrichmentJobs]=useState([])
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [ascending, setAscending] = useState(false);

  useEffect(()=>{
    getEnrichmentJobs()
  },[])

  const getEnrichmentJobs=async()=>{
    try{
      const response = await axiosInstance.get(
        "/data-enrichment/enrichment-jobs-list",
      );

      // console.log("response",response.data);

      setEnrichmentJobs(response.data.jobs);
    }catch(error){
      console.log("Error",error)
    }
  }

  const toggleSort = (column) => {
    if (sortBy === column) {
      setAscending(!ascending);
    } else {
      setSortBy(column);
      setAscending(true);
    }
  };

  const filteredTasks = enrichmentJobs
    .filter((task) => filterStatus === "All" || task.status === filterStatus)
    .sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (typeof valA === "string" && typeof valB === "string") {
        return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });

  return (
    <div className="rounded-xl border border-purple-100 shadow bg-white overflow-x-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-purple-700">Filter by status:</span>
        <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val)}>
          <SelectTrigger className="w-[200px] border-purple-200 bg-white text-purple-700">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Running">Running</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-purple-50 text-purple-800">
            <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
              Task Name {sortBy === "name" && (ascending ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
              Status {sortBy === "status" && (ascending ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort("createdAt")}>
              Created At {sortBy === "createdAt" && (ascending ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium text-purple-900">{task.name}</TableCell>
              <TableCell className="text-purple-700">{task.source}</TableCell>
              <TableCell>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[task.status]}`}>
                  {task.status}
                </span>
              </TableCell>
              <TableCell className="text-purple-600 text-sm">{new Date(task.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {task.status === "Failed" ? (
                  <Button variant="outline" size="sm" className="text-purple-700 border-purple-300">
                    Retry
                  </Button>
                ) : task.status === "Running" ? (
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
