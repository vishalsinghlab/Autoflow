"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

export default function CredentialsModal({ open, onOpenChange, source, onSave }) {
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
      await axiosInstance.post(`/data-enrichment/save-credentials`, credentials);
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
            <Label>API Key</Label>
            <Input value={credentials.apiKey || ""} onChange={(e) => handleChange("apiKey", e.target.value)} />
            <Label>Session Cookie</Label>
            <Input value={credentials.cookie || ""} onChange={(e) => handleChange("cookie", e.target.value)} />
            <Label>CSRF Token</Label>
            <Input value={credentials.csrf || ""} onChange={(e) => handleChange("csrf", e.target.value)} />
          </>
        );
      case "magiclead":
        return (
          <>
            <Label>Auth Token</Label>
            <Input value={credentials.authToken || ""} onChange={(e) => handleChange("authToken", e.target.value)} />
          </>
        );
      case "salesql":
        return (
          <>
            <Label>Access Token</Label>
            <Input value={credentials.accessToken || ""} onChange={(e) => handleChange("accessToken", e.target.value)} />
          </>
        );
      default:
        return <p className="text-sm text-gray-500">No credentials needed for this source.</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Manage Credentials for {source}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">{renderFields()}</div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
