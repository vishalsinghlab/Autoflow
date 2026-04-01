"use client";
import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function EmailEditorPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const quillRef = useRef(null); // Reference to the editor container
  const quillInstance = useRef(null); // Reference to the Quill editor instance
  const [QuillModule, setQuillModule] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    const loadQuill = async () => {
      const Quill = (await import("quill")).default;
      setQuillModule(() => Quill); // Save the module
    };
    loadQuill();
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      QuillModule &&
      quillRef.current &&
      !quillInstance.current
    ) {
      quillInstance.current = new QuillModule(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["link", "image"],
          ],
        },
      });

      setEditorLoaded(true);
    }
  }, [QuillModule]);

  const fetchTemplates = async () => {
    try {
      const res = await axiosInstance.get("/template/email-templates");
      setTemplates(res.data.templates);
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  const loadTemplate = async (id) => {
    try {
      if (id === "default") return;
      const res = await axiosInstance.get(`/template/email-templates/${id}`);
      const { name, subject, content } = res.data.template;
      setName(name);
      setSubject(subject);
      setSelectedTemplateId(id);

      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = content;
      }
    } catch (err) {
      console.error("Error loading template:", err);
    }
  };

  const exportHtml = () => {
    let content = quillInstance.current.root.innerHTML;
    content = content
      .replace(/<p([^>]*)>/g, '<p$1 style="margin:0; line-height:1.4;">')
      .replace(/<div([^>]*)>/g, '<div$1 style="margin:0; line-height:1.4;">');
    setHtmlOutput(content);
  };

  const saveTemplate = async () => {
    const content = quillInstance.current.root.innerHTML;
    const payload = { name, subject, content };

    try {
      if (selectedTemplateId) {
        await axiosInstance.put(
          `/template/email-templates/${selectedTemplateId}`,
          payload,
        );
      } else {
        await axiosInstance.post("/template/email-templates", payload);
      }
      fetchTemplates();
      toast.success("Template saved successfully");
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const deleteTemplate = async () => {
    if (!selectedTemplateId) return;

    try {
      await axiosInstance.delete(
        `/template/email-templates/${selectedTemplateId}`,
      );
      setName("");
      setSubject("");
      setSelectedTemplateId(null);
      fetchTemplates();
    } catch (err) {
      console.error("Error deleting template:", err);
    }
  };

  const insertPlaceholder = (placeholder) => {
    if (quillInstance.current) {
      const range = quillInstance.current.getSelection();
      if (range) {
        const cursorPosition = range.index;
        const placeholderText = `{{${placeholder}}}`;

        quillInstance.current.insertText(cursorPosition, placeholderText);
        quillInstance.current.setSelection(
          cursorPosition + placeholderText.length,
        );
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-r from-purple-300  to-purple-500 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-white mb-2">Template Name</label>
          <Input
            placeholder="Template Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white mb-2">Subject</label>
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white mb-2">Select Template</label>
          <Select
            onValueChange={(value) => loadTemplate(value)}
            value={selectedTemplateId || ""}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select Existing Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Select Existing Template</SelectItem>
              {templates?.map((tpl) => (
                <SelectItem key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="placeholder" className="font-medium text-white mb-2">
            Insert Placeholder
          </label>
          <Select onValueChange={(value) => insertPlaceholder(value)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Placeholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="designation">Designation</SelectItem>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="state">State</SelectItem>
              <SelectItem value="country">Country</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className="border rounded-lg shadow-lg bg-white overflow-hidden"
        style={{ height: "300px" }}
        ref={quillRef}
      ></div>

      <div className="flex gap-4 mt-4">
        <Button
          onClick={saveTemplate}
          className="bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
        >
          Save Template
        </Button>
        <Button
          variant="secondary"
          onClick={exportHtml}
          className="bg-pink-600 text-white hover:bg-pink-700 focus:ring-2 focus:ring-pink-500"
        >
          Preview Template
        </Button>
        <Button
          variant="destructive"
          onClick={deleteTemplate}
          disabled={!selectedTemplateId}
          className="bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
        >
          Delete Template
        </Button>
      </div>

      {htmlOutput && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-white">Preview</h2>
          <div
            className="border p-4 rounded-lg bg-white"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          />
        </div>
      )}
    </div>
  );
}
