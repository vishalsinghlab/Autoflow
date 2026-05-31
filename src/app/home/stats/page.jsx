"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Send,
  MailOpen,
  MousePointerClick,
  Reply,
  UserMinus,
  Ear,
  PhoneForwarded,
  PhoneOff,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Activity,
  ChevronDown,
  Eye,
  Clock,
  Check,
  X,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

export default function CampaignStatsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState();
  const [selectedCampaignStats, setSelectedCampaignStats] = useState();
  const [recipientStats, setRecipientStats] = useState();
  const [selectedStepId, setSelectedStepId] = useState(null);

  useEffect(() => {
    getAllCampaigns();
  }, []);

  const getAllCampaigns = async () => {
    try {
      const response = await axiosInstance.get("/campaign/all");
      setCampaigns(response.data.campaigns);
      const firstCampaign = response.data.campaigns?.[0];
      setSelectedCampaign(firstCampaign);
      await getCampaignStatsById(firstCampaign?.id);
      await getRecipientStatsForCampaignById(firstCampaign?.id);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const getCampaignStatsById = async (campaignId) => {
    try {
      const response = await axiosInstance.get(`/campaign/${campaignId}/stats`);
      setSelectedCampaignStats(response.data);
    } catch (error) {
      console.error("Error fetching campaign stats:", error);
    }
  };

  const getRecipientStatsForCampaignById = async (campaignId) => {
    try {
      const response = await axiosInstance.get(
        `/campaign/${campaignId}/recipients/stats`,
      );
      setRecipientStats(response.data.recipients);
    } catch (error) {
      console.error("Error fetching recipient stats:", error);
    }
  };

  const handleCampaignChange = (campaignId) => {
    const selected = campaigns.find((campaign) => campaign.id === campaignId);
    setSelectedCampaign(selected);
    getCampaignStatsById(selected.id);
    getRecipientStatsForCampaignById(selected.id);
    setSelectedStepId(null);
  };

  const getChartData = () => {
    if (!recipientStats || selectedCampaign?.type !== "email") return [];
    return recipientStats.slice(0, 10).map((recipient) => ({
      email: recipient.email?.split("@")[0] || recipient.email,
      sent: recipient.steps?.filter((s) => s.sentAt).length || 0,
      opened: recipient.steps?.filter((s) => s.openedAt).length || 0,
      clicked: recipient.steps?.filter((s) => s.clickedAt).length || 0,
    }));
  };

  const getFilteredRecipients = () => {
    if (!selectedStepId || !recipientStats) return [];
    return recipientStats.filter((recipient) =>
      recipient.steps?.some((step) => step.templateId == selectedStepId),
    );
  };

  const getSelectedStepName = () => {
    if (!selectedStepId || !selectedCampaignStats?.stepStats) return "";
    const step = selectedCampaignStats.stepStats.find(
      (s) => s.template.id == selectedStepId,
    );
    return step
      ? `step_${step.order + 1}_${step.template.name.toLowerCase().replace(/\s+/g, "_")}`
      : "";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E6E8EA] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            CAMPAIGN_ANALYTICS
          </div>
          <h1 className="text-2xl font-mono font-semibold text-[#11181C]">
            stats/<span className="text-[#FFC043]">performance</span>
          </h1>
          <p className="text-sm text-[#687076] font-mono mt-1">
            track and analyze campaign metrics
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Campaign Selector */}
        <div className="mb-8">
          <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
            select_campaign()
          </label>
          <select
            value={selectedCampaign ? selectedCampaign.id : ""}
            onChange={(e) => handleCampaignChange(e.target.value)}
            className="w-full max-w-sm px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
          >
            <option value="">select_campaign</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {!selectedCampaign ? (
          <div className="border border-[#E6E8EA] bg-white p-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border border-[#E6E8EA] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#687076]" />
              </div>
              <p className="text-sm font-mono text-[#687076]">
                loading campaign data...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Campaign Overview */}
            <div className="border border-[#E6E8EA] bg-white">
              <div className="border-b border-[#E6E8EA] px-6 py-4 bg-[#F8F9FA]">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-[#FFC043]/10 text-[#FFC043] text-xs font-mono mb-2 border border-[#FFC043]/20">
                      active_campaign
                    </div>
                    <h2 className="text-xl font-mono font-semibold text-[#11181C]">
                      {selectedCampaign.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-[#687076]">
                        type: {selectedCampaign.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-[#E6E8EA]">
                    <Activity className="w-3.5 h-3.5 text-[#FFC043]" />
                    <span className="text-xs font-mono text-[#687076]">
                      live_stats // real_time
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Global Stats Grid */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-[#FFC043]" />
                    <h3 className="text-sm font-mono font-semibold text-[#11181C] uppercase tracking-wider">
                      global_statistics()
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <StatCard
                      label="total_steps"
                      value={
                        selectedCampaignStats?.globalStats?.totalSteps || 0
                      }
                      icon={Send}
                    />
                    <StatCard
                      label="total_sent"
                      value={selectedCampaignStats?.globalStats?.totalSent || 0}
                      icon={Send}
                    />

                    {selectedCampaign.type === "email" ? (
                      <>
                        <StatCard
                          label="opened"
                          value={
                            selectedCampaignStats?.globalStats?.totalOpened || 0
                          }
                          icon={MailOpen}
                        />
                        <StatCard
                          label="clicked"
                          value={
                            selectedCampaignStats?.globalStats?.totalClicked ||
                            0
                          }
                          icon={MousePointerClick}
                        />
                        <StatCard
                          label="replied"
                          value={
                            selectedCampaignStats?.globalStats?.totalReplied ||
                            0
                          }
                          icon={Reply}
                        />
                        <StatCard
                          label="unsubscribed"
                          value={
                            selectedCampaignStats?.globalStats
                              ?.totalUnsubscribed || 0
                          }
                          icon={UserMinus}
                        />
                      </>
                    ) : (
                      <>
                        <StatCard
                          label="heard"
                          value={
                            selectedCampaignStats?.globalStats?.totalHeard || 0
                          }
                          icon={Ear}
                        />
                        <StatCard
                          label="callbacks"
                          value={
                            selectedCampaignStats?.globalStats
                              ?.totalCallbacks || 0
                          }
                          icon={PhoneForwarded}
                        />
                        <StatCard
                          label="failed"
                          value={
                            selectedCampaignStats?.globalStats?.totalFailed || 0
                          }
                          icon={PhoneOff}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Chart Section */}
                {selectedCampaign.type === "email" &&
                  recipientStats &&
                  recipientStats.length > 0 && (
                    <div className="mb-8 border border-[#E6E8EA] bg-white">
                      <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-3.5 h-3.5 text-[#687076]" />
                          <span className="text-xs font-mono text-[#687076]">
                            recipient_engagement()
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={getChartData()}>
                            <XAxis
                              dataKey="email"
                              tick={{ fontSize: 10, fontFamily: "monospace" }}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis
                              tick={{ fontSize: 10, fontFamily: "monospace" }}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "0px",
                                border: "1px solid #E6E8EA",
                                fontFamily: "monospace",
                                fontSize: "12px",
                              }}
                            />
                            <Legend
                              wrapperStyle={{
                                fontFamily: "monospace",
                                fontSize: "11px",
                              }}
                            />
                            <Bar dataKey="sent" fill="#1E2A3A" />
                            <Bar dataKey="opened" fill="#FFC043" />
                            <Bar dataKey="clicked" fill="#687076" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                {/* Step Selection */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-[#FFC043]" />
                    <h3 className="text-sm font-mono font-semibold text-[#11181C] uppercase tracking-wider">
                      step_details()
                    </h3>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedStepId || ""}
                      onChange={(e) => setSelectedStepId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A] appearance-none cursor-pointer"
                    >
                      <option value="">-- select_step --</option>
                      {selectedCampaignStats?.stepStats?.length > 0 &&
                        selectedCampaignStats.stepStats.map((step, index) => (
                          <option
                            key={step.template.id}
                            value={step.template.id}
                          >
                            step_{index + 1} // {step.template.name}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687076] pointer-events-none" />
                  </div>
                </div>

                {/* Step Recipient Table */}
                {selectedStepId && getFilteredRecipients().length > 0 && (
                  <div className="border border-[#E6E8EA] bg-white overflow-hidden">
                    <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#687076]" />
                        <span className="text-xs font-mono text-[#687076]">
                          recipient_details() // {getSelectedStepName()}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#E6E8EA] bg-[#F8F9FA]">
                            <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                              recipient
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                              sent
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                              opened
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                              replied
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                              clicked
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                              unsubscribed
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6E8EA]">
                          {getFilteredRecipients().map((recipient) => {
                            const step = recipient.steps.find((step) => {
                              return step.templateId == selectedStepId;
                            });

                            return (
                              <tr
                                key={`${recipient.email}-${step?.templateId}`}
                                className="hover:bg-[#F8F9FA] transition-colors duration-150"
                              >
                                <td className="px-4 py-3">
                                  <span className="text-sm font-mono text-[#11181C]">
                                    {recipient.email}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  {step?.sentAt ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#27C93F]">
                                      <Check className="w-3 h-3" /> sent
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#687076]">
                                      <Clock className="w-3 h-3" /> pending
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {step?.openedAt ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#27C93F]">
                                      <Eye className="w-3 h-3" /> opened
                                    </span>
                                  ) : (
                                    <span className="text-xs font-mono text-[#687076]">
                                      —
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {step?.repliedAt ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#27C93F]">
                                      <Reply className="w-3 h-3" /> replied
                                    </span>
                                  ) : (
                                    <span className="text-xs font-mono text-[#687076]">
                                      —
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {step?.clickedAt ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#27C93F]">
                                      <MousePointerClick className="w-3 h-3" />{" "}
                                      clicked
                                    </span>
                                  ) : (
                                    <span className="text-xs font-mono text-[#687076]">
                                      —
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {step?.unsubscribedAt ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF5F56]">
                                      <UserMinus className="w-3 h-3" />{" "}
                                      unsubscribed
                                    </span>
                                  ) : (
                                    <span className="text-xs font-mono text-[#687076]">
                                      —
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedStepId && getFilteredRecipients().length === 0 && (
                  <div className="border border-[#E6E8EA] bg-white p-8 text-center">
                    <p className="text-sm font-mono text-[#687076]">
                      no_recipients_found_for_selected_step
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="border border-[#E6E8EA] bg-white p-4 hover:border-[#FFC043]/30 transition-all duration-150">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-[#687076] uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-mono font-semibold text-[#11181C] mt-1">
            {value}
          </p>
        </div>
        <Icon className="w-4 h-4 text-[#687076]" />
      </div>
    </div>
  );
}
