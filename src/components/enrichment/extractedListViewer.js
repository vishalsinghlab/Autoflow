"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const columnsMapping = {
  "name": "Person",
  "email": "Email",
  "linkedin": "Linkdin",
  "phone": "Phone",
  "title": "Designation",
  "organization.name": "Company",
  "organization.industry": "Industry",
  "organization.website_url": "Website",
  "organization.estimated_num_employees": "Employees Strength"
}

export default function ExtractedListViewer() {
  const [enrichmentJobs, setEnrichmentJobs] = useState([]);
  const [enrichedData, setEnrichedData] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [columns, setColumns] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [downloadPages, setDownloadPages] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getEnrichmentJobs();
  }, []);

  useEffect(() => {
    if (selectedList) {
      fetchData(selectedList, currentPage);
    }
  }, [selectedList, currentPage]);

  const getEnrichmentJobs = async () => {
    try {
      const response = await axiosInstance.get('/data-enrichment/enrichment-jobs-list');
      setEnrichmentJobs(response.data.jobs);
    } catch (error) {
      console.error("Error fetching enrichment jobs:", error);
    }
  };

  const flattenData = (data) => {
    return data.map(item => {
      const flattened = { ...item };
      if (item.organization) {
        Object.entries(item.organization).forEach(([key, value]) => {
          flattened[`organization.${key}`] = value;
        });
        delete flattened.organization;
      }
      return flattened;
    });
  };

  const fetchData = async (list, page) => {
    try {
      const response = await axiosInstance.post(`/data-enrichment/enriched-data`, {
        page,
        limit: rowsPerPage,
        list: list,
      });

      const { enrichedData, totalCount } = response.data;
      const flattenedData = flattenData(enrichedData);

      setEnrichedData(flattenedData);
      setTotalPages(Math.ceil(totalCount / rowsPerPage));

      if (flattenedData.length > 0) {
        const columns = Object.keys(flattenedData[0]).filter(col => columnsMapping[col]);
        // console.log("columns", columns)
        setColumns(columns);
        setHeaders(columns.map(fc => columnsMapping[fc]))
      } else {
        setColumns([]);
      }
    } catch (error) {
      console.error("Error fetching enriched data:", error);
    }
  };


  const handleDeleteList = async () => {
    if (!selectedList) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this list?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/data-enrichment/delete-enriched-data/${selectedList.id}`);
      await getEnrichmentJobs();
      setSelectedList(null);
      setEnrichedData([]);
      setColumns([]);
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Failed to delete the list.");
    }
  };

  const handleListSelection = (list) => {
    setSelectedList(list);
    setCurrentPage(1);
  };

  const handleDownloadCSV = async () => {
    if (!selectedList || !downloadPages || isNaN(downloadPages)) return;
    try {
      const pagesToDownload = parseInt(downloadPages);
      const limit = pagesToDownload * rowsPerPage;

      const response = await axiosInstance.post(`/data-enrichment/enriched-data`, {
        page: 1,
        limit: limit, // effectively fetch all rows
        list: selectedList,
      });

      const data = flattenData(response.data.enrichedData);
      if (data.length === 0) {
        alert("No data available for download.");
        return;
      }

      const csvHeaders = columns.map(col => `"${columnsMapping[col] || col}"`).join(",");
      const csvRows = data.map(row =>
        columns.map(col => `"${(row[col] || "").toString().replace(/"/g, '""')}"`).join(",")
      );
      const csvContent = [csvHeaders, ...csvRows].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.setAttribute("href", url);
      link.setAttribute("download", `${selectedList.name}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("Failed to download CSV.");
    }
  };



  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-purple-800 mb-2">Select a List</h3>
        <Select onValueChange={(value) => handleListSelection(JSON.parse(value))}>
          <SelectTrigger className="w-[250px] bg-white border-purple-200 text-purple-700">
            <SelectValue placeholder="Choose a list" />
          </SelectTrigger>
          <SelectContent>
            {enrichmentJobs.map((list) => (
              <SelectItem key={list.id} value={JSON.stringify(list)}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedList && (
        <div className="overflow-auto border border-purple-100 rounded-lg overflow-visible">
          <div className="flex justify-between items-center mb-4 px-2 space-x-2">
            <h4 className="text-md font-semibold text-purple-700">
              Viewing: {selectedList.name}
            </h4>
            <h4 className="text-md font-semibold text-purple-700">
              Status: {selectedList.status === "Completed" ? "Enriched" : "In-progress"}
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 bg-gray-50 rounded-xl">
              {/* Download CSV section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <label className="text-sm font-medium text-gray-700">Download Pages</label>
                <input
                  type="number"
                  placeholder="e.g. 3"
                  className="border border-purple-300 focus:ring-purple-500 focus:border-purple-500 rounded-lg px-3 py-1.5 text-sm w-[160px] transition-all"
                  value={downloadPages}
                  onChange={(e) => setDownloadPages(e.target.value)}
                  min={1}
                  max={totalPages}
                />
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2"
                  onClick={handleDownloadCSV}
                  disabled={!downloadPages}
                >
                  Download CSV
                </Button>
              </div>

              <div className="relative group cursor-pointer text-red-600 hover:text-red-800 transition w-fit">
                <Trash onClick={handleDeleteList} />

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none z-20">
                  Delete List
                </div>
              </div>


            </div>

          </div>


          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100 text-purple-800">
                {headers.map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedData.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-purple-50">
                  {columns.map((col) => (
                    <TableCell key={col}>
                      {isUrl(row[col]) ? (
                        <a
                          href={row[col]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 underline hover:text-purple-800 transition"
                        >
                          {row[col]}
                        </a>
                      ) : (
                        row[col]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-4 py-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-purple-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}


function isUrl(value) {
  return typeof value === "string" && value.match(/^https?:\/\/[^\s]+$/i);
}
