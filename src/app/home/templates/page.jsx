"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TemplateEditor() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [mode, setMode] = useState("view");

  const [editedContent, setEditedContent] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/email-templates`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        if (data && data.success) {
          setTemplates(data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTemplates();
  }, []);
  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setEditedContent(template.body);
    setMode("edit");
  };

  const handleAddTemplate = async () => {
    if (!newTemplateName || !newTemplateContent) return;

    const newTemplate = {
      subject: newTemplateName,
      body: newTemplateContent,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/email-templates`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTemplate),
      }
    );

    if (!response.ok) throw new Error("Failed to save sender");

    const data = await response.json();
    if (data && data.success) {
      setTemplates([...templates, data.data]);
      setNewTemplateName("");
      setNewTemplateContent("");
      setMode("view");
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const updatedTemplate = {
        subject: selectedTemplate.subject,
        body: editedContent,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/email-templates/${selectedTemplate.id}`,
        {
          method: "PUT", // or PATCH depending on your backend
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTemplate),
        }
      );

      if (!response.ok) throw new Error("Failed to update template");

      const data = await response.json();
      if (data && data.success) {
        // Update the local templates array with the edited one
        const updatedList = templates.map((t) =>
          t.id === selectedTemplate.id ? { ...t, body: editedContent } : t
        );

        setTemplates(updatedList);
        setMode("view");
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/email-templates/${templateToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete template");

      const data = await response.json();
      if (data.success) {
        const updated = templates.filter((t) => t.id !== templateToDelete.id);
        setTemplates(updated);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    } finally {
      setConfirmDeleteOpen(false);
      setTemplateToDelete(null);
    }
  };

  const renderEJS = (template) => {
    const data = {
      name: "John",
      time: "10:00 AM",
      signature_name: "John Doe",
      signature_designation: "Chief Operating Officer",
      signature_address: " 123 Main St, City, Country",
      signature_phone: "+1234567890",
      company_name: "My Company",
    };

    return template.replace(/<%=\s*(\w+)\s*%>/g, (_, key) => data[key] ?? "");
  };

  return (
    <div className="p-4">
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this template?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {mode === "view" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Templates</h2>
          </div>
          <Button className="mb-2" onClick={() => setMode("add")}>
            Add Template
          </Button>
          <Card>
            <CardContent className="p-4">
              <table className="w-full text-left border">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Template Name</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates?.map((template) => (
                    <tr key={template.id} className="border-b">
                      <td className="p-2">{template.subject}</td>
                      <td className="p-2 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(template)}
                        >
                          Edit / View
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setTemplateToDelete(template);
                            setConfirmDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}

      {mode === "edit" && selectedTemplate && (
        <>
          <Button className="mt-4 mb-2" onClick={() => setMode("view")}>
            Back
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 h-full flex flex-col">
                <h2 className="text-lg font-bold mb-2">
                  Editing: {selectedTemplate.subject}
                </h2>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="flex-1 resize-none h-full"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleUpdateTemplate}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setMode("view")}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 h-full overflow-auto">
                <h2 className="text-lg font-bold mb-2">Preview</h2>
                <div
                  className="border p-4 bg-white rounded"
                  dangerouslySetInnerHTML={{ __html: renderEJS(editedContent) }}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {mode === "add" && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 h-full flex flex-col space-y-2">
              <h2 className="text-lg font-bold mb-2">Add New Template</h2>
              <Input
                placeholder="Template Name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
              <Textarea
                placeholder="EJS Content"
                value={newTemplateContent}
                onChange={(e) => setNewTemplateContent(e.target.value)}
                className="flex-1 resize-none h-full"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddTemplate}>Add Template</Button>
                <Button variant="outline" onClick={() => setMode("view")}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 h-full overflow-auto">
              <h2 className="text-lg font-bold mb-2">Live Preview</h2>
              <div
                className="border p-4 bg-white rounded"
                dangerouslySetInnerHTML={{
                  __html: renderEJS(newTemplateContent),
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
