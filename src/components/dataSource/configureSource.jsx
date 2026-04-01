"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2 } from "lucide-react";

const destinationFilterConfig = {
  nasdaq: [
    {
      key: "exchange",
      label: "Exchange",
      options: [
        { name: "NASDAQ", value: "NASDAQ" },
        { name: "NYSE", value: "NYSE" },
      ],
    },
    {
      key: "marketcap",
      label: "Market Cap",
      options: [
        { name: "Mega (>$200B)", value: "mega" },
        { name: "Large ($10-$200B)", value: "large" },
        { name: "Medium ($2-$10B)", value: "medium" },
        { name: "Small ($300M-$2B)", value: "small" },
        { name: "Micro ($50M-$300M)", value: "micro" },
        { name: "Nano (<$50M)", value: "nano" },
      ],
    },
    {
      key: "sector",
      label: "Sector",
      options: [
        { name: "Technology", value: "technology" },
        { name: "Telecommunications", value: "telecommunications" },
        { name: "Healthcare", value: "healthcare" },
        { name: "Financials", value: "financials" },
        { name: "Real Estate", value: "real_estate" },
        { name: "Consumer Discretionary", value: "consumer_discretionary" },
        { name: "Consumer Staples", value: "consumer_staples" },
        { name: "Industrials", value: "industrials" },
        { name: "Basic Materials", value: "basic_materials" },
        { name: "Energy", value: "energy" },
        { name: "Utilities", value: "utilities" },
      ],
    },
    {
      key: "country",
      label: "Country",
      options: [
        { name: "United States", value: "united_states" },
        { name: "Canada", value: "canada" },
        { name: "United Kingdom", value: "united_kingdom" },
        { name: "India", value: "india" },
      ],
    },
    {
      key: "region",
      label: "Region",
      options: [
        { name: "North America", value: "north_america" },
        { name: "Europe", value: "europe" },
        { name: "Asia", value: "asia" },
      ],
    },
    {
      key: "rating",
      label: "Analyst Rating",
      options: [
        { name: "Buy", value: "buy" },
        { name: "Hold", value: "hold" },
        { name: "Sell", value: "sell" },
      ],
    },
  ],
  ycombinator: [
    {
      key: "batch",
      label: "Batch",
      options: [
        { name: "X25", value: "X25" },
        { name: "W24", value: "W24" },
        { name: "S23", value: "S23" },
        { name: "W23", value: "W23" },
        // Add more batches as needed
      ],
    },
    {
      key: "industry",
      label: "Industry",
      options: [
        { name: "Fintech", value: "Fintech" },
        { name: "HealthCare", value: "HealthCare" },
        { name: "Consumer", value: "Consumer" },
      ],
    },
    {
      key: "companySize",
      label: "Company Size",
      options: [
        { name: "1-10", value: "1-10" },
        { name: "11-50", value: "11-50" },
        { name: "51-100", value: "51-100" },
        { name: "101-200", value: "101-200" },
      ],
    },
  ],
  linkedin: [
    {
      key: "searchType",
      label: "Search Type",
      options: [
        { name: "Companies", value: "company" },
        { name: "Jobs", value: "jobs" },
        { name: "People", value: "people" },
      ],
    },
    {
      key: "keywords",
      label: "Search Keywords",
      type: "input",
    },
  ],
  clutch: [
    {
      key: "url",
      label: "Search Url",
      type: "input",
    },
  ],
};

