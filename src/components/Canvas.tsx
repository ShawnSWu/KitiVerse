import React, { useCallback } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  ReactFlowProvider,
  applyNodeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type OnNodesChange,
  type OnConnect,
  type Connection
} from "react-flow-renderer";
import { nodeTypes } from '../utils/nodeTypes';

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: (changes: NodeChange[]) => void;
  onConnect?: (connection: Connection) => void;
  onNodesUpdate?: (nodes: Node[]) => void;
}

export default function Canvas({ 
  nodes, 
  edges, 
  onNodesChange: externalNodesChange,
  onConnect: externalOnConnect,
  onNodesUpdate 
}: CanvasProps) {
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      if (externalNodesChange) {
        externalNodesChange(changes);
      }
      
      // 更新節點位置
      if (onNodesUpdate) {
        onNodesUpdate(applyNodeChanges(changes, nodes));
      }
    },
    [externalNodesChange, nodes, onNodesUpdate]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      if (externalOnConnect) {
        externalOnConnect(connection);
      }
    },
    [externalOnConnect]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          fitView
          nodesDraggable={true}
          nodesConnectable={true}
          panOnDrag={[1]} // 使用中鍵拖動畫布
          panOnScroll={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
