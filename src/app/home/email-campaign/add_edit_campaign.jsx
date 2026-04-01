import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { SenderSelectionGrid } from "./sender_selection";

export default function AddEditEmailCampaign({
  dialogOpen,
  setDialogOpen,
  form,
  handleChange,
  mode = "add",
  campaignToEdit = null,
  handleAddCampaign,
}) {
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [senders, setSenders] = useState([]);
  const [senderDialogOpen, setSenderDialogOpen] = useState(false);
  const [selectedSenders, setSelectedSenders] = useState([]);

  useEffect(() => {
    if (dialogOpen) {
      fetchTemplates();
      fetchEmailSenders();

      if (mode === "edit" && campaignToEdit) {
        setSelectedSenders(campaignToEdit.selected_senders || []);
      } else {
        setSelectedSenders([]);
      }
    }
  }, [dialogOpen, campaignToEdit, mode]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/email-templates/select`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data && data.success) {
        setEmailTemplates(data.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const fetchEmailSenders = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/senders`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data && data.success) {
        setSenders(data.data);
      }
    } catch (error) {
      console.error("Error fetching senders:", error);
    }
  };

  const handleSelectionSubmit = (selectedSenders) => {
    setSelectedSenders(selectedSenders);
    setSenderDialogOpen(false);
    handleChange("selected_senders", selectedSenders);
  };

  const handleSubmit = async () => {
    const campaignData = {
      ...form,
      selected_senders: selectedSenders,
    };

    if (mode === "add") {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      });
    } else {
      alert("Edit functionality not implemented yet.");
    }

    setDialogOpen(false);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-white text-[#301934] rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              {mode === "add" ? "Add New Campaign" : "Edit Campaign"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              name="automation_name"
              placeholder="Automation name"
              value={form.automation_name}
              onChange={(e) => handleChange("automation_name", e.target.value)}
              className="bg-[#f9f9fb] border border-gray-200"
            />
            <Input
              name="list_uri"
              placeholder="List URI"
              value={form.list_uri}
              onChange={(e) => handleChange("list_uri", e.target.value)}
              className="bg-[#f9f9fb] border border-gray-200"
            />

            <Select
              name="template_id"
              value={form.template_id}
              onValueChange={(value) => handleChange("template_id", value)}
            >
              <SelectTrigger className="w-full bg-[#f9f9fb] border border-gray-200">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent className="bg-white text-[#301934]">
                {emailTemplates?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border-gray-300 text-[#301934]"
                onClick={() => setSenderDialogOpen(true)}
              >
                {selectedSenders.length > 0
                  ? `${selectedSenders.length} sender(s) selected`
                  : "Select Senders"}
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                className="border-gray-300 text-[#301934]"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white"
                onClick={handleSubmit}
              >
                {mode === "add" ? "Add Campaign" : "Update Campaign"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={senderDialogOpen} onOpenChange={setSenderDialogOpen}>
        <DialogContent className="w-[70%] sm:max-w-[1000px] max-h-[80vh] overflow-y-auto bg-white text-[#301934] rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Select Email Senders
            </DialogTitle>
          </DialogHeader>
          <SenderSelectionGrid
            senders={senders}
            onSelectionChange={handleSelectionSubmit}
            onClose={() => setSenderDialogOpen(false)}
            onConfirm={() => setSenderDialogOpen(false)}
            selectedSenders={selectedSenders}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
