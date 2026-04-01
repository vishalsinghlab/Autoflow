'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
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
      const firstCampaign = response.data.campaigns[0];
      setSelectedCampaign(firstCampaign);
      await getCampaignStatsById(firstCampaign.id);
      await getRecipientStatsForCampaignById(firstCampaign.id);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const getCampaignStatsById = async (campaignId) => {
    try {
      const response = await axiosInstance.get(`/campaign/${campaignId}/stats`);
      setSelectedCampaignStats(response.data); // update global stats here
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

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-purple-700" />
          Campaign Performance
        </h1>
        <Select
          value={selectedCampaign ? selectedCampaign.id : ""}
          onValueChange={handleCampaignChange}
        >
          <SelectTrigger className="w-[200px]" />
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
        <Skeleton className="h-40 rounded-xl" />
      ) : (
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-white border-purple-100 shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-6 text-gray-800">
            <div>
              <h2 className="text-xl font-semibold">{selectedCampaign.name}</h2>
              <p className="text-sm text-gray-500">
                Type: {selectedCampaign.type}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Stat
                label="Steps"
                value={selectedCampaignStats?.globalStats?.totalSteps || 0}
                icon={Send}
              />
              <Stat
                label="Sent"
                value={selectedCampaignStats?.globalStats?.totalSent || 0}
                icon={Send}
              />

              {selectedCampaign.type === "email" ? (
                <>
                  <Stat
                    label="Opened"
                    value={selectedCampaignStats?.globalStats?.totalOpened || 0}
                    icon={MailOpen}
                  />
                  <Stat
                    label="Clicked"
                    value={
                      selectedCampaignStats?.globalStats?.totalClicked || 0
                    }
                    icon={Link}
                  />

                  <Stat
                    label="Replies"
                    value={
                      selectedCampaignStats?.globalStats?.totalReplied || 0
                    }
                    icon={MessageCircle}
                  />
                  <Stat
                    label="Unsubscribed"
                    value={
                      selectedCampaignStats?.globalStats?.totalUnsubscribed || 0
                    }
                    icon={MessageCircle}
                  />
                </>
              ) : (
                <>
                  <Stat
                    label="Heard"
                    value={selectedCampaignStats?.globalStats?.totalHeard || 0}
                    icon={Ear}
                  />
                  <Stat
                    label="Callbacks"
                    value={
                      selectedCampaignStats?.globalStats?.totalCallbacks || 0
                    }
                    icon={PhoneCall}
                  />
                  <Stat
                    label="Failed"
                    value={selectedCampaignStats?.globalStats?.totalFailed || 0}
                    icon={XCircle}
                  />
                </>
              )}
            </div>

            {selectedCampaign.type === "email" && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recipient Stats</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recipientStats || []}>
                    <XAxis dataKey="email" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalSent" fill="#8884d8" />
                    <Bar dataKey="totalOpened" fill="#82ca9d" />
                    <Bar dataKey="totalClicked" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Dropdown to select a step */}
            <div className="mb-4">
              <label
                htmlFor="step-select"
                className="text-sm font-medium text-gray-700"
              >
                Select Step:
              </label>
              <select
                id="step-select"
                value={selectedStepId || ""}
                onChange={(e) => setSelectedStepId(e.target.value)}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value={""}>-- Select a Step --</option>
                {selectedCampaignStats?.stepStats?.length > 0 &&
                  selectedCampaignStats?.stepStats?.map((step, index) => (
                    <option key={step.template.id} value={step.template.id}>
                      {`Step ${index + 1} - ${step.template.name}`}
                    </option>
                  ))}
              </select>
            </div>
          </CardContent>

          {/* Show recipient stats for selected step */}
          {selectedStepId && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-purple-100 text-purple-800">
                  <tr>
                    <th className="p-3 text-left">Recipient</th>
                    <th className="p-3 text-left">Sent</th>
                    <th className="p-3 text-left">Opened</th>
                    <th className="p-3 text-left">Replied</th>
                    <th className="p-3 text-left">Clicked</th>
                    <th className="p-3 text-left">Unsubscribed</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {recipientStats.map((recipient) => {
                    const step = recipient.steps.find((step) => {
                      return step.templateId == selectedStepId;
                    });

                    if (step) {
                      return (
                        <tr
                          key={`${recipient.email}-${step.templateId}`}
                          className="bg-white"
                        >
                          <td className="p-3">{recipient.email}</td>
                          <td className="p-3">
                            {step.sentAt ? "Sent" : "Not Sent"}
                          </td>
                          <td className="p-3">
                            {step.openedAt ? "Opened" : "Not Opened"}
                          </td>
                          <td className="p-3">
                            {step.repliedAt ? "Replied" : "Not Replied"}
                          </td>
                          <td className="p-3">
                            {step.clickedAt ? "Clicked" : "Not Clicked"}
                          </td>
                          <td className="p-3">
                            {step.unsubscribedAt
                              ? "Unsubscribed"
                              : "Not Unsubscribed"}
                          </td>
                        </tr>
                      );
                    }

                    return null;
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6 text-purple-600" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-xl">{value}</p>
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

