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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useSelector } from "react-redux";

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
      const response = await axiosInstance.get("/data-source/extraction-jobs-list");
      const jobs = response.data.jobs || [];
      setExtractionJobs(jobs);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    }
  };

  const fetchData = async (list, page) => {
    try {
      const response = await axiosInstance.post(`/data-source/extraction-data`, {
        page,
        limit: rowsPerPage,
        list: list,
      });

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

    const confirmDelete = window.confirm("Are you sure you want to delete this list?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/data-source/delete-extraction-data/${selectedList.id}`);
      // Refresh list
      await getExtractionJobs();
      setSelectedList(null);
      setExtractedData([]);
      setColumns([]);
    } catch (error) {
      console.log("Error deleting list:", error);
      alert("Failed to delete the list.");
    }
  };

  const handleListSelection = (list) => {
    setSelectedList(list);
    setCurrentPage(1); // Reset to first page
    setSource(list.source);  // Ensure source is updated for the selected list
    setExtractedData([]);  // Clear previous data
    setColumns([]);  // Clear previous columns
    setTotalPages(1);  // Reset total pages
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-purple-800 mb-2">Select a List</h3>
        <Select onValueChange={(value) => handleListSelection(value)}>
          <SelectTrigger className="w-[250px] bg-white border-purple-200 text-purple-700">
            <SelectValue placeholder="Choose a list" />
          </SelectTrigger>
          <SelectContent>
            {extractionJobs.map((list) => (
              <SelectItem key={list.id} value={list}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedList && (
        <div className="overflow-auto border border-purple-100 rounded-lg">
          <div className="flex justify-between items-center mb-4 px-2">
            <h4 className="text-md font-semibold text-purple-700">
              Viewing: {extractionJobs.find((job) => job.id === selectedList)?.name}
            </h4>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteList}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete List
            </Button>
          </div>




            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-100 text-purple-800">
                    {columns.map((col) => (
                      <TableHead key={col}>{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extractedData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-purple-50">
                      {columns.map((col) => (
                        <TableCell key={col}>
                          {Array.isArray(row[col])
                            ? row[col].map((f) => `${f.name} (${f.title})`).join(", ")
                            : typeof row[col] === "object" && row[col] !== null
                              ? Object.entries(row[col]).map(([k, v]) => `${k}: ${v}`).join(", ")
                              : row[col]}
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
            </>


          {source === "googleSheet" && (
            <SheetDataViewer
              selectedList={selectedList}
              sheetDataList={extractedData}
            />
          )}
        </div>
      )}
    </Card>
  );
}

function SheetDataViewer({ selectedList, sheetDataList }) {
  const [currentPages, setCurrentPages] = useState({});
  const [sheetRows, setSheetRows] = useState({});
  const [loading, setLoading] = useState({});
  const [totalPagesMap, setTotalPagesMap] = useState({});

  const rowsPerPage = 10;

  const fetchSheetPage = async (sheetId, sheetName, page) => {
    setLoading((prev) => ({ ...prev, [sheetName]: true }));

    try {
      const response = await axiosInstance.post(`/data-source/extraction-data`, {
        sheetId,
        sheetName,
        page,
        limit: rowsPerPage,
        list: selectedList,
      });

      const { extractedData, totalCount, currentPage, totalPages } = response.data;

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
      <TabsList className="flex flex-wrap gap-2 mb-4 bg-purple-50 p-2 rounded-md">
        {sheetDataList.map((sheet) => (
          <TabsTrigger
            key={sheet.sheetName}
            value={sheet.sheetName}
            className="text-purple-700 data-[state=active]:bg-purple-200"
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
          <TabsContent key={sheet.sheetName} value={sheet.sheetName}>
            <Card className="p-4 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">
                Sheet: {sheet.sheetName}
              </h3>

              {isLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : rows.length === 0 ? (
                <p className="text-sm text-gray-500">No data available in this sheet.</p>
              ) : (
                <>
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-purple-100 text-purple-800">
                          {Object.keys(rows[0]).map((col) => (
                            <TableHead key={col}>{col}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                            {rows.map((row, idx) => (
                              <TableRow key={idx}>
                                {Object.keys(row).map((key) => (
                                  <TableCell key={key}>{row[key]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                      </div>

                      <div className="flex justify-between mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(sheet, "prev")}
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
                          onClick={() => handlePageChange(sheet, "next")}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </>
              )}
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
