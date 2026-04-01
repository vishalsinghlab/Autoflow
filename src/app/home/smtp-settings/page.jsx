"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

export default function SmtpSettingsPage() {
  const [smtpConfig, setSmtpConfig] = useState({
    id: null,
    host: "",
    port: "",
    email: "",
    password: "",
    encryption: "tls",
    senderName: "",
  });
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Load config on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/settings/smtp/get-smtp");
        if (res.data.success && res.data.configs.length > 0) {
          const config = res.data.configs[0];
          setSmtpConfig({
            id: config.id,
            host: config.host,
            port: config.port,
            email: config.user,
            password: "",
            encryption: config.encryption.toLowerCase(),
            senderName: "", // Optionally include from backend later
          });
        }
      } catch (err) {
        console.error("Failed to load SMTP config", err);
      }
    })();
  }, []);

  const handleChange = (key, value) => {
    setSmtpConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const payload = {
      host: smtpConfig.host,
      port: smtpConfig.port,
      encryption: smtpConfig.encryption,
      user: smtpConfig.email,
      password: smtpConfig.password,
      senderName: smtpConfig.senderName,
    };

    try {
      const response = smtpConfig.id
        ? await axiosInstance.put(`/settings/smtp/update-smtp/${smtpConfig.id}`, payload)
        : await axiosInstance.post("/settings/smtp/save-smtp", payload);

      if (response.data.success) {
        toast.success(response.data.message || "SMTP settings saved!");
        if (!smtpConfig.id && response.data.smtpConfig) {
          setSmtpConfig((prev) => ({
            ...prev,
            id: response.data.smtpConfig.id,
          }));
        }
      } else {
        toast.error(response.data.message || "Failed to save settings.");
      }
    } catch (err) {
      toast.error("Failed to save SMTP settings.");
    }
  };

  const handleDelete = async () => {
    if (!smtpConfig.id) return;

    try {
      const res = await axiosInstance.delete(`/settings/smtp/delete-smtp/${smtpConfig.id}`);
      if (res.data.success) {
        toast.success("SMTP configuration deleted.");
        setSmtpConfig({
          id: null,
          host: "",
          port: "",
          email: "",
          password: "",
          encryption: "tls",
          senderName: "",
        });
        setTestEmail("");
      } else {
        toast.error(res.data.message || "Failed to delete.");
      }
    } catch (err) {
      toast.error("Error deleting SMTP config.");
    }
  };

  const handleTestEmail = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/settings/smtp/test-smtp", {
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port),
        encryption: smtpConfig.encryption.toUpperCase(),
        user: smtpConfig.email,
        password: smtpConfig.password,
        toEmail: testEmail,
      });

      const result = response.data;

      if (result.success) {
        toast.success(`✅ ${result.message}`);
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error("SMTP test error:", error);
      toast.error("Failed to send test email. Please check your SMTP config.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-purple-700">📨 SMTP Server Settings</h1>

      <Card className="border border-purple-100 shadow-md">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>SMTP Host</Label>
              <Input
                placeholder="smtp.example.com"
                value={smtpConfig.host}
                onChange={(e) => handleChange("host", e.target.value)}
              />
            </div>

            <div>
              <Label>SMTP Port</Label>
              <Input
                type="number"
                placeholder="587"
                value={smtpConfig.port}
                onChange={(e) => handleChange("port", e.target.value)}
              />
            </div>

            <div>
              <Label>Sender Email</Label>
              <Input
                type="email"
                placeholder="noreply@example.com"
                value={smtpConfig.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={smtpConfig.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>

            <div>
              <Label>Encryption</Label>
              <Select
                value={smtpConfig.encryption}
                onValueChange={(val) => handleChange("encryption", val)}
              >
                <SelectTrigger className="w-full" />
                <SelectContent>
                  <SelectItem value="tls">TLS</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sender Name</Label>
              <Input
                placeholder="e.g. Example Inc"
                value={smtpConfig.senderName}
                onChange={(e) => handleChange("senderName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <Label>Send Test Email To</Label>
              <Input
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleTestEmail}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Test Email"}
            </Button>
          </div>

          <div className="flex gap-4">
            <Button className="bg-gray-800 text-white mt-4" onClick={handleSave}>
              {smtpConfig.id ? "Update Settings" : "Save Settings"}
            </Button>
            {smtpConfig.id && (
              <Button
                variant="destructive"
                className="mt-4"
                onClick={handleDelete}
              >
                Delete Config
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
