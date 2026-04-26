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
  Plus,
  Calendar,
  Mail,
  Phone,
  Filter,
  Clock,
  LayoutTemplate,
  Users,
  Send,
  Pause,
  Play,
  CheckCircle2,
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
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
      .map((step, index) => ({ ...step, order: index + 1 }))
      .sort((a, b) => a.order - b.order);

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
      setCreateDialogOpen(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Play className="w-3 h-3" />;
      case "paused":
        return <Pause className="w-3 h-3" />;
      case "completed":
        return <CheckCircle2 className="w-3 h-3" />;
      case "draft":
        return <FilePen className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getActionIcon = (status) => {
    if (status === "draft") return <Play className="w-4 h-4" />;
    if (status === "active") return <Pause className="w-4 h-4" />;
    if (status === "paused") return <Play className="w-4 h-4" />;
    return null;
  };

  const CreateCampaignDialog = () => (
    <DialogContent
      className="max-w-3xl w-full p-0 rounded-2xl overflow-hidden border-none shadow-2xl"
      style={{ scrollbarGutter: "stable" }}
    >
      <div className="flex flex-col max-h-[90vh] h-full bg-white">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Rocket className="w-6 h-6 text-purple-600" />
              Create New Campaign
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Set up your campaign details and steps below.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-4 space-y-6 flex-1">
          <Card className="w-full border-2 border-purple-100 shadow-lg">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <TargetIcon className="w-4 h-4 text-purple-600" />
                  Campaign Name
                </Label>
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Spring Outreach Campaign"
                  className="border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <SendHorizontal className="w-4 h-4 text-purple-600" />
                  Campaign Type
                </Label>
                <Select value={campaignType} onValueChange={setCampaignType}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-400">
                    <SelectValue placeholder="Select Campaign Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email
                      </div>
                    </SelectItem>
                    <SelectItem value="voice">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Voice Drop
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Users className="w-4 h-4 text-purple-600" />
                    Enriched List
                  </Label>
                  <Select
                    value={enrichedListId}
                    onValueChange={setEnrichedListId}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-purple-400">
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

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Send className="w-4 h-4 text-purple-600" />
                    Sender List
                  </Label>
                  <Select
                    value={senderListId}
                    onValueChange={setSenderListId}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-purple-400">
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
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <LayoutTemplate className="w-4 h-4 text-purple-600" />
                  Campaign Steps
                </Label>
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="border-2 border-purple-100 p-5 rounded-xl bg-gradient-to-r from-purple-50 to-white shadow-sm space-y-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-purple-700 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </div>
                        Step {i + 1}
                      </h3>
                      <button
                        onClick={() => removeStep(i)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Remove Step"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
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
                          <SelectTrigger className="flex-1 border-gray-200">
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

                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <Input
                          type="datetime-local"
                          value={step.scheduledAt}
                          onChange={(e) =>
                            setSteps((prev) =>
                              prev.map((s, idx) =>
                                idx === i
                                  ? { ...s, scheduledAt: e.target.value }
                                  : s,
                              ),
                            )
                          }
                          className="flex-1 border-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addStep}
                  className="w-full border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setCreateDialogOpen(false)}
            className="border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-200"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Campaigns
            </h1>
            <p className="text-gray-500 mt-1">
              Create and manage your outreach campaigns
            </p>
          </div>
        </div>

        {/* Existing Campaigns Section */}
        {campaigns.length > 0 ? (
          <>
            <div className="bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-gray-100 overflow-hidden">
              {/* Header with Actions */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <ListChecks className="w-6 h-6 text-purple-600" />
                    Existing Campaigns
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <Select
                        value={statusFilter}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger className="w-[140px] border-gray-200 focus:border-purple-400">
                          <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => setCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-200 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">
                        Campaign Name
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">
                        Created At
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCampaigns.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-purple-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="font-medium text-gray-900">
                            {c.name}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {c.type === "email" ? (
                              <Mail className="w-3 h-3" />
                            ) : (
                              <Phone className="w-3 h-3" />
                            )}
                            {capitalizeFirstLetter(c.type)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(c.status)}`}
                          >
                            {getStatusIcon(c.status)}
                            {capitalizeFirstLetter(c.status)}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {new Date(c.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {c.status !== "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleCampaignTrigger(
                                    campaigns[0],
                                    c.status,
                                  )
                                }
                                className="border-gray-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600"
                                title={getButtonLabel(c.status)}
                              >
                                {getActionIcon(c.status)}
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleView(c)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                              title="View Campaign"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setModalEdit(c.id)}
                              className="hover:bg-yellow-50 hover:text-yellow-600"
                              title="Edit Campaign"
                            >
                              <FilePen className="w-4 h-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteCampaign(c.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                              title="Delete Campaign"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <Rocket className="w-16 h-16 text-purple-300 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800">
                No Campaigns Yet
              </h2>
              <p className="text-gray-500">
                Create your first campaign to start reaching out to your
                contacts
              </p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-200 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Button>
            </div>
          </div>
        )}

        {/* Create Campaign Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <CreateCampaignDialog />
        </Dialog>

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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <MailCheck className="w-5 h-5 text-purple-600" /> Send Test
              </DialogTitle>
              <DialogDescription>
                Simulate sending a test for {modalTest?.campaignName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Recipient Email
                </Label>
                <Input
                  placeholder="test@example.com"
                  className="border-gray-200 focus:border-purple-400"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-200">
                <Send className="w-4 h-4 mr-2" />
                Send Test
              </Button>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setModalTest(null)}
                className="border-gray-300"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}