export default function ExtractionDestinationConfig() {
  const [destination, setDestination] = useState("");
  const [extractionName, setExtractionName] = useState("");
  const [filters, setFilters] = useState({});
  const [limit, setLimit] = useState("");
  const [googleSheetLink, setGoogleSheetLink] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const startDataExtractionAutomation = async () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v),
    );

    setLoading(true); // ✅ Start loading
    try {
      const payload = {
        name: extractionName,
        filters: activeFilters,
        limit,
        targetSource: destination,
        googleSheetLink:
          destination === "googleSheet" ? googleSheetLink : undefined,
      };

      const response = await axiosInstance.post(
        `/data-source/extract-data`,
        payload,
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error", error.message);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false); // ✅ End loading
    }
  };

  const resetConfig = () => {
    setDestination("");
    setFilters({});
    setLimit("");
    setGoogleSheetLink("");
    setExtractionName("");
  };

  const renderDynamicFilters = () => {
    const baseFilters = destinationFilterConfig[destination] || [];
    const searchType = filters["searchType"];

    // Merge extra LinkedIn filters if searchType is present
    let filtersToRender = [...baseFilters];
    if (destination === "linkedin" && searchType) {
      filtersToRender = [...filtersToRender];
    }

    // Filter out those that have unmet dependsOn conditions
    const visibleFilters = filtersToRender.filter((filter) => {
      if (!filter.dependsOn) return true;
      return filters[filter.dependsOn.key] === filter.dependsOn.value;
    });

    // Deduplicate by key (in case of multiple entries like "location")
    const seenKeys = new Set();
    const deduplicatedFilters = visibleFilters.filter((filter) => {
      if (seenKeys.has(filter.key)) return false;
      seenKeys.add(filter.key);
      return true;
    });

    return deduplicatedFilters.map((filter) => {
      const value = filters[filter.key] || "";

      return (
        <div key={filter.key} className="mb-4">
          <Label className="w-auto mb-2 border-purple-200 text-purple-700">
            {filter.label}
          </Label>

          {filter.type === "input" ? (
            <Input
              value={value}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  [filter.key]: e.target.value,
                }))
              }
              placeholder={`Enter ${filter.label.toLowerCase()}`}
            />
          ) : (
            <Select
              value={value}
              onValueChange={(selected) =>
                setFilters((prev) => ({ ...prev, [filter.key]: selected }))
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={`Select ${filter.label.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-purple-50 p-6 rounded-xl shadow-md mt-0">
      <h2 className="text-xl font-bold text-purple-800 mb-2">Source</h2>

      <Select
        onValueChange={(value) => {
          setDestination(value);
          setFilters({});
          setGoogleSheetLink("");
        }}
        value={destination}
      >
        <SelectTrigger className="w-auto bg-white border-purple-200 text-purple-700">
          <SelectValue placeholder="Choose a data-source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="googleSheet">Google Sheet</SelectItem>
          <SelectItem value="nasdaq">Nasdaq</SelectItem>
          <SelectItem value="ycombinator">Y Combinator</SelectItem>
          <SelectItem value="linkedin">LinkedIn</SelectItem>
          <SelectItem value="clutch">Clutch</SelectItem>
        </SelectContent>
      </Select>

      {destination && (
        <div className="mt-6">
          <Label className="text-sm text-purple-800">Extraction Name</Label>
          <Input
            type="text"
            placeholder="e.g. Fintech List April"
            value={extractionName}
            onChange={(e) => setExtractionName(e.target.value)}
            className="bg-white border-purple-200 text-purple-700"
          />
        </div>
      )}

      {/* Google Sheet input */}
      {destination === "googleSheet" && (
        <div className="mt-6">
          <Label className="text-sm text-purple-800">Google Sheet Link</Label>
          <Input
            type="url"
            placeholder="https://docs.google.com/..."
            value={googleSheetLink}
            onChange={(e) => setGoogleSheetLink(e.target.value)}
            className="bg-white border-purple-200 text-purple-700"
          />
        </div>
      )}

      {/* Filters */}
      {destination !== "" && destination !== "googleSheet" && (
        <div className="mt-6 space-y-6">{renderDynamicFilters()}</div>
      )}

      {destination && (
        <>
          <div className="mt-4">
            <Label className="text-sm text-purple-800">Limit</Label>
            <Input
              type="number"
              placeholder="e.g. 100"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="bg-white border-purple-200 text-purple-700"
            />
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              className="bg-purple-700 text-white hover:bg-purple-800 flex items-center gap-2"
              onClick={startDataExtractionAutomation}
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              {loading ? "Extracting..." : "Start"}
            </Button>
            <Button
              variant="outline"
              className="text-purple-700 border-purple-300"
              onClick={resetConfig}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
