"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import axiosInstance from "@/lib/axiosInstance";
import {
  Trash,
  Download,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";

const columnsMapping = {
  name: "person",
  email: "email",
  linkedin: "linkedin",
  phone: "phone",
  title: "designation",
  "organization.name": "company",
  "organization.industry": "industry",
  "organization.website_url": "website",
  "organization.estimated_num_employees": "employees",
};

function isUrl(value) {
  return typeof value === "string" && value.match(/^https?:\/\/[^\s]+$/i);
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
      const response = await axiosInstance.get(
        "/data-enrichment/enrichment-jobs-list",
      );
      setEnrichmentJobs(response.data.jobs);
    } catch (error) {
      console.error("Error fetching enrichment jobs:", error);
    }
  };

  const flattenData = (data) => {
    return data.map((item) => {
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
      const response = await axiosInstance.post(
        `/data-enrichment/enriched-data`,
        {
          page,
          limit: rowsPerPage,
          list: list,
        },
      );

      const { enrichedData, totalCount } = response.data;
      const flattenedData = flattenData(enrichedData);

      setEnrichedData(flattenedData);
      setTotalPages(Math.ceil(totalCount / rowsPerPage));

      if (flattenedData.length > 0) {
        const cols = Object.keys(flattenedData[0]).filter(
          (col) => columnsMapping[col],
        );
        setColumns(cols);
        setHeaders(cols.map((fc) => columnsMapping[fc]));
      } else {
        setColumns([]);
      }
    } catch (error) {
      console.error("Error fetching enriched data:", error);
    }
  };

  const handleDeleteList = async () => {
    if (!selectedList) return;

    const confirmDelete = window.confirm(
      "delete list? this action cannot be undone.",
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(
        `/data-enrichment/delete-enriched-data/${selectedList.id}`,
      );
      await getEnrichmentJobs();
      setSelectedList(null);
      setEnrichedData([]);
      setColumns([]);
    } catch (error) {
      console.error("Error deleting list:", error);
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

      const response = await axiosInstance.post(
        `/data-enrichment/enriched-data`,
        {
          page: 1,
          limit: limit,
          list: selectedList,
        },
      );

      const data = flattenData(response.data.enrichedData);
      if (data.length === 0) {
        alert("No data available for download.");
        return;
      }

      const csvHeaders = columns
        .map((col) => `"${columnsMapping[col] || col}"`)
        .join(",");
      const csvRows = data.map((row) =>
        columns
          .map((col) => `"${(row[col] || "").toString().replace(/"/g, '""')}"`)
          .join(","),
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
    <div className="w-full">
      {/* List Selection Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
          ENRICHED_DATA_VIEWER
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
              select_list()
            </label>
            <select
              onChange={(e) => handleListSelection(JSON.parse(e.target.value))}
              className="w-full max-w-sm px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
            >
              <option value="">choose_list</option>
              {enrichmentJobs.map((list) => (
                <option key={list.id} value={JSON.stringify(list)}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Display */}
      {selectedList && (
        <div className="border border-[#E6E8EA] bg-white">
          {/* Header Bar */}
          <div className="border-b border-[#E6E8EA] px-4 py-3 bg-[#F8F9FA]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-[#687076]" />
                <span className="text-xs font-mono text-[#687076]">
                  viewing: {selectedList.name}
                </span>
                <span className="text-[11px] font-mono text-[#687076] px-2 py-0.5 border border-[#E6E8EA]">
                  status:{" "}
                  {selectedList.status === "Completed"
                    ? "enriched"
                    : "in_progress"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Download Section */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="pages"
                    className="w-20 px-2 py-1.5 bg-white border border-[#E6E8EA] font-mono text-xs outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                    value={downloadPages}
                    onChange={(e) => setDownloadPages(e.target.value)}
                    min={1}
                    max={totalPages}
                  />
                  <button
                    onClick={handleDownloadCSV}
                    disabled={!downloadPages}
                    className="px-3 py-1.5 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-[#27C93F] hover:text-[#27C93F] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Download className="w-3 h-3" />
                    csv.export()
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={handleDeleteList}
                  className="p-1.5 text-[#687076] hover:text-[#FF5F56] transition-colors duration-150"
                  title="delete_list"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E6E8EA] bg-[#F8F9FA]">
                  {headers.map((col, idx) => (
                    <TableHead
                      key={idx}
                      className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider"
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrichedData.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className="border-b border-[#E6E8EA] hover:bg-[#F8F9FA] transition-colors duration-150"
                  >
                    {columns.map((col, colIdx) => (
                      <TableCell
                        key={colIdx}
                        className="px-4 py-3 text-sm font-mono text-[#11181C]"
                      >
                        {isUrl(row[col]) ? (
                          <a
                            href={row[col]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FFC043] hover:underline transition-colors duration-150"
                          >
                            {row[col]}
                          </a>
                        ) : (
                          row[col] || "—"
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#E6E8EA]">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-[#1E2A3A] hover:text-[#11181C] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                previous
              </button>
              <span className="text-xs font-mono text-[#687076]">
                page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-[#1E2A3A] hover:text-[#11181C] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedList && (
        <div className="border border-[#E6E8EA] bg-white p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <Database className="w-8 h-8 text-[#687076] opacity-50" />
            <p className="text-sm font-mono text-[#687076]">no_list_selected</p>
            <p className="text-xs font-mono text-[#687076]">
              select a list from the dropdown above
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
