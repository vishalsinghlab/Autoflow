"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { v4 as uuidv4 } from "uuid";

export default function EditCampaignModal({
  campaignId,
  templates,
  senderLists,
  contactLists,
  onSave,
  onClose,
}) {
  const [campaign, setCampaign] = useState(null);
  const [name, setName] = useState("");
  const [template, setTemplate] = useState("");
  const [senderList, setSenderList] = useState("");
  const [contactList, setContactList] = useState("");
  const [steps, setSteps] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axiosInstance.get(`/campaign/${campaignId}`);
        const { name, type, senderListId, status, steps, enrichedListId } =
          response.data.campaign;
        setCampaign(response.data.campaign);
        setName(name || "");
        setTemplate(type || "");
        setSenderList(senderListId || "");
        setContactList(enrichedListId || "");
        setSteps(steps);
      } catch (err) {
        setError("Failed to fetch campaign data");
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  const handleSave = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!template) newErrors.template = "Template is required";
    if (!senderList) newErrors.senderList = "Sender list is required";
    if (!contactList) newErrors.contactList = "Contact list is required";
    if (steps.length === 0) newErrors.steps = "At least one step is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...campaign,
        name,
        template,
        senderList,
        contactList,
        steps,
      });
    }
  };

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        id: uuidv4(),
        templateId: "",
        scheduledAt: "",
        order: prev.length + 1,
      },
    ]);
  };

  const updateStep = (stepId, field, value) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step,
      ),
    );
  };

  const formatDateTimeLocal = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-0 rounded-2xl overflow-hidden">
        {/* Outer wrapper with max height constraint */}
        <div className="flex flex-col max-h-[90vh] bg-white">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-3xl font-semibold text-purple-700 flex items-center gap-2">
              ✏️ Edit Campaign
            </h2>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto px-6 py-4 space-y-6 flex-1">
            {/* Form or dynamic content here */}
            {loading || !campaign ? (
              <div className="pt-6">Loading campaign data...</div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-sm text-purple-700">
                    Campaign Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter campaign name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-purple-700">Sender List</Label>
                  <Select value={senderList} onValueChange={setSenderList}>
                    <SelectTrigger
                      className={errors.senderList ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Choose a sender list" />
                    </SelectTrigger>
                    <SelectContent>
                      {senderLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.senderList && (
                    <p className="text-sm text-red-500">{errors.senderList}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-purple-700">
                    Contact List
                  </Label>
                  <Select value={contactList} onValueChange={setContactList}>
                    <SelectTrigger
                      className={errors.contactList ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Choose a contact list" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.contactList && (
                    <p className="text-sm text-red-500">{errors.contactList}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm text-purple-700">
                    Campaign Steps
                  </Label>
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="p-4 border rounded-xl bg-purple-50 shadow-sm space-y-3"
                    >
                      <div className="font-medium text-purple-700">
                        Step {index + 1}
                      </div>

                      <div className="flex items-center gap-4">
                        <Label className="w-32">Template</Label>
                        <Select
                          value={step.templateId}
                          onValueChange={(val) =>
                            updateStep(step.id, "templateId", val)
                          }
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((tpl) => (
                              <SelectItem key={tpl.id} value={tpl.id}>
                                {tpl.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-4">
                        <Label className="w-32">Schedule</Label>
                        <Input
                          type="datetime-local"
                          value={formatDateTimeLocal(step.scheduledAt)}
                          onChange={(e) =>
                            updateStep(step.id, "scheduledAt", e.target.value)
                          }
                          className="w-[200px]"
                        />
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
                  {errors.steps && (
                    <p className="text-sm text-red-500">{errors.steps}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-gray-300 text-gray-600 hover:border-purple-400 hover:text-purple-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition-all"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
