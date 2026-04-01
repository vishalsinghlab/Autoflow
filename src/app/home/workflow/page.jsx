"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = ["Data Source", "Enrichment", "Email Campaign", "Voice Drop"];

const initialNodes = [
  {
    id: "1",
    type: "default",
    data: { label: "Sample Workflow Trigger" },
    position: { x: 100, y: 100 },
    style: { background: "#f3e8ff", border: "1px solid #a855f7" },
  },
];

const initialEdges = [];

export default function WorkflowBuilderPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const handleAddNode = () => {
    if (!selectedNode) return;
    const newNode = {
      id: uuidv4(),
      type: "default",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: selectedNode },
      style: { background: "#f3e8ff", border: "1px solid #a855f7" },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        ⚙️ Workflow Editor
      </h1>

      <div className="mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 text-white gap-2">
              <Plus className="w-4 h-4" /> Add Node
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Node Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedNode} onValueChange={setSelectedNode}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose node type..." />
                </SelectTrigger>
                <SelectContent>
                  {nodeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddNode}
                className="bg-purple-600 text-white"
              >
                Add to Workflow
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="h-[600px] w-full border rounded-md">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background variant="dots" gap={12} size={1} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
