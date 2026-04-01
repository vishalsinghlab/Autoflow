"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddEditEmailCampaign from "./add_edit_campaign";

export default function EmailCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    list_uri: "",
    template_id: "",
    automation_name: "",
  });

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaigns?page=1&limit=10`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCampaigns(data.data.campaigns);
      });
  }, [dialogOpen]);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleAddCampaign = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/campaigns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      },
    );

    const data = await response.json();
    if (data.success) {
      setCampaigns([...campaigns, data.data]);
      setDialogOpen(false);
      setForm({ list_uri: "", template_id: "", automation_name: "" });
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
    );
    // Optionally update status on server
  };

  return (
    <main className="p-6 min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="text-3xl font-bold text-purple-800">Email Campaigns</h1>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-md"
          onClick={() => setDialogOpen(true)}
        >
          Add Campaign
        </Button>
      </div>

      <div className="rounded overflow-hidden border border-purple-100 shadow-sm bg-white">
        <Table>
          <TableHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <TableRow>
              <TableHead className="text-purple-800 font-semibold">
                ID
              </TableHead>
              <TableHead className="text-purple-800 font-semibold">
                List URI
              </TableHead>
              <TableHead className="text-purple-800 font-semibold">
                Template ID
              </TableHead>
              <TableHead className="text-purple-800 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-purple-800 font-semibold">
                Completed On
              </TableHead>
              <TableHead className="text-purple-800 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow
                key={campaign.id}
                className="hover:bg-purple-50/40 transition-colors"
              >
                <TableCell>{campaign.id}</TableCell>
                <TableCell>{campaign.list_uri}</TableCell>
                <TableCell>{campaign.template_id}</TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      campaign.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : campaign.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </TableCell>
                <TableCell>
                  {campaign.completed_on
                    ? new Date(campaign.completed_on).toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {campaign.status !== "completed" && (
                    <Button
                      size="sm"
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                      onClick={() =>
                        handleStatusChange(
                          campaign.id,
                          campaign.status === "cancelled"
                            ? "started"
                            : "cancelled",
                        )
                      }
                    >
                      {campaign.status === "cancelled" ? "Start" : "Cancel"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddEditEmailCampaign
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        form={form}
        handleChange={handleChange}
        handleAddCampaign={handleAddCampaign}
      />
    </main>
  );
}
