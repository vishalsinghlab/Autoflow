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
import { Info, Loader2 } from "lucide-react";
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
      setLoading(false); // ✅ End loading
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

  return (
    <TooltipProvider>
      <div className="bg-purple-50 p-8 rounded-2xl shadow-lg w-full border border-purple-100">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-purple-800">
            Configure Data Source
          </h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-5 h-5 text-purple-600 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-white shadow-lg border text-sm p-3 text-purple-800 max-w-sm"
            >
              Select the platform from which to fetch enriched people data.
              After selecting, provide the required credentials and specify your
              preferences.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="mb-6">
          <Label htmlFor="name" className="text-sm text-purple-800 mb-1 block">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Enter a name for this extraction list"
            value={formValues.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-[300px] border-purple-200 text-purple-700 bg-white focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-purple-800 mb-2">
            Select a List
          </h3>
          <Select onValueChange={handleListSelection}>
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

        <div className="mb-6">
          <Label className="text-sm text-purple-800 mb-1 block">
            Select Source
          </Label>
          <Select onValueChange={(val) => setSource(val)}>
            <SelectTrigger className="bg-white border-purple-200 text-purple-700 w-[250px] focus:ring-2 focus:ring-purple-300">
              <SelectValue placeholder="Choose a source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apollo">Apollo.io</SelectItem>
              <SelectItem value="magiclead">Magic Lead</SelectItem>
              <SelectItem value="salesql">SalesQL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CredentialsModal
          open={credentialsModalOpen}
          onOpenChange={setCredentialsModalOpen}
          source={source}
          onSave={(creds) => {
            setSavedCredentials((prev) => ({ ...prev, [source]: creds }));
            setFormValues((prev) => ({ ...prev, ...creds }));
          }}
        />

        <Button
          className="bg-purple-200 text-purple-800 hover:bg-purple-600 hover:text-[white]"
          onClick={() => setCredentialsModalOpen(true)}
        >
          Manage Credentials
        </Button>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Encriching...
              </div>
            ) : (
              "Start"
            )}
          </Button>
          <Button
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-100"
            onClick={() => {
              setSource("");
              setFormValues({});
              setLimit("");
              setSuccessMsg("");
              setErrorMsg("");
            }}
          >
            Cancel
          </Button>
        </div>

        {successMsg && <p className="text-green-600 mt-4">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
      </div>
    </TooltipProvider>
  );
}
