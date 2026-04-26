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
import { Save, Eye, Trash2, FileText, Mail, Type } from "lucide-react";

export default function EmailEditorPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const [QuillModule, setQuillModule] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    const loadQuill = async () => {
      const Quill = (await import("quill")).default;
      setQuillModule(() => Quill);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Email Template Editor
          </h1>
          <p className="text-gray-500 mt-2">
            Create and manage your email templates with ease
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-gray-100 overflow-hidden">
          {/* Form Section */}
          <div className="p-6 bg-gradient-to-r from-purple-50 via-white to-pink-50 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Template Name
                </label>
                <Input
                  placeholder="Enter template name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 text-pink-600" />
                  Subject
                </label>
                <Input
                  placeholder="Enter email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Select Template
                </label>
                <Select
                  onValueChange={(value) => loadTemplate(value)}
                  value={selectedTemplateId || ""}
                >
                  <SelectTrigger className="border-gray-200 focus:border-purple-400 focus:ring-purple-400">
                    <SelectValue placeholder="Select Existing Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">
                      Select Existing Template
                    </SelectItem>
                    {templates?.map((tpl) => (
                      <SelectItem key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Type className="w-4 h-4 text-green-600" />
                  Insert Placeholder
                </label>
                <Select onValueChange={(value) => insertPlaceholder(value)}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-400 focus:ring-purple-400">
                    <SelectValue placeholder="Choose placeholder" />
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
          </div>

          {/* Editor Section */}
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Email Content
              </h2>
            </div>
            <div
              className="border-2 border-gray-100 overflow-hidden bg-white shadow-inner"
              style={{ minHeight: "400px" }}
              ref={quillRef}
            ></div>
          </div>

          {/* Actions Section */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={saveTemplate}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-200 transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
              <Button
                variant="secondary"
                onClick={exportHtml}
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white shadow-lg shadow-pink-200 transition-all duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Template
              </Button>
              <Button
                variant="destructive"
                onClick={deleteTemplate}
                disabled={!selectedTemplateId}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Template
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {htmlOutput && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                Live Preview
              </h2>
            </div>
            <div className="p-6">
              <div
                className="border-2 border-gray-100 rounded-xl p-6 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}