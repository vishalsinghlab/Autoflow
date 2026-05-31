"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import { Key, Shield, X, Save } from "lucide-react";

export default function CredentialsModal({
  open,
  onOpenChange,
  source,
  onSave,
}) {
  const [credentials, setCredentials] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCredentials = async () => {
    try {
      const res = await axiosInstance.get(`/data-enrichment/credentials`);
      setCredentials(res.data || {});
    } catch (error) {
      console.error("Failed to fetch credentials", error);
    }
  };

  useEffect(() => {
    if (open && source) fetchCredentials();
  }, [open, source]);

  const handleChange = (field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(
        `/data-enrichment/save-credentials`,
        credentials,
      );
      toast.success("Credentials saved!");
      onSave(credentials);
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to save credentials.");
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (source) {
      case "apollo":
        return (
          <>
            <div>
              <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                api_key()
              </label>
              <input
                type="password"
                value={credentials.apiKey || ""}
                onChange={(e) => handleChange("apiKey", e.target.value)}
                placeholder="Enter API key"
                className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                session_cookie()
              </label>
              <input
                type="password"
                value={credentials.cookie || ""}
                onChange={(e) => handleChange("cookie", e.target.value)}
                placeholder="Enter session cookie"
                className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                csrf_token()
              </label>
              <input
                type="password"
                value={credentials.csrf || ""}
                onChange={(e) => handleChange("csrf", e.target.value)}
                placeholder="Enter CSRF token"
                className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
              />
            </div>
          </>
        );
      case "magiclead":
        return (
          <div>
            <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
              auth_token()
            </label>
            <input
              type="password"
              value={credentials.authToken || ""}
              onChange={(e) => handleChange("authToken", e.target.value)}
              placeholder="Enter auth token"
              className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
            />
          </div>
        );
      case "salesql":
        return (
          <div>
            <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
              access_token()
            </label>
            <input
              type="password"
              value={credentials.accessToken || ""}
              onChange={(e) => handleChange("accessToken", e.target.value)}
              placeholder="Enter access token"
              className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
            />
          </div>
        );
      default:
        return (
          <div className="py-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#687076]">
              <span className="text-[#FFC043]">→</span>
              <span>no credentials required for this source</span>
            </div>
          </div>
        );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11181C]/60">
      <div className="w-full max-w-md bg-white border border-[#E6E8EA]">
        {/* Modal Header */}
        <div className="border-b border-[#E6E8EA] px-6 py-4 bg-[#F8F9FA] flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-white text-[#1E2A3A] text-[10px] font-mono mb-1 border border-[#E6E8EA]">
              <span className="w-1 h-1 rounded-full bg-[#FFC043]"></span>
              CREDENTIALS_MANAGER
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FFC043]" />
              <h2 className="text-base font-mono font-semibold text-[#11181C]">
                credentials.{source}()
              </h2>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-[#687076] hover:text-[#11181C] transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-3.5 h-3.5 text-[#687076]" />
            <span className="text-xs font-mono text-[#687076] uppercase tracking-wider">
              authentication_parameters
            </span>
          </div>
          <div className="space-y-4">{renderFields()}</div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#E6E8EA] px-6 py-4 bg-[#F8F9FA] flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-sm hover:border-[#1E2A3A] hover:text-[#11181C] transition-all duration-150"
          >
            cancel()
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-[#11181C] text-white font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>credentials.save()</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
