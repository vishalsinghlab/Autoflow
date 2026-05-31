"use client";

import { useEffect, useState } from "react";
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
import { Info, Loader2, ArrowRight, Database } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import CredentialsModal from "./sourceCredentials";

export default function EnrichmentSourceConfiguaration() {
  const [source, setSource] = useState("");
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [extractionJobs, setExtractionJobs] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState({});

  useEffect(() => {
    getExtractionJobs();
  }, []);

  useEffect(() => {
    if (source && savedCredentials[source]) {
      setFormValues((prev) => ({ ...prev, ...savedCredentials[source] }));
    }
  }, [source, savedCredentials]);

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!source || !selectedList) {
      toast.warning("Please select a source and a list");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        config: formValues,
        selectedList: selectedList,
        source,
      };

      const response = await axiosInstance.post(
        `/data-enrichment/enrich-data`,
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

  const handleListSelection = (list) => {
    setSelectedList(list);
  };

  const resetConfig = () => {
    setSource("");
    setFormValues({});
    setSelectedList(null);
    setSuccessMsg("");
    setErrorMsg("");
  };

  return (
    <TooltipProvider>
      <div className="w-full">
        {/* Name Field */}
        <div className="mb-6">
          <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
            extraction_name()
          </label>
          <input
            type="text"
            placeholder="e.g., enriched_companies_2025"
            value={formValues.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full max-w-sm px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
          />
        </div>

        {/* Select List */}
        <div className="mb-6">
          <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
            select_list()
          </label>
          <select
            onChange={(e) => handleListSelection(e.target.value)}
            className="w-full max-w-sm px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
          >
            <option value="">choose_list</option>
            {extractionJobs.map((list) => (
              <option key={list.id} value={list}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        {/* Select Source */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <label className="block text-xs font-mono text-[#687076] uppercase tracking-wider">
              data_source()
            </label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-[#687076] cursor-pointer hover:text-[#FFC043] transition-colors duration-150" />
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#11181C] text-white border-none rounded-none font-mono text-xs p-3"
              >
                select the platform from which to fetch enriched people data
              </TooltipContent>
            </Tooltip>
          </div>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full max-w-sm px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
          >
            <option value="">choose_source</option>
            <option value="apollo">apollo.io</option>
            <option value="magiclead">magic_lead</option>
            <option value="salesql">salesql</option>
          </select>
        </div>

        {/* Credentials Button */}
        <div className="mb-8">
          <button
            onClick={() => setCredentialsModalOpen(true)}
            className="px-4 py-2 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-sm hover:border-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-2"
          >
            <Database className="w-3.5 h-3.5" />
            manage_credentials()
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-[#E6E8EA]">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group px-5 py-2 bg-[#11181C] text-white font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>enriching...</span>
              </>
            ) : (
              <>
                <span>enrich.run()</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
              </>
            )}
          </button>
          <button
            onClick={resetConfig}
            className="px-5 py-2 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-sm hover:border-[#1E2A3A] hover:text-[#11181C] transition-all duration-150"
          >
            reset()
          </button>
        </div>

        {/* Status Messages */}
        {successMsg && (
          <div className="mt-4 p-3 border border-[#27C93F]/20 bg-[#27C93F]/5">
            <p className="text-xs font-mono text-[#27C93F]">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="mt-4 p-3 border border-[#FF5F56]/20 bg-[#FF5F56]/5">
            <p className="text-xs font-mono text-[#FF5F56]">{errorMsg}</p>
          </div>
        )}

        {/* Empty State Hint */}
        {!source && !selectedList && (
          <div className="mt-6 pt-4 border-t border-[#E6E8EA]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#687076]">
              <span className="text-[#FFC043]">→</span>
              <span>
                select a source and list to configure enrichment parameters
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Credentials Modal */}
      <CredentialsModal
        open={credentialsModalOpen}
        onOpenChange={setCredentialsModalOpen}
        source={source}
        onSave={(creds) => {
          setSavedCredentials((prev) => ({ ...prev, [source]: creds }));
          setFormValues((prev) => ({ ...prev, ...creds }));
        }}
      />
    </TooltipProvider>
  );
}
