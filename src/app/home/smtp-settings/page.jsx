"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { Mail, Server, Send, Trash2, Save } from "lucide-react";

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
            senderName: "",
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
        ? await axiosInstance.put(
            `/settings/smtp/update-smtp/${smtpConfig.id}`,
            payload,
          )
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
      const res = await axiosInstance.delete(
        `/settings/smtp/delete-smtp/${smtpConfig.id}`,
      );
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E6E8EA] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            SMTP_CONFIGURATION
          </div>
          <h1 className="text-2xl font-mono font-semibold text-[#11181C]">
            smtp/<span className="text-[#FFC043]">settings</span>
          </h1>
          <p className="text-sm text-[#687076] font-mono mt-1">
            configure email server settings for outgoing mail
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="border border-[#E6E8EA] bg-white">
          {/* Header Bar */}
          <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
            <div className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-[#687076]" />
              <span className="text-xs font-mono text-[#687076]">
                smtp_server_config()
              </span>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Host */}
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  smtp_host()
                </label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  value={smtpConfig.host}
                  onChange={(e) => handleChange("host", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                />
              </div>

              {/* Port */}
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  smtp_port()
                </label>
                <input
                  type="number"
                  placeholder="587"
                  value={smtpConfig.port}
                  onChange={(e) => handleChange("port", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                />
              </div>

              {/* Sender Email */}
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  sender_email()
                </label>
                <input
                  type="email"
                  placeholder="noreply@company.com"
                  value={smtpConfig.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  smtp_password()
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={smtpConfig.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                />
              </div>

              {/* Encryption */}
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  encryption()
                </label>
                <select
                  value={smtpConfig.encryption}
                  onChange={(e) => handleChange("encryption", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                >
                  <option value="tls">tls</option>
                  <option value="ssl">ssl</option>
                  <option value="none">none</option>
                </select>
              </div>

              {/* Sender Name */}
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  sender_name()
                </label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={smtpConfig.senderName}
                  onChange={(e) => handleChange("senderName", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                />
              </div>
            </div>

            {/* Test Email Section */}
            <div className="pt-4 border-t border-[#E6E8EA]">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-3.5 h-3.5 text-[#FFC043]" />
                <span className="text-xs font-mono text-[#687076] uppercase tracking-wider">
                  test_configuration()
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#687076] mb-1.5">
                    recipient_email()
                  </label>
                  <input
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleTestEmail}
                    disabled={loading || !testEmail || !smtpConfig.host}
                    className="w-full lg:w-auto px-4 py-2 bg-[#11181C] text-white font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>test.send()</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#E6E8EA]">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-[#11181C] text-white font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {smtpConfig.id ? "config.update()" : "config.save()"}
              </button>
              {smtpConfig.id && (
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-sm hover:border-[#FF5F56] hover:text-[#FF5F56] transition-all duration-150 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  config.delete()
                </button>
              )}
            </div>

            {/* Info Note */}
            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#687076]">
                <span className="text-[#FFC043]">→</span>
                <span>
                  configuration will be used for all outgoing email campaigns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
