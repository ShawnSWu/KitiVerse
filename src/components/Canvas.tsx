import React from "react";
import ReactFlow, { Background, Controls, ReactFlowProvider } from "react-flow-renderer";
import { nodeTypes } from '../utils/nodeTypes';

interface CanvasProps {
  nodes: any[];
  edges: any[];
}

export default function Canvas({ nodes, edges }: CanvasProps) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
