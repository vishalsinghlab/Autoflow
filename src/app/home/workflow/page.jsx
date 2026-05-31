"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Plus,
  Workflow,
  Database,
  BrainCircuit,
  Mail,
  Phone,
  GitBranch,
  ArrowRight,
  X,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = [
  { type: "data_source", icon: Database },
  { type: "enrichment", icon: BrainCircuit },
  { type: "email_campaign", icon: Mail },
  { type: "voice_drop", icon: Phone },
];

const getNodeStyle = (type) => {
  const styles = {
    data_source: { background: "#F8F9FA", border: "#1E2A3A", text: "#11181C" },
    enrichment: { background: "#F8F9FA", border: "#FFC043", text: "#11181C" },
    email_campaign: {
      background: "#F8F9FA",
      border: "#1E2A3A",
      text: "#11181C",
    },
    voice_drop: { background: "#F8F9FA", border: "#1E2A3A", text: "#11181C" },
  };
  return styles[type] || styles["data_source"];
};

const initialNodes = [
  {
    id: "1",
    type: "default",
    data: { label: "start_workflow" },
    position: { x: 300, y: 50 },
    style: {
      background: "#F8F9FA",
      border: "2px solid #FFC043",
      padding: "12px 20px",
      fontSize: "12px",
      fontFamily: "monospace",
      fontWeight: 500,
      color: "#11181C",
      width: 160,
    },
  },
];

const initialEdges = [];

export default function WorkflowBuilderPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#FFC043", strokeWidth: 2 },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const handleAddNode = () => {
    if (!selectedNode) return;

    const style = getNodeStyle(selectedNode);

    const newNode = {
      id: uuidv4(),
      type: "default",
      position: {
        x: 150 + Math.random() * 400,
        y: 150 + Math.random() * 300,
      },
      data: { label: selectedNode },
      style: {
        background: style.background,
        border: `1.5px solid ${style.border}`,
        padding: "12px 20px",
        fontSize: "12px",
        fontFamily: "monospace",
        fontWeight: 500,
        color: style.text,
        width: 160,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(null);
    setDialogOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-[#E6E8EA] px-6 py-3 flex items-center justify-between flex-shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="border border-[#FFC043] p-1.5">
            <Workflow className="w-5 h-5 text-[#11181C]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-[#F8F9FA] text-[#1E2A3A] text-[10px] font-mono mb-1 border border-[#E6E8EA]">
              <span className="w-1 h-1 rounded-full bg-[#FFC043]"></span>
              WORKFLOW_EDITOR
            </div>
            <h1 className="text-base font-mono font-semibold text-[#11181C]">
              workflow/<span className="text-[#FFC043]">builder</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Node/Edge Counter */}
          <div className="flex items-center gap-3 text-xs font-mono text-[#687076] bg-[#F8F9FA] px-3 py-1.5 border border-[#E6E8EA]">
            <div className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              <span className="font-medium text-[#11181C]">{nodes.length}</span>
              <span>nodes</span>
            </div>
            <div className="w-px h-3 bg-[#E6E8EA]"></div>
            <div className="flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="font-medium text-[#11181C]">{edges.length}</span>
              <span>edges</span>
            </div>
          </div>

          {/* Add Node Button */}
          <button
            onClick={() => setDialogOpen(true)}
            className="bg-[#11181C] text-white px-4 py-1.5 text-sm font-mono hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            node.add()
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-4 bg-[#F8F9FA]">
        <div className="h-full w-full bg-white border border-[#E6E8EA] overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-left"
          >
            <Background variant="dots" gap={16} size={1} color="#E6E8EA" />
            <MiniMap
              nodeStrokeColor="#FFC043"
              nodeColor="#F8F9FA"
              maskColor="rgb(0,0,0,0.05)"
              style={{
                border: "1px solid #E6E8EA",
              }}
            />
            <Controls
              style={{
                border: "1px solid #E6E8EA",
              }}
            />
          </ReactFlow>
        </div>
      </div>

      {/* Add Node Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11181C]/60">
          <div className="w-full max-w-md bg-white border border-[#E6E8EA]">
            {/* Modal Header */}
            <div className="border-b border-[#E6E8EA] px-6 py-4 bg-[#F8F9FA] flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-white text-[#1E2A3A] text-[10px] font-mono mb-1 border border-[#E6E8EA]">
                  <span className="w-1 h-1 rounded-full bg-[#FFC043]"></span>
                  NODE_CREATOR
                </div>
                <h2 className="text-base font-mono font-semibold text-[#11181C]">
                  node.add()
                </h2>
              </div>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-[#687076] hover:text-[#11181C] transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                  select_node_type()
                </label>
                <select
                  value={selectedNode || ""}
                  onChange={(e) => setSelectedNode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E6E8EA] font-mono text-sm outline-none transition-all duration-150 focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 hover:border-[#1E2A3A]"
                >
                  <option value="">choose_type</option>
                  {nodeTypes.map(({ type, icon: Icon }) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {selectedNode && (
                <div
                  className="p-3 border text-sm font-mono"
                  style={{
                    backgroundColor: getNodeStyle(selectedNode).background,
                    borderColor: getNodeStyle(selectedNode).border,
                    color: getNodeStyle(selectedNode).text,
                  }}
                >
                  preview: {selectedNode}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#E6E8EA] px-6 py-4 bg-[#F8F9FA]">
              <button
                onClick={handleAddNode}
                disabled={!selectedNode}
                className="w-full bg-[#11181C] text-white px-4 py-2 font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                node.create()
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
