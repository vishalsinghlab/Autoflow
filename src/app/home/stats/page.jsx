'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import {
  Send,
  MailCheck,
  MailOpen,
  Link,
  Ban,
  MessageCircle,
  Ear,
  PhoneCall,
  XCircle,
  BarChart3,
  Check,
  X,
  TrendingUp,
  Users,
  Target,
  Activity,
  ChevronDown,
  Clock,
  Eye,
  MousePointerClick,
  Reply,
  UserMinus,
  AlertCircle,
  PhoneOff,
  PhoneForwarded,
} from 'lucide-react';
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
  };

  const getChartData = () => {
    if (!recipientStats || selectedCampaign?.type !== "email") return [];
    return recipientStats.slice(0, 10).map(recipient => ({
      email: recipient.email?.split('@')[0] || recipient.email,
      Sent: recipient.steps?.filter(s => s.sentAt).length || 0,
      Opened: recipient.steps?.filter(s => s.openedAt).length || 0,
      Clicked: recipient.steps?.filter(s => s.clickedAt).length || 0,
    }));
  };

  const getFilteredRecipients = () => {
    if (!selectedStepId || !recipientStats) return [];
    return recipientStats.filter(recipient => 
      recipient.steps?.some(step => step.templateId == selectedStepId)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              Campaign Performance
            </h1>
            <p className="text-gray-500 mt-1 ml-14">
              Track and analyze your campaign metrics
            </p>
          </div>
          
          <Select
            value={selectedCampaign ? selectedCampaign.id : ""}
            onValueChange={handleCampaignChange}
          >
            <SelectTrigger className="w-[250px] border-gray-200 focus:border-purple-400 bg-white shadow-sm">
              <SelectValue placeholder="Select Campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!selectedCampaign ? (
          <Card className="border-2 border-purple-100 shadow-xl">
            <CardContent className="p-12">
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <Skeleton className="h-24 rounded-xl" />
                  <Skeleton className="h-24 rounded-xl" />
                  <Skeleton className="h-24 rounded-xl" />
                  <Skeleton className="h-24 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Campaign Overview Card */}
            <Card className="border-2 border-purple-100 shadow-xl shadow-purple-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCampaign.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium capitalize">
                        {selectedCampaign.type}
                      </span>
                      <span className="text-sm text-purple-100">
                        Campaign
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
                    <Activity className="w-5 h-5" />
                    <span className="font-medium">Live Stats</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                {/* Global Stats Grid */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Global Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Stat
                      label="Total Steps"
                      value={selectedCampaignStats?.globalStats?.totalSteps || 0}
                      icon={Send}
                      color="purple"
                    />
                    <Stat
                      label="Total Sent"
                      value={selectedCampaignStats?.globalStats?.totalSent || 0}
                      icon={Send}
                      color="blue"
                    />

                    {selectedCampaign.type === "email" ? (
                      <>
                        <Stat
                          label="Opened"
                          value={selectedCampaignStats?.globalStats?.totalOpened || 0}
                          icon={MailOpen}
                          color="green"
                        />
                        <Stat
                          label="Clicked"
                          value={selectedCampaignStats?.globalStats?.totalClicked || 0}
                          icon={MousePointerClick}
                          color="yellow"
                        />
                        <Stat
                          label="Replied"
                          value={selectedCampaignStats?.globalStats?.totalReplied || 0}
                          icon={Reply}
                          color="indigo"
                        />
                        <Stat
                          label="Unsubscribed"
                          value={selectedCampaignStats?.globalStats?.totalUnsubscribed || 0}
                          icon={UserMinus}
                          color="red"
                        />
                      </>
                    ) : (
                      <>
                        <Stat
                          label="Heard"
                          value={selectedCampaignStats?.globalStats?.totalHeard || 0}
                          icon={Ear}
                          color="green"
                        />
                        <Stat
                          label="Callbacks"
                          value={selectedCampaignStats?.globalStats?.totalCallbacks || 0}
                          icon={PhoneForwarded}
                          color="blue"
                        />
                        <Stat
                          label="Failed"
                          value={selectedCampaignStats?.globalStats?.totalFailed || 0}
                          icon={PhoneOff}
                          color="red"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Email Chart Section */}
                {selectedCampaign.type === "email" && recipientStats && recipientStats.length > 0 && (
                  <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      Recipient Engagement Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={getChartData()}>
                        <XAxis 
                          dataKey="email" 
                          tick={{ fontSize: 12 }} 
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="Sent" fill="#8884d8" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Opened" fill="#82ca9d" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Clicked" fill="#ffc658" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Step Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-purple-600" />
                    Step Details
                  </h3>
                  <div className="relative">
                    <select
                      id="step-select"
                      value={selectedStepId || ""}
                      onChange={(e) => setSelectedStepId(e.target.value)}
                      className="w-full p-3 pl-4 pr-10 border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all appearance-none cursor-pointer hover:border-purple-300"
                    >
                      <option value={""}>-- Select a Step to View Details --</option>
                      {selectedCampaignStats?.stepStats?.length > 0 &&
                        selectedCampaignStats?.stepStats?.map((step, index) => (
                          <option key={step.template.id} value={step.template.id}>
                            Step {index + 1} - {step.template.name}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Step Recipient Table */}
                {selectedStepId && getFilteredRecipients().length > 0 && (
                  <div className="rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Recipient Details for Selected Step
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b-2 border-gray-200">
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                Recipient
                              </div>
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <Send className="w-4 h-4 text-gray-400" />
                                Sent Status
                              </div>
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <MailOpen className="w-4 h-4 text-gray-400" />
                                Opened
                              </div>
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <Reply className="w-4 h-4 text-gray-400" />
                                Replied
                              </div>
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <MousePointerClick className="w-4 h-4 text-gray-400" />
                                Clicked
                              </div>
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <UserMinus className="w-4 h-4 text-gray-400" />
                                Unsubscribed
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {getFilteredRecipients().map((recipient) => {
                            const step = recipient.steps.find((step) => {
                              return step.templateId == selectedStepId;
                            });

                            return (
                              <tr
                                key={`${recipient.email}-${step.templateId}`}
                                className="hover:bg-purple-50/50 transition-colors"
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-medium">
                                      {recipient.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      {recipient.email}
                                    </span>
                                  </div>
                                </td>
                                {[
                                  { key: 'sentAt', trueLabel: 'Sent', falseLabel: 'Not Sent', trueIcon: Check, falseIcon: Clock, trueColor: 'green', falseColor: 'gray' },
                                  { key: 'openedAt', trueLabel: 'Opened', falseLabel: 'Not Opened', trueIcon: Eye, falseIcon: Clock, trueColor: 'green', falseColor: 'gray' },
                                  { key: 'repliedAt', trueLabel: 'Replied', falseLabel: 'Not Replied', trueIcon: Reply, falseIcon: Clock, trueColor: 'green', falseColor: 'gray' },
                                  { key: 'clickedAt', trueLabel: 'Clicked', falseLabel: 'Not Clicked', trueIcon: MousePointerClick, falseIcon: Clock, trueColor: 'green', falseColor: 'gray' },
                                  { key: 'unsubscribedAt', trueLabel: 'Unsubscribed', falseLabel: 'Not Unsubscribed', trueIcon: UserMinus, falseIcon: Check, trueColor: 'red', falseColor: 'gray' },
                                ].map(({ key, trueLabel, falseLabel, trueIcon: TrueIcon, falseIcon: FalseIcon, trueColor, falseColor }) => (
                                  <td key={key} className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                      step[key] 
                                        ? `bg-${trueColor}-100 text-${trueColor}-700 border border-${trueColor}-200`
                                        : `bg-${falseColor}-100 text-${falseColor}-600 border border-${falseColor}-200`
                                    }`}>
                                      {step[key] ? <TrueIcon className="w-3 h-3" /> : <FalseIcon className="w-3 h-3" />}
                                      {step[key] ? trueLabel : falseLabel}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, color = "purple" }) {
  const colorClasses = {
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    indigo: "bg-indigo-100 text-indigo-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all">
      <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="font-bold text-2xl text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

const StepStatsCard = ({ stepStats = [] }) => {
  return (
    <div className="grid gap-4">
      {stepStats.map((step) => (
        <div
          key={step.stepId}
          className="rounded-2xl bg-white shadow-lg p-6 border border-gray-200"
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-purple-600">
              Step {step.order}: {step.template.name}
            </h2>
            <p className="text-sm text-gray-500">
              Subject: {step.template.subject}
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Scheduled</p>
              <p className="text-lg font-medium text-purple-800">
                {step.scheduledCount}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Sent</p>
              <p className="text-lg font-medium text-purple-800">{step.sent}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Opened</p>
              <p className="text-lg font-medium text-purple-800">
                {step.opened}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Clicked</p>
              <p className="text-lg font-medium text-purple-800">
                {step.clicked}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Replied</p>
              <p className="text-lg font-medium text-purple-800">
                {step.replied}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Unsubscribed</p>
              <p className="text-lg font-medium text-purple-800">
                {step.unsubscribed}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};