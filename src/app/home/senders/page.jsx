"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Trash2 } from "lucide-react";
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
    } catch (err) {
      console.error("Failed to delete sender:", err);
      toast.error(err?.response?.data?.message || "Failed to delete sender.");
    }
  };

  const currentList = senderLists.find((l) => l.name === selectedList);

  return (
    <div className="p-6 mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-purple-700">
        📧 Sender Email Management
      </h1>

      {/* Create & Select Sender List */}
      <Card className="border border-purple-100 shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Sender Lists</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <Label>New List Name</Label>
              <Input
                placeholder="e.g. Outreach List A"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateList}
              className="bg-purple-600 text-white"
            >
              Create List
            </Button>
          </div>

          <div className="mt-4">
            <Label>Switch List</Label>
            <select
              className="w-full mt-2 p-2 border rounded"
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
        </CardContent>
      </Card>

      {/* Add Sender to Selected List */}
      <Card className="border border-purple-100 shadow-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Add Sender to{" "}
            <span className="text-purple-600">{selectedList}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Email Address</Label>
              <Input
                placeholder="sender@example.com"
                value={newSender}
                onChange={(e) => setNewSender(e.target.value)}
              />
            </div>
            <div>
              <Label>Sending Limit (per day)</Label>
              <Input
                type="number"
                placeholder="e.g. 100"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={addSender} className="bg-purple-600 text-white">
            Add Sender
          </Button>
        </CardContent>
      </Card>

      {/* List Senders */}
      <Card className="border border-purple-100 shadow-md">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Senders in <span className="text-purple-600">{selectedList}</span>
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Limit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentList?.senders.map((s) => (
                <TableRow key={s.email}>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.limit}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteSender(s.email)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {currentList?.senders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-gray-400 italic"
                  >
                    No senders in this list.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
