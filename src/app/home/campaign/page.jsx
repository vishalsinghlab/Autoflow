"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axiosInstance";
import ViewCampaignModal from "@/components/modals/viewCampaign";
import EditCampaignModal from "@/components/modals/editCampaign.modal";
import { toast } from "sonner";
import {
  SendHorizontal,
  ListChecks,
  FilePen,
  MailCheck,
  TargetIcon,
  Rocket,
  Trash,
  Eye,
  PlayIcon,
} from "lucide-react";

export default function CampaignPage() {
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState("email");
  const [enrichedListId, setEnrichedListId] = useState("");
  const [senderListId, setSenderListId] = useState("");

  const [templates, setTemplates] = useState([]);
  const [senderLists, setSenderLists] = useState([]);
  const [enrichedLists, setEnrichedLists] = useState([]);
  const [steps, setSteps] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalTest, setModalTest] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all"); // To track the selected filter
  const filteredCampaigns = campaigns.filter(
    (campaign) => statusFilter === "all" || campaign.status === statusFilter,
  );

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleView = (campaign) => {
    setSelectedCampaign(campaign);
    setShowViewModal(true);
  };

  const handleCloseModal = () => setShowViewModal(false);

  useEffect(() => {
    axiosInstance.get("/template/email-templates").then((res) => {
      setTemplates(res.data.templates || []);
    });

    axiosInstance.get("/sender-list").then((res) => {
      setSenderLists(res.data.data || []);
    });

    axiosInstance.get("/data-enrichment/enrichment-jobs-list").then((res) => {
      setEnrichedLists(res.data.jobs || []);
    });

    axiosInstance.get("/campaign/all").then((res) => {
      const sorted = (res.data.campaigns || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setCampaigns(sorted);
    });
  }, []);

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        templateId: "",
        scheduledAt: "",
        order: prev.length + 1,
      },
    ]);
  };

  const handleSubmit = () => {
    const orderedSteps = steps
      .map((step, index) => ({ ...step, order: index + 1 })) // Ensure order is sequential
      .sort((a, b) => a.order - b.order); // Optional, but just to be sure

    const campaignData = {
      campaignName,
      campaignType,
      enrichedListId,
      senderListId,
      steps: orderedSteps,
    };

    axiosInstance.post("/campaign/create", campaignData).then(() => {
      toast.success("Campaign created successfully!");
      resetForm();
      axiosInstance.get("/campaign/all").then((res) => {
        const sorted = (res.data.campaigns || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setCampaigns(sorted);
      });
    });
  };

  const handleSave = async (updatedCampaign) => {
    try {
      const response = await axiosInstance.put("/campaign", {
        updatedCampaign,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        axiosInstance.get("/campaign/all").then((res) => {
          const sorted = (res.data.campaigns || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setCampaigns(sorted);
        });
      }
    } catch (error) {
      toast.error(response.data.message);
    }
  };

  const getButtonLabel = (status) => {
    if (status === "draft") {
      return "Start";
    } else if (status === "active") {
      return "Pause";
    } else if (status === "paused") {
      return "Resume";
    } else if (status === "completed") {
      return "No Action Needed";
    }
  };

  const handleCampaignTrigger = async (campaign, trigger) => {
    try {
      const response = await axiosInstance.post(
        `/campaign/${campaign.id}/trigger`,
        { trigger },
      );

      toast.success(response.data.message);

      axiosInstance.get("/campaign/all").then((res) => {
        const sorted = (res.data.campaigns || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setCampaigns(sorted);
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const resetForm = () => {
    setCampaignName("");
    setCampaignType("email");
    setEnrichedListId("");
    setSenderListId("");
    setSteps([]);
  };

  const removeStep = (index) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteCampaign = (campaignId) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      // Proceed with deletion
      axios
        .delete(`/campaign/${campaignId}`)
        .then(() => {
          setCampaigns((prevCampaigns) =>
            prevCampaigns.filter((campaign) => campaign.id !== campaignId),
          );
        })
        .catch((error) => {
          console.error("Error deleting campaign:", error);
        });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* Existing Campaigns Section */}
      {campaigns.length > 0 ? (
        <>
          <div className="flex flex-row justify-between">
            <h2 className="text-2xl font-semibold text-purple-700 flex items-center gap-2">
              <ListChecks className="w-5 h-5" /> Existing Campaigns
            </h2>
            {/* Create Campaign Button */}
            <Dialog>
              <DialogTrigger>
                <Button
                  size="lg"
                  className="mt-4 w-full bg-purple-500 rounded-md text-white hover:bg-purple-600"
                  variant="primary"
                >
                  Create Campaign
                </Button>
              </DialogTrigger>

              <DialogContent
                className="max-w-3xl w-full p-0 rounded-2xl overflow-hidden border-none shadow-2xl"
                style={{ scrollbarGutter: "stable" }}
              >
                <div className="flex flex-col max-h-[90vh] h-full bg-white">
                  {/* Header */}
                  <div className="p-6 border-b">
                    <DialogHeader>
                      <DialogDescription className="text-sm">
                        Create a new campaign by providing details below.
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  {/* Scrollable Body */}
                  <div className="overflow-y-auto px-6 py-4 space-y-6 flex-1">
                    <Card className="w-full bg-gradient-to-br from-purple-50 via-pink-50 to-white border-purple-100 shadow-xl">
                      <CardContent className="space-y-6 pt-6">
                        <div>
                          <Label className="text-purple-700 mb-2">
                            Campaign Name
                          </Label>
                          <Input
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            placeholder="Spring Outreach"
                          />
                        </div>

                        <div>
                          <Label className="text-purple-700 mb-2">
                            Campaign Type
                          </Label>
                          <Select
                            value={campaignType}
                            onValueChange={setCampaignType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Campaign Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="voice">Voice Drop</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-purple-700 mb-2">
                            Enriched List
                          </Label>
                          <Select
                            value={enrichedListId}
                            onValueChange={setEnrichedListId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Enriched List" />
                            </SelectTrigger>
                            <SelectContent>
                              {enrichedLists.map((list) => (
                                <SelectItem key={list.id} value={list.id}>
                                  {list.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-purple-700 mb-2">
                            Sender List
                          </Label>
                          <Select
                            value={senderListId}
                            onValueChange={setSenderListId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Sender List" />
                            </SelectTrigger>
                            <SelectContent>
                              {senderLists.map((list) => (
                                <SelectItem key={list.id} value={list.id}>
                                  {list.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <Label className="text-purple-700 mb-2">Steps</Label>
                          {steps.map((step, i) => (
                            <div
                              key={i}
                              className="border p-4 rounded-xl bg-white shadow-sm space-y-4"
                            >
                              <h3 className="font-medium text-purple-700">
                                Step {i + 1}
                              </h3>

                              <div className="flex gap-4 items-center">
                                <Label className="w-32">Template</Label>
                                <Select
                                  value={step.templateId}
                                  onValueChange={(val) =>
                                    setSteps((prev) =>
                                      prev.map((s, idx) =>
                                        idx === i
                                          ? { ...s, templateId: val }
                                          : s,
                                      ),
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Choose template" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {templates.map((t) => (
                                      <SelectItem key={t.id} value={t.id}>
                                        {t.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex gap-4 items-center">
                                <Label className="w-32">Schedule</Label>
                                <Input
                                  type="datetime-local"
                                  value={step.scheduledAt}
                                  onChange={(e) =>
                                    setSteps((prev) =>
                                      prev.map((s, idx) =>
                                        idx === i
                                          ? {
                                              ...s,
                                              scheduledAt: e.target.value,
                                            }
                                          : s,
                                      ),
                                    )
                                  }
                                />
                              </div>

                              <div className="relative group cursor-pointer text-red-600 hover:text-red-800 transition w-fit">
                                <Trash onClick={() => removeStep(i)} />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none z-20">
                                  Remove Step
                                </div>
                              </div>
                            </div>
                          ))}

                          <Button
                            variant="outline"
                            onClick={addStep}
                            className="text-purple-700 border-purple-400"
                          >
                            ➕ Add Step
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="rounded-xl border-gray-300 text-gray-600 hover:border-purple-400 hover:text-purple-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition-all"
                    >
                      Create Campaign
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter for Status */}
          <div className="mt-4 flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm text-purple-700">
              Filter by Status:
            </label>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="p-2 rounded border">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 max-h-[300px] overflow-y-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-purple-100 text-purple-800 sticky top-0 z-[50]">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created At</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="p-2">{c.name}</td>
                    <td className="p-2 capitalize">{c.type}</td>
                    <td className="p-2">{capitalizeFirstLetter(c.status)}</td>
                    <td className="p-2">{c.createdAt}</td>
                    <td className="p-2 space-x-2 flex items-center gap-2">
                      {c.status !== "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleCampaignTrigger(campaigns[0], c.status)
                          }
                        >
                          <PlayIcon
                            className="w-4 h-4"
                            label={getButtonLabel(c.status)}
                          ></PlayIcon>
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(c)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setModalEdit(c.id)}
                      >
                        <FilePen className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCampaign(c.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h2 className="text-2xl font-semibold text-purple-700 flex items-center gap-2">
          No Campaigns found
        </h2>
      )}

      {/* View Modal */}
      {showViewModal && selectedCampaign && (
        <ViewCampaignModal
          campaign={selectedCampaign}
          onClose={handleCloseModal}
        />
      )}

      {/* Edit Modal */}
      {modalEdit && (
        <EditCampaignModal
          campaignId={modalEdit}
          templates={templates}
          senderLists={senderLists}
          contactLists={enrichedLists}
          onSave={handleSave}
          onClose={() => setModalEdit(null)}
        />
      )}

      {/* Test Modal */}
      <Dialog open={!!modalTest} onOpenChange={() => setModalTest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MailCheck className="w-4 h-4" /> Send Test
            </DialogTitle>
            <DialogDescription>
              Simulate sending a test for {modalTest?.campaignName}
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-gray-700 space-y-3">
            <Input placeholder="test@example.com" />
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Send Test
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setModalTest(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
