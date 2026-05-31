"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Trash2, Database } from "lucide-react";

export default function ExtractedListViewer() {
  const [extractionJobs, setExtractionJobs] = useState([]);
  const [extractedData, setExtractedData] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [columns, setColumns] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [source, setSource] = useState("");
  const selectedUser = useSelector((state) => state.user.selectedUser);

  useEffect(() => {
    getExtractionJobs();
  }, [selectedUser]);

  useEffect(() => {
    if (selectedList) {
      fetchData(selectedList, currentPage);
    }
  }, [selectedList, currentPage, selectedUser]);

  const getExtractionJobs = async () => {
    try {
      const response = await axiosInstance.get(
        "/data-source/extraction-jobs-list",
      );
      const jobs = response.data.jobs || [];
      setExtractionJobs(jobs);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    }
  };

  const fetchData = async (list, page) => {
    try {
      const response = await axiosInstance.post(
        `/data-source/extraction-data`,
        {
          page,
          limit: rowsPerPage,
          list: list,
        },
      );

      const { extractedData, totalCount, source } = response.data;
      setExtractedData(extractedData);
      setTotalPages(Math.ceil(totalCount / rowsPerPage));

      if (extractedData.length > 0) {
        setColumns(Object.keys(extractedData[0]));
      } else {
        setColumns([]);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
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
        `/data-source/delete-extraction-data/${selectedList.id}`,
      );
      await getExtractionJobs();
      setSelectedList(null);
      setExtractedData([]);
      setColumns([]);
    } catch (error) {
      console.log("Error deleting list:", error);
    }
  };

  const handleListSelection = (list) => {
    setSelectedList(list);
    setCurrentPage(1);
    setSource(list.source);
    setExtractedData([]);
    setColumns([]);
    setTotalPages(1);
  };

  return (
    <div className="w-full">
      {/* List Selection Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
          DATA VIEWER
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
              select_list()
            </label>
            <Select onValueChange={(value) => handleListSelection(value)}>
              <SelectTrigger className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]">
                <SelectValue placeholder="choose extraction list" />
              </SelectTrigger>
              <SelectContent className="border border-[#E6E8EA] rounded-none">
                {extractionJobs.map((list) => (
                  <SelectItem
                    key={list.id}
                    value={list}
                    className="font-mono text-sm focus:bg-[#F8F9FA] focus:text-[#11181C]"
                  >
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedList && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteList}
              className="px-3 py-2 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-red-500 hover:text-red-500 transition-all duration-150"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              delete()
            </Button>
          )}
        </div>
      </div>

      {/* Data Display */}
      {selectedList && (
        <div className="border border-[#E6E8EA] bg-white">
          {/* Header Bar */}
          <div className="border-b border-[#E6E8EA] px-4 py-3 bg-[#F8F9FA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#687076]" />
              <span className="text-xs font-mono text-[#687076]">
                viewing:{" "}
                {extractionJobs.find((job) => job.id === selectedList)?.name}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#687076]">
              {extractedData.length} rows
            </div>
          </div>

          {/* Table View (non-Google Sheet) */}
          {source !== "googleSheet" && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#E6E8EA] bg-[#F8F9FA]">
                      {columns.map((col) => (
                        <TableHead
                          key={col}
                          className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider"
                        >
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extractedData.map((row, idx) => (
                      <TableRow
                        key={idx}
                        className="border-b border-[#E6E8EA] hover:bg-[#F8F9FA] transition-colors duration-150"
                      >
                        {columns.map((col) => (
                          <TableCell
                            key={col}
                            className="px-4 py-3 text-sm font-mono text-[#11181C]"
                          >
                            {Array.isArray(row[col])
                              ? row[col]
                                  .map((f) => `${f.name} (${f.title})`)
                                  .join(", ")
                              : typeof row[col] === "object" &&
                                  row[col] !== null
                                ? Object.entries(row[col])
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(", ")
                                : row[col]}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-[#1E2A3A] hover:text-[#11181C] disabled:opacity-50"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                    previous
                  </Button>
                  <span className="text-xs font-mono text-[#687076]">
                    page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-[#1E2A3A] hover:text-[#11181C] disabled:opacity-50"
                  >
                    next
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Google Sheet View */}
          {source === "googleSheet" && (
            <SheetDataViewer
              selectedList={selectedList}
              sheetDataList={extractedData}
            />
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedList && (
        <div className="border border-[#E6E8EA] bg-white p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <Database className="w-8 h-8 text-[#687076] opacity-50" />
            <p className="text-sm font-mono text-[#687076]">no list selected</p>
            <p className="text-xs font-mono text-[#687076]">
              select a data source from the dropdown above
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Sheet Data Viewer Component
function SheetDataViewer({ selectedList, sheetDataList }) {
  const [currentPages, setCurrentPages] = useState({});
  const [sheetRows, setSheetRows] = useState({});
  const [loading, setLoading] = useState({});
  const [totalPagesMap, setTotalPagesMap] = useState({});

  const rowsPerPage = 10;

  const fetchSheetPage = async (sheetId, sheetName, page) => {
    setLoading((prev) => ({ ...prev, [sheetName]: true }));

    try {
      const response = await axiosInstance.post(
        `/data-source/extraction-data`,
        {
          sheetId,
          sheetName,
          page,
          limit: rowsPerPage,
          list: selectedList,
        },
      );

      const { extractedData, totalCount, currentPage, totalPages } =
        response.data;

      setSheetRows((prev) => ({
        ...prev,
        [sheetName]: extractedData,
      }));

      setTotalPagesMap((prev) => ({
        ...prev,
        [sheetName]: totalPages,
      }));

      setCurrentPages((prev) => ({
        ...prev,
        [sheetName]: currentPage,
      }));
    } catch (err) {
      console.error("Error fetching sheet data:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [sheetName]: false }));
    }
  };

  useEffect(() => {
    if (sheetDataList.length > 0) {
      sheetDataList.forEach((sheet) => {
        if (!sheetRows[sheet.sheetName]) {
          fetchSheetPage(sheet.sheetId, sheet.sheetName, 1);
        }
      });
    }
  }, [sheetDataList, selectedList]);

  const handleTabChange = (sheet) => {
    if (!sheetRows[sheet.sheetName]) {
      fetchSheetPage(sheet.sheetId, sheet.sheetName, 1);
    }
  };

  const handlePageChange = (sheet, direction) => {
    const currentPage = currentPages[sheet.sheetName] || 1;
    const totalPages = totalPagesMap[sheet.sheetName] || 1;

    const nextPage =
      direction === "prev"
        ? Math.max(1, currentPage - 1)
        : Math.min(totalPages, currentPage + 1);

    fetchSheetPage(sheet.sheetId, sheet.sheetName, nextPage);
  };

  return (
    <Tabs
      defaultValue={sheetDataList[0]?.sheetName}
      onValueChange={(val) => {
        const selectedSheet = sheetDataList.find((s) => s.sheetName === val);
        if (selectedSheet) handleTabChange(selectedSheet);
      }}
    >
      <TabsList className="inline-flex h-auto gap-0 bg-transparent border-b border-[#E6E8EA] rounded-none w-full justify-start p-0">
        {sheetDataList.map((sheet) => (
          <TabsTrigger
            key={sheet.sheetName}
            value={sheet.sheetName}
            className="
              px-4 py-2 text-xs font-mono text-[#687076] 
              data-[state=active]:text-[#11181C] data-[state=active]:border-b-2 data-[state=active]:border-[#FFC043]
              hover:text-[#11181C] transition-all duration-150 rounded-none
              bg-transparent
            "
          >
            {sheet.sheetName}
          </TabsTrigger>
        ))}
      </TabsList>

      {sheetDataList.map((sheet) => {
        const currentPage = currentPages[sheet.sheetName] || 1;
        const totalPages = totalPagesMap[sheet.sheetName] || 1;
        const rows = sheetRows[sheet.sheetName] || [];
        const isLoading = loading[sheet.sheetName];

        return (
          <TabsContent
            key={sheet.sheetName}
            value={sheet.sheetName}
            className="mt-0"
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-sm font-mono text-[#687076]">loading...</p>
              </div>
            ) : rows.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-mono text-[#687076]">
                  no data available
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#E6E8EA] bg-[#F8F9FA]">
                        {Object.keys(rows[0]).map((col) => (
                          <TableHead
                            key={col}
                            className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider"
                          >
                            {col}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row, idx) => (
                        <TableRow
                          key={idx}
                          className="border-b border-[#E6E8EA] hover:bg-[#F8F9FA] transition-colors duration-150"
                        >
                          {Object.keys(row).map((key) => (
                            <TableCell
                              key={key}
                              className="px-4 py-3 text-sm font-mono text-[#11181C]"
                            >
                              {row[key]}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(sheet, "prev")}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-[#1E2A3A] hover:text-[#11181C] disabled:opacity-50"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                      previous
                    </Button>
                    <span className="text-xs font-mono text-[#687076]">
                      page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(sheet, "next")}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-xs hover:border-[#1E2A3A] hover:text-[#11181C] disabled:opacity-50"
                    >
                      next
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
