import { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from 'reactflow';
import type { Node, Edge, NodeChange, Connection, XYPosition } from 'reactflow';
import 'reactflow/dist/style.css';
import './styles/markdownNode.css';
import './themes/theme.css';
import MarkdownNode from './components/nodes/MarkdownNode';
import CustomEdge from './components/edges/CustomEdge';

// 註冊自定義節點和邊類型
const nodeTypes = {
  markdown: MarkdownNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// 示例數據
const initialNodes: Node[] = [
  {
    id: 'pod-node',
    type: 'markdown',
    data: {
      file: '/src/content/kubernetes/pod.md',
      nodeType: 'primary'
    },
    position: { x: 0, y: 0 },
    style: { 
      width: 800, 
      height: 600
    },
    draggable: true,
  },
  {
    id: 'service-node',
    type: 'markdown',
    data: {
      file: '/src/content/kubernetes/service.md',
      nodeType: 'secondary'
    },
    position: { x: 1000, y: 0 },
    style: { 
      width: 800, 
      height: 600
    },
    draggable: true,
  },
];

const initialEdges: Edge[] = [
  {
    id: 'pod-to-service',
    source: 'pod-node',
    target: 'service-node',
    sourceHandle: 'right',
    targetHandle: 'left',
    type: 'custom',
    data: {
      label: 'Pod 可以被 Service 選擇'
    }
  },
];

function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => nds.map((node) => {
      const change = changes.find((c) => 'id' in c && c.id === node.id);
      if (change && 'type' in change && change.type === 'position' && 'position' in change) {
        const position = change.position as XYPosition;
        return { ...node, position };
      }
      return node;
    }));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target) {
      const newEdge: Edge = {
        id: `edge-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle || undefined,
        targetHandle: connection.targetHandle || undefined,
        type: 'custom',
        data: {
          label: '新連接'
        }
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  }, []);

  return (
    <div className="theme-dark" style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: 'var(--background-primary)',
      color: 'var(--text-normal)',
      fontFamily: 'var(--font-text)',
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        fitView
      >
        <Background 
          color="var(--background-modifier-border)" 
          gap={16} 
        />
        <Controls 
          style={{ 
            backgroundColor: 'var(--background-secondary)',
            border: '1px solid var(--background-modifier-border)',
            borderRadius: 'var(--radius-m)',
          }} 
        />
        <MiniMap 
          style={{ 
            backgroundColor: 'var(--background-secondary)',
            border: '1px solid var(--background-modifier-border)',
            borderRadius: 'var(--radius-m)',
          }}
          nodeColor="var(--text-muted)"
        />
      </ReactFlow>
    </div>
  );
}

export default App;
