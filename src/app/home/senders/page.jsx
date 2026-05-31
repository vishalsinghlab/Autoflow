"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus, Mail, List, Send } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

export default function SenderSettingsPage() {
  const [senderLists, setSenderLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [selectedList, setSelectedList] = useState("");

  const [newSender, setNewSender] = useState("");
  const [newLimit, setNewLimit] = useState("");

  const fetchLists = async () => {
    try {
      const res = await axiosInstance.get("/sender-list");
      const lists = res.data.data || [];
      setSenderLists(lists);
      if (lists.length > 0 && !selectedList) {
        setSelectedList(lists[0].name);
      }
    } catch (err) {
      console.error("Error fetching lists:", err);
      toast.error("Failed to load sender lists.");
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = async () => {
    const trimmedName = newListName.trim();
    if (!trimmedName) return toast.error("List name cannot be empty.");
    try {
      await axiosInstance.post("/sender-list/create", { name: trimmedName });
      await fetchLists();
      setNewListName("");
      setSelectedList(trimmedName);
      toast.success(`List "${trimmedName}" created!`);
    } catch (err) {
      console.error("Failed to create list:", err);
      toast.error(err?.response?.data?.message || "Failed to create list.");
    }
  };

  const addSender = async () => {
    if (!newSender || !newLimit || isNaN(Number(newLimit))) return;
    try {
      await axiosInstance.post("/sender-list/add-sender", {
        listName: selectedList,
        email: newSender,
        limit: Number(newLimit),
      });
      await fetchLists();
      setNewSender("");
      setNewLimit("");
      toast.success("Sender added successfully");
    } catch (err) {
      console.error("Failed to add sender:", err);
      toast.error(err?.response?.data?.message || "Failed to add sender.");
    }
  };

  const deleteSender = async (email) => {
    try {
      await axiosInstance.post("/sender-list/delete-sender", {
        listName: selectedList,
        email,
      });
      await fetchLists();
      toast.success("Sender deleted");
    } catch (err) {
      console.error("Failed to delete sender:", err);
      toast.error(err?.response?.data?.message || "Failed to delete sender.");
    }
  };

  const currentList = senderLists.find((l) => l.name === selectedList);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E6E8EA] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            SENDER_MANAGEMENT
          </div>
          <h1 className="text-2xl font-mono font-semibold text-[#11181C]">
            senders/<span className="text-[#FFC043]">settings</span>
          </h1>
          <p className="text-sm text-[#687076] font-mono mt-1">
            manage sender lists and email quotas
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create & Select Sender List */}
        <div className="border border-[#E6E8EA] bg-white mb-8">
          <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
            <div className="flex items-center gap-2">
              <List className="w-3.5 h-3.5 text-[#687076]" />
              <span className="text-xs font-mono text-[#687076]">
                sender_lists()
              </span>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  create_list()
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="e.g., outreach_list_a"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                  />
                  <button
                    onClick={handleCreateList}
                    className="px-4 py-2 bg-[#11181C] text-white font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    create()
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  select_list()
                </label>
                <select
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                >
                  {senderLists.map((l) => (
                    <option key={l.name} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Add Sender to Selected List */}
        <div className="border border-[#E6E8EA] bg-white mb-8">
          <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
            <div className="flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-[#687076]" />
              <span className="text-xs font-mono text-[#687076]">
                add_sender() // {selectedList || "no_list_selected"}
              </span>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  email_address()
                </label>
                <input
                  type="email"
                  placeholder="sender@company.com"
                  value={newSender}
                  onChange={(e) => setNewSender(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  daily_limit()
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                />
              </div>
            </div>
            <button
              onClick={addSender}
              disabled={!newSender || !newLimit}
              className="px-4 py-2 bg-[#11181C] text-white font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              sender.add()
            </button>
          </div>
        </div>

        {/* List Senders Table */}
        <div className="border border-[#E6E8EA] bg-white">
          <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#687076]" />
              <span className="text-xs font-mono text-[#687076]">
                senders_in_list() // {selectedList || "no_list_selected"}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E6E8EA] bg-[#F8F9FA]">
                  <TableHead className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                    email
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                    daily_limit
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-mono text-[#687076] uppercase tracking-wider">
                    actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentList?.senders.map((s) => (
                  <TableRow
                    key={s.email}
                    className="border-b border-[#E6E8EA] hover:bg-[#F8F9FA] transition-colors duration-150"
                  >
                    <TableCell className="px-4 py-3 text-sm font-mono text-[#11181C]">
                      {s.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm font-mono text-[#687076]">
                      {s.limit}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <button
                        onClick={() => deleteSender(s.email)}
                        className="p-1.5 text-[#687076] hover:text-[#FF5F56] transition-colors duration-150"
                        title="delete_sender"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {currentList?.senders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="px-4 py-8 text-center text-sm font-mono text-[#687076]"
                    >
                      no_senders_found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
