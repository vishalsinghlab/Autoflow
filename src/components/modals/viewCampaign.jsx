import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";

export default function ViewCampaignModal({ campaign, onClose }) {
  const [selectedCampaignStats, setSelectedCampaignStats] = useState(null);
  const [recipientStats, setRecipientStats] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    if (campaign?.id) {
      getCampaignStatsById(campaign.id);
      getRecipientStatsForCampaignById(campaign.id);
    }
  }, [campaign]);

  const getCampaignStatsById = async (id) => {
    try {
      const res = await axiosInstance.get(`/campaign/${id}/stats`);
      setSelectedCampaignStats(res.data);
    } catch (err) {
      console.error("Failed to fetch campaign stats", err);
    }
  };

  const getRecipientStatsForCampaignById = async (id) => {
    try {
      const res = await axiosInstance.get(`/campaign/${id}/recipients/stats`);
      setRecipientStats(res.data.recipients || []);
    } catch (err) {
      console.error("Failed to fetch recipient stats", err);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-screen h-[90%] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl text-purple-700">
            📢 Campaign: {campaign.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 text-gray-800 bg-white">
          {/* Campaign Overview */}
          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border shadow-sm">
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium text-purple-600">Status:</span>{" "}
                {campaign.status}
              </p>
              <p>
                <span className="font-medium text-purple-600">Created At:</span>{" "}
                {campaign.createdAt}
              </p>
            </div>

            {selectedCampaignStats && (
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                <p>
                  <strong>Total Steps:</strong>{" "}
                  {selectedCampaignStats.globalStats.totalSteps}
                </p>
                <p>
                  <strong>Total Sent:</strong>{" "}
                  {selectedCampaignStats.globalStats.totalSent}
                </p>
                <p>
                  <strong>Total Opened:</strong>{" "}
                  {selectedCampaignStats.globalStats.totalOpened}
                </p>
                <p>
                  <strong>Total Replied:</strong>{" "}
                  {selectedCampaignStats.globalStats.totalReplied}
                </p>
                <p>
                  <strong>Total Clicked:</strong>{" "}
                  {selectedCampaignStats.globalStats.totalClicked}
                </p>
                <p>
                  <strong>Total Unsubscribed:</strong>{" "}
                  {selectedCampaignStats.globalStats.totalUnsubscribed}
                </p>
              </div>
            )}
          </div>

          {/* Recipient Stats */}
          <div className="bg-white border rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              👥 Recipient Stats
            </h3>

            <div className="mb-4">
              <label
                htmlFor="step-select"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Select Step:
              </label>
              <Select value={selectedStep} onValueChange={setSelectedStep}>
                <SelectTrigger className="w-full bg-white text-gray-800">
                  <SelectValue placeholder="-- Select a Step --" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCampaignStats?.stepStats?.map((step, idx) => (
                    <SelectItem
                      key={step.template.id}
                      value={step.template.id.toString()}
                    >
                      {`Step ${idx + 1} - ${step.template.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStep && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                  <thead className="bg-purple-100 text-purple-800">
                    <tr>
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Sent</th>
                      <th className="p-3">Opened</th>
                      <th className="p-3">Replied</th>
                      <th className="p-3">Clicked</th>
                      <th className="p-3">Unsubscribed</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {recipientStats.map((recipient) => {
                      const step = recipient.steps.find(
                        (s) => s.templateId == selectedStep,
                      );
                      if (!step) return null;

                      return (
                        <tr
                          key={`${recipient.email}-${step.templateId}`}
                          className="border-t bg-white"
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
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t text-right bg-white">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
