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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Workflow,
  Database,
  BrainCircuit,
  Mail,
  Phone,
  GitBranch,
  ArrowRight,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = [
  { type: "Data Source", icon: Database, color: "blue" },
  { type: "Enrichment", icon: BrainCircuit, color: "amber" },
  { type: "Email Campaign", icon: Mail, color: "purple" },
  { type: "Voice Drop", icon: Phone, color: "emerald" },
];

const getNodeStyle = (type) => {
  const styles = {
    "Data Source": {
      background: "#eff6ff",
      border: "#3b82f6",
      text: "#1e40af",
    },
    Enrichment: { background: "#fef3c7", border: "#f59e0b", text: "#92400e" },
    "Email Campaign": {
      background: "#f3e8ff",
      border: "#a855f7",
      text: "#6b21a8",
    },
    "Voice Drop": { background: "#ecfdf5", border: "#10b981", text: "#065f46" },
  };
  return styles[type] || styles["Email Campaign"];
};

const initialNodes = [
  {
    id: "1",
    type: "default",
    data: { label: "Start Workflow" },
    position: { x: 300, y: 50 },
    style: {
      background: "#ffffff",
      border: "2px solid #94a3b8",
      borderRadius: "10px",
      padding: "12px 20px",
      fontSize: "13px",
      fontWeight: 600,
      color: "#475569",
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
            style: { stroke: "#a855f7", strokeWidth: 2 },
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
        borderRadius: "10px",
        padding: "12px 20px",
        fontSize: "13px",
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-1.5 rounded-lg">
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Workflow Builder
            </h1>
            <p className="text-xs text-gray-500">Visual workflow editor</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Node/Edge Counter */}
          <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              <span className="font-medium">{nodes.length}</span>
              <span className="text-gray-400">nodes</span>
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <div className="flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="font-medium">{edges.length}</span>
              <span className="text-gray-400">edges</span>
            </div>
          </div>

          {/* Add Node Button + Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium">
                <Plus className="w-4 h-4 mr-1.5" />
                Add Node
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-lg">Add Node</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Select a node type to add to your workflow
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <Select
                  value={selectedNode || ""}
                  onValueChange={setSelectedNode}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose node type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {nodeTypes.map(({ type, icon: Icon }) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {type}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedNode && (
                  <div
                    className="p-3 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: getNodeStyle(selectedNode).background,
                      borderColor: getNodeStyle(selectedNode).border,
                      color: getNodeStyle(selectedNode).text,
                      border: "1px solid",
                    }}
                  >
                    Preview: {selectedNode}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  onClick={handleAddNode}
                  disabled={!selectedNode}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add to Canvas
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-4">
        <div className="h-full w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-left"
          >
            <Background variant="dots" gap={16} size={1} color="#000" />
            <MiniMap
              nodeStrokeColor="#a855f7"
              nodeColor="#f3e8ff"
              maskColor="rgb(0,0,0,0.08)"
              style={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Controls
              style={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
