"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axiosInstance";
import ViewCampaignModal from "@/components/modals/viewCampaign";
import EditCampaignModal from "@/components/modals/editCampaign.modal";
import { toast } from "sonner";
import {
  SendHorizontal,
  ListChecks,
  FilePen,
  TargetIcon,
  Rocket,
  Trash,
  Eye,
  PlayIcon,
  Plus,
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
  X,
  ChevronDown,
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
      toast.error(error.response?.data?.message || "Failed to update campaign");
    }
  };

  const getButtonLabel = (status) => {
    if (status === "draft") return "start";
    if (status === "active") return "pause";
    if (status === "paused") return "resume";
    return "no_action";
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
      toast.error(
        error.response?.data?.message || "Failed to trigger campaign",
      );
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

  const deleteCampaign = async (campaignId) => {
    if (window.confirm("delete campaign? this action cannot be undone.")) {
      try {
        await axiosInstance.delete(`/campaign/${campaignId}`);
        setCampaigns((prevCampaigns) =>
          prevCampaigns.filter((campaign) => campaign.id !== campaignId),
        );
        toast.success("Campaign deleted successfully");
      } catch (error) {
        console.error("Error deleting campaign:", error);
        toast.error("Failed to delete campaign");
      }
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "active":
        return "text-[#27C93F] border-[#27C93F]/20 bg-[#27C93F]/5";
      case "paused":
        return "text-[#FFC043] border-[#FFC043]/20 bg-[#FFC043]/5";
      case "completed":
        return "text-[#1E2A3A] border-[#1E2A3A]/20 bg-[#1E2A3A]/5";
      case "draft":
        return "text-[#687076] border-[#687076]/20 bg-[#687076]/5";
      default:
        return "text-[#687076] border-[#687076]/20 bg-[#687076]/5";
    }
  };

  const CreateCampaignDialog = () => (
    <DialogContent className="max-w-3xl w-full p-0 border border-[#E6E8EA] rounded-none shadow-none bg-white">
      <div className="flex flex-col max-h-[90vh] h-full">
        {/* Header */}
        <div className="border-b border-[#E6E8EA] px-6 py-4 bg-[#F8F9FA]">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-[#1E2A3A] text-xs font-mono mb-3 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            CAMPAIGN_CREATOR
          </div>
          <DialogTitle className="text-xl font-mono font-semibold text-[#11181C]">
            campaign.create()
          </DialogTitle>
          <DialogDescription className="text-xs font-mono text-[#687076] mt-1">
            configure campaign parameters and workflow steps
          </DialogDescription>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6 flex-1">
          {/* Basic Info */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                campaign_name()
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g., spring_outreach_2025"
                className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                campaign_type()
              </label>
              <select
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
              >
                <option value="email">email</option>
                <option value="voice">voice_drop</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  enriched_list()
                </label>
                <select
                  value={enrichedListId}
                  onChange={(e) => setEnrichedListId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                >
                  <option value="">select_list</option>
                  {enrichedLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  sender_list()
                </label>
                <select
                  value={senderListId}
                  onChange={(e) => setSenderListId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                >
                  <option value="">select_list</option>
                  {senderLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LayoutTemplate className="w-4 h-4 text-[#FFC043]" />
              <h3 className="text-sm font-mono font-semibold text-[#11181C] uppercase tracking-wider">
                campaign_steps()
              </h3>
            </div>

            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="border border-[#E6E8EA] bg-white p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-[#FFC043] text-[#FFC043] flex items-center justify-center text-xs font-mono">
                        {i + 1}
                      </div>
                      <span className="text-xs font-mono text-[#687076]">
                        step_{i + 1}
                      </span>
                    </div>
                    <button
                      onClick={() => removeStep(i)}
                      className="text-[#687076] hover:text-[#FF5F56] transition-colors duration-150"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono text-[#687076] mb-1.5">
                        template_id()
                      </label>
                      <select
                        value={step.templateId}
                        onChange={(e) =>
                          setSteps((prev) =>
                            prev.map((s, idx) =>
                              idx === i
                                ? { ...s, templateId: e.target.value }
                                : s,
                            ),
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                      >
                        <option value="">select_template</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#687076] mb-1.5">
                        scheduled_at()
                      </label>
                      <input
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
                        className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addStep}
                className="w-full border border-dashed border-[#E6E8EA] bg-white px-4 py-3 text-sm font-mono text-[#687076] hover:border-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                add_step()
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E6E8EA] px-6 py-4 bg-[#F8F9FA] flex justify-end gap-3">
          <button
            onClick={() => setCreateDialogOpen(false)}
            className="px-4 py-2 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-sm hover:border-[#1E2A3A] hover:text-[#11181C] transition-all duration-150"
          >
            cancel()
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#11181C] text-white font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            campaign.create()
          </button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E6E8EA] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            CAMPAIGN_MANAGER
          </div>
          <h1 className="text-2xl font-mono font-semibold text-[#11181C]">
            campaigns/<span className="text-[#FFC043]">list</span>
          </h1>
          <p className="text-sm text-[#687076] font-mono mt-1">
            create and manage outreach campaigns
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {campaigns.length > 0 ? (
          <div className="border border-[#E6E8EA] bg-white overflow-hidden">
            {/* Table Header */}
            <div className="border-b border-[#E6E8EA] px-6 py-4 bg-[#F8F9FA]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-[#687076]" />
                  <span className="text-sm font-mono text-[#11181C]">
                    existing_campaigns()
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-[#687076]" />
                    <select
                      value={statusFilter}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-[#E6E8EA] font-mono text-sm outline-none focus:border-[#FFC043] hover:border-[#1E2A3A] transition-all duration-150"
                    >
                      <option value="all">all_status</option>
                      <option value="completed">completed</option>
                      <option value="active">active</option>
                      <option value="paused">paused</option>
                      <option value="draft">draft</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setCreateDialogOpen(true)}
                    className="px-4 py-1.5 bg-[#11181C] text-white font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    campaign.create()
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E6E8EA] bg-[#F8F9FA]">
                    <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                      campaign_name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                      type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                      status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                      created_at
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                      actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E8EA]">
                  {filteredCampaigns.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-[#F8F9FA] transition-colors duration-150"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-[#11181C]">
                          {c.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#687076]">
                          {c.type === "email" ? (
                            <Mail className="w-3 h-3" />
                          ) : (
                            <Phone className="w-3 h-3" />
                          )}
                          {c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono border ${getStatusStyles(c.status)}`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-[#687076]">
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {c.status !== "completed" && (
                            <button
                              onClick={() => handleCampaignTrigger(c, c.status)}
                              className="p-1.5 text-[#687076] hover:text-[#FFC043] transition-colors duration-150"
                              title={getButtonLabel(c.status)}
                            >
                              {c.status === "draft" && (
                                <Play className="w-3.5 h-3.5" />
                              )}
                              {c.status === "active" && (
                                <Pause className="w-3.5 h-3.5" />
                              )}
                              {c.status === "paused" && (
                                <Play className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => handleView(c)}
                            className="p-1.5 text-[#687076] hover:text-[#1E2A3A] transition-colors duration-150"
                            title="view"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setModalEdit(c.id)}
                            className="p-1.5 text-[#687076] hover:text-[#1E2A3A] transition-colors duration-150"
                            title="edit"
                          >
                            <FilePen className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteCampaign(c.id)}
                            className="p-1.5 text-[#687076] hover:text-[#FF5F56] transition-colors duration-150"
                            title="delete"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border border-[#E6E8EA] bg-white p-16 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <Rocket className="w-12 h-12 text-[#687076] mx-auto" />
              <h2 className="text-xl font-mono font-semibold text-[#11181C]">
                no_campaigns_found
              </h2>
              <p className="text-sm font-mono text-[#687076]">
                create your first campaign to start reaching out to contacts
              </p>
              <button
                onClick={() => setCreateDialogOpen(true)}
                className="mt-4 px-4 py-2 bg-[#11181C] text-white font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                campaign.create()
              </button>
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
      </div>
    </div>
  );
}
