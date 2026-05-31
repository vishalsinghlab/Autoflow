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
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";

const destinationFilterConfig = {
  nasdaq: [
    {
      key: "exchange",
      label: "exchange",
      options: [
        { name: "NASDAQ", value: "NASDAQ" },
        { name: "NYSE", value: "NYSE" },
      ],
    },
    {
      key: "marketcap",
      label: "market_cap",
      options: [
        { name: "mega (>$200B)", value: "mega" },
        { name: "large ($10-$200B)", value: "large" },
        { name: "medium ($2-$10B)", value: "medium" },
        { name: "small ($300M-$2B)", value: "small" },
        { name: "micro ($50M-$300M)", value: "micro" },
        { name: "nano (<$50M)", value: "nano" },
      ],
    },
    {
      key: "sector",
      label: "sector",
      options: [
        { name: "technology", value: "technology" },
        { name: "telecommunications", value: "telecommunications" },
        { name: "healthcare", value: "healthcare" },
        { name: "financials", value: "financials" },
        { name: "real_estate", value: "real_estate" },
        { name: "consumer_discretionary", value: "consumer_discretionary" },
        { name: "consumer_staples", value: "consumer_staples" },
        { name: "industrials", value: "industrials" },
        { name: "basic_materials", value: "basic_materials" },
        { name: "energy", value: "energy" },
        { name: "utilities", value: "utilities" },
      ],
    },
    {
      key: "country",
      label: "country",
      options: [
        { name: "united_states", value: "united_states" },
        { name: "canada", value: "canada" },
        { name: "united_kingdom", value: "united_kingdom" },
        { name: "india", value: "india" },
      ],
    },
    {
      key: "region",
      label: "region",
      options: [
        { name: "north_america", value: "north_america" },
        { name: "europe", value: "europe" },
        { name: "asia", value: "asia" },
      ],
    },
    {
      key: "rating",
      label: "analyst_rating",
      options: [
        { name: "buy", value: "buy" },
        { name: "hold", value: "hold" },
        { name: "sell", value: "sell" },
      ],
    },
  ],
  ycombinator: [
    {
      key: "batch",
      label: "batch",
      options: [
        { name: "X25", value: "X25" },
        { name: "W24", value: "W24" },
        { name: "S23", value: "S23" },
        { name: "W23", value: "W23" },
      ],
    },
    {
      key: "industry",
      label: "industry",
      options: [
        { name: "fintech", value: "Fintech" },
        { name: "healthcare", value: "HealthCare" },
        { name: "consumer", value: "Consumer" },
      ],
    },
    {
      key: "companySize",
      label: "company_size",
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
      label: "search_type",
      options: [
        { name: "companies", value: "company" },
        { name: "jobs", value: "jobs" },
        { name: "people", value: "people" },
      ],
    },
    {
      key: "keywords",
      label: "keywords",
      type: "input",
    },
  ],
  clutch: [
    {
      key: "url",
      label: "search_url",
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
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const startDataExtractionAutomation = async () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v),
    );

    setLoading(true);
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
      setLoading(false);
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

    let filtersToRender = [...baseFilters];
    if (destination === "linkedin" && searchType) {
      filtersToRender = [...filtersToRender];
    }

    const visibleFilters = filtersToRender.filter((filter) => {
      if (!filter.dependsOn) return true;
      return filters[filter.dependsOn.key] === filter.dependsOn.value;
    });

    const seenKeys = new Set();
    const deduplicatedFilters = visibleFilters.filter((filter) => {
      if (seenKeys.has(filter.key)) return false;
      seenKeys.add(filter.key);
      return true;
    });

    return deduplicatedFilters.map((filter) => {
      const value = filters[filter.key] || "";

      return (
        <div key={filter.key} className="mb-5">
          <Label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
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
              placeholder={`enter ${filter.label}`}
              className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
            />
          ) : (
            <Select
              value={value}
              onValueChange={(selected) =>
                setFilters((prev) => ({ ...prev, [filter.key]: selected }))
              }
            >
              <SelectTrigger className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]">
                <SelectValue placeholder={`select ${filter.label}`} />
              </SelectTrigger>
              <SelectContent className="border border-[#E6E8EA] rounded-none">
                {filter.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="font-mono text-sm focus:bg-[#F8F9FA] focus:text-[#11181C]"
                  >
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
    <div className="w-full">
      {/* Source Selection */}
      <div className="mb-6">
        <Label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
          source()
        </Label>
        <Select
          onValueChange={(value) => {
            setDestination(value);
            setFilters({});
            setGoogleSheetLink("");
          }}
          value={destination}
        >
          <SelectTrigger className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]">
            <SelectValue placeholder="select data source" />
          </SelectTrigger>
          <SelectContent className="border border-[#E6E8EA] rounded-none">
            <SelectItem value="googleSheet" className="font-mono text-sm">
              google_sheet
            </SelectItem>
            <SelectItem value="nasdaq" className="font-mono text-sm">
              nasdaq
            </SelectItem>
            <SelectItem value="ycombinator" className="font-mono text-sm">
              y_combinator
            </SelectItem>
            <SelectItem value="linkedin" className="font-mono text-sm">
              linkedin
            </SelectItem>
            <SelectItem value="clutch" className="font-mono text-sm">
              clutch
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {destination && (
        <>
          {/* Extraction Name */}
          <div className="mb-5">
            <Label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
              extraction_name()
            </Label>
            <Input
              type="text"
              placeholder="e.g., fintech_list_april"
              value={extractionName}
              onChange={(e) => setExtractionName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
            />
          </div>

          {/* Google Sheet input */}
          {destination === "googleSheet" && (
            <div className="mb-5">
              <Label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                google_sheet_url()
              </Label>
              <Input
                type="url"
                placeholder="https://docs.google.com/..."
                value={googleSheetLink}
                onChange={(e) => setGoogleSheetLink(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
              />
            </div>
          )}

          {/* Filters */}
          {destination !== "" && destination !== "googleSheet" && (
            <div className="my-6 pt-2 border-t border-[#E6E8EA]">
              <div className="mb-4">
                <p className="text-xs font-mono text-[#687076] uppercase tracking-wider">
                  filters()
                </p>
                <p className="text-[11px] font-mono text-[#687076] mt-1">
                  configure extraction parameters
                </p>
              </div>
              <div className="space-y-5">{renderDynamicFilters()}</div>
            </div>
          )}

          {/* Limit */}
          <div className="mb-6">
            <Label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
              limit()
            </Label>
            <Input
              type="number"
              placeholder="100"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-2 border-t border-[#E6E8EA]">
            <Button
              className="group px-5 py-2 bg-[#11181C] text-white font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={startDataExtractionAutomation}
              disabled={
                loading ||
                !extractionName ||
                (destination === "googleSheet" && !googleSheetLink)
              }
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>extracting...</span>
                </>
              ) : (
                <>
                  <span>extractor.run()</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={resetConfig}
              disabled={loading}
              className="px-5 py-2 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-sm hover:border-[#1E2A3A] hover:text-[#11181C] transition-all duration-150"
            >
              reset()
            </Button>
          </div>
        </>
      )}

      {/* Empty state hint */}
      {!destination && (
        <div className="mt-8 pt-6 border-t border-[#E6E8EA]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#687076]">
            <span className="text-[#FFC043]">→</span>
            <span>select a data source to configure extraction parameters</span>
          </div>
        </div>
      )}
    </div>
  );
}
