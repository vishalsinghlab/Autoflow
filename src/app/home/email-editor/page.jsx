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
import { Save, Eye, Trash2, FileText, Mail, Type, X } from "lucide-react";

export default function EmailEditorPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
    setShowPreview(true);
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
      toast.success("Template deleted");
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

  const clearForm = () => {
    setName("");
    setSubject("");
    setSelectedTemplateId(null);
    if (quillInstance.current) {
      quillInstance.current.root.innerHTML = "";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E6E8EA] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            EMAIL_TEMPLATE_EDITOR
          </div>
          <h1 className="text-2xl font-mono font-semibold text-[#11181C]">
            templates/<span className="text-[#FFC043]">editor</span>
          </h1>
          <p className="text-sm text-[#687076] font-mono mt-1">
            create and manage email templates
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Form Section */}
        <div className="border border-[#E6E8EA] bg-white mb-8">
          <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
              <span className="ml-2 text-xs font-mono text-[#687076]">
                autoflow/template_editor — zsh
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                    template_name()
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., welcome_email_v2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                    subject_line()
                  </label>
                  <input
                    type="text"
                    placeholder="Enter email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                    load_template()
                  </label>
                  <select
                    value={selectedTemplateId || ""}
                    onChange={(e) => loadTemplate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                  >
                    <option value="">select_template</option>
                    {templates?.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                    insert_placeholder()
                  </label>
                  <select
                    onChange={(e) => insertPlaceholder(e.target.value)}
                    defaultValue=""
                    className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                  >
                    <option value="">choose_placeholder</option>
                    <option value="name">{`{{name}}`}</option>
                    <option value="company">{`{{company}}`}</option>
                    <option value="designation">{`{{designation}}`}</option>
                    <option value="city">{`{{city}}`}</option>
                    <option value="state">{`{{state}}`}</option>
                    <option value="country">{`{{country}}`}</option>
                  </select>
                </div>

                <div className="pt-2">
                  <div className="flex gap-3">
                    <button
                      onClick={clearForm}
                      className="px-4 py-2 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-sm hover:border-[#1E2A3A] hover:text-[#11181C] transition-all duration-150"
                    >
                      clear()
                    </button>
                    <button
                      onClick={deleteTemplate}
                      disabled={!selectedTemplateId}
                      className="px-4 py-2 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-sm hover:border-red-500 hover:text-red-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      delete()
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="border border-[#E6E8EA] bg-white mb-8">
          <div className="border-b border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#687076]" />
                <span className="text-xs font-mono text-[#687076]">
                  email_content()
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div
              className="border border-[#E6E8EA] bg-white"
              style={{ minHeight: "400px" }}
              ref={quillRef}
            ></div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex gap-3">
          <button
            onClick={saveTemplate}
            className="group bg-[#11181C] text-white px-6 py-2.5 font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            template.save()
          </button>
          <button
            onClick={exportHtml}
            className="group border border-[#E6E8EA] bg-white text-[#687076] px-6 py-2.5 font-mono text-sm hover:border-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            preview.render()
          </button>
        </div>

        {/* Preview Modal */}
        {showPreview && htmlOutput && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11181C]/80 p-4">
            <div className="w-full max-w-4xl bg-white border border-[#E6E8EA] max-h-[90vh] overflow-hidden flex flex-col">
              <div className="border-b border-[#E6E8EA] px-6 py-4 bg-[#F8F9FA] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                  <span className="ml-2 text-xs font-mono text-[#687076]">
                    preview / {name || "untitled"}
                  </span>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-[#687076] hover:text-[#11181C] transition-colors duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6 bg-white">
                <div className="mb-4 pb-4 border-b border-[#E6E8EA]">
                  <p className="text-xs font-mono text-[#687076] uppercase tracking-wider">
                    SUBJECT
                  </p>
                  <p className="text-sm font-mono text-[#11181C] mt-1">
                    {subject || "no_subject"}
                  </p>
                </div>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlOutput }}
                />
              </div>
              <div className="border-t border-[#E6E8EA] px-6 py-3 bg-[#F8F9FA]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#687076]">
                  <span className="text-[#FFC043]">→</span>
                  <span>preview_mode // content rendered as HTML</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
