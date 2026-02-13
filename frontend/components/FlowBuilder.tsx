"use client";

import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Handle,
  MiniMap,
  Node,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Coins, Mail, Plus, Trash2, Zap as ZapIcon } from 'lucide-react';
import { useCallback } from 'react';

// Custom Node Components
const TriggerNode = ({ data }: { data: { label: string } }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-amber-500 min-w-[150px]">
    <div className="flex items-center">
      <div className="rounded-full w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-600 mr-2">
        <ZapIcon size={16} />
      </div>
      <div className="ml-2">
        <div className="text-xs font-bold text-gray-500 uppercase">Trigger</div>
        <div className="text-sm font-semibold">{data.label || 'Select Trigger'}</div>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-16 !bg-amber-500" />
  </div>
);

const ActionNode = ({ data }: { data: { id: string, label: string, icon: string, onDelete: (id: string) => void } }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 min-w-[150px] relative group">
    <button
      onClick={() => data.onDelete(data.id)}
      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Trash2 size={12} />
    </button>
    <Handle type="target" position={Position.Top} className="w-16 !bg-blue-500" />
    <div className="flex items-center">
      <div className="rounded-full w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 mr-2">
        {data.icon === 'mail' ? <Mail size={16} /> : <Coins size={16} />}
      </div>
      <div className="ml-2">
        <div className="text-xs font-bold text-gray-500 uppercase">Action</div>
        <div className="text-sm font-semibold">{data.label || 'Select Action'}</div>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-16 !bg-blue-500" />
  </div>
);

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

export default function FlowBuilder({ onSave }: { onSave: (nodes: Node[], edges: Edge[]) => void }) {
  const initialNodes: Node[] = [
    {
      id: 'trigger-1',
      type: 'trigger',
      data: { label: 'Webhook' },
      position: { x: 250, y: 5 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges],
  );

  const addAction = useCallback(() => {
    const id = `action-${nodes.length + 1}`;
    const newNode: Node = {
      id,
      type: 'action',
      data: {
        id,
        label: 'New Action',
        icon: 'mail',
        onDelete: (id: string) => {
          setNodes((nds: Node[]) => nds.filter((n: Node) => n.id !== id));
          setEdges((eds: Edge[]) => eds.filter((e: Edge) => e.source !== id && e.target !== id));
        }
      },
      position: { x: Math.random() * 400, y: nodes.length * 100 + 100 },
    };
    setNodes((nds: Node[]) => nds.concat(newNode));
  }, [nodes, setNodes, setEdges, nodes.length]);

  return (
    <div className="h-[70vh] w-full border rounded-xl overflow-hidden bg-slate-50 relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={addAction}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-slate-50 border transition-all text-sm font-medium"
        >
          <Plus size={16} /> Add Action
        </button>
        <button
          onClick={() => onSave(nodes, edges)}
          className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-lg shadow hover:bg-amber-600 transition-all text-sm font-medium"
        >
          Publish Flow
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
