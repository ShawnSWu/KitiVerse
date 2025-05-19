import { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from 'reactflow';
import type { Node, Edge, NodeChange, Connection, XYPosition } from 'reactflow';
import 'reactflow/dist/style.css';
import './styles/markdownNode.css';
import './styles/theme.css';
import MarkdownNode from './components/nodes/MarkdownNode';
import visualConfig from './config/visualConfig.json';

// 註冊自定義節點類型
const nodeTypes = {
  markdown: MarkdownNode,
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
      height: 600,
      backgroundColor: 'var(--background-light)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius-md)',
      padding: 'var(--spacing-md)',
      boxShadow: 'var(--shadow-sm)'
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
      height: 600,
      backgroundColor: 'var(--background-light)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius-md)',
      padding: 'var(--spacing-md)',
      boxShadow: 'var(--shadow-sm)'
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
    style: {
      stroke: 'var(--primary)',
      strokeWidth: 1,
    },
    data: {
      config: {
        fontSize: 'var(--font-size-sm)',
        backgroundColor: 'var(--background-light)',
        textColor: 'var(--text-primary)',
        fontFamily: 'var(--font-family)'
      }
    },
    label: 'Pod 可以被 Service 選擇',
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
        style: {
          stroke: 'var(--border-color)',
          strokeWidth: 1,
        },
        data: {
          config: {
            fontSize: 'var(--font-size-sm)',
            backgroundColor: 'var(--background-light)',
            textColor: 'var(--text-secondary)',
            fontFamily: 'var(--font-family)'
          }
        },
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'var(--background-light)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="var(--border-color)" gap={16} />
        <Controls style={{ backgroundColor: 'var(--background-light)' }} />
        <MiniMap 
          style={{ backgroundColor: 'var(--background-light)' }}
          nodeColor="var(--border-color)"
        />
      </ReactFlow>
    </div>
  );
}

export default App;
