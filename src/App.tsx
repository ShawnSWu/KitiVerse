import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from 'reactflow';
import type { Node, Edge, NodeChange, Connection, XYPosition } from 'reactflow';
import 'reactflow/dist/style.css';
import './styles/markdownNode.css';
import './themes/theme.css';
import './App.css';
import MarkdownNode from './components/nodes/MarkdownNode';
import ImageNode from './components/nodes/ImageNode';
import CustomEdge from './components/edges/CustomEdge';

// 註冊自定義節點和邊類型
const nodeTypes = {
  markdown: MarkdownNode,
  imageNode: ImageNode,
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
  {
    id: 'abc-image',
    type: 'imageNode',
    position: { x: 400, y: 200 },
    data: {
      label: 'ABC Image',
      imagePath: 'abc.png',
      contentFolder: 'kubernetes'
    }
  },
  {
    id: 'pod-image',
    type: 'imageNode',
    position: { x: 100, y: 100 },
    data: {
      label: 'Kubernetes Pod',
      imagePath: 'pod.png',
      contentFolder: 'kubernetes'
    }
  },
  {
    id: 'container-image',
    type: 'imageNode',
    position: { x: 400, y: 100 },
    data: {
      label: 'Docker Container',
      imagePath: 'container.png',
      contentFolder: 'docker'
    }
  },
];

const initialEdges: Edge[] = [
  {
    id: 'pod-to-service',
    source: 'pod-node',
    target: 'service-node',
    type: 'custom',
    data: {
      label: 'Pod 可以被 Service 選擇',
      style: {
        fontSize: '140px',
        fill: '#e2e8f0',
        fontWeight: 'bold',
        textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
      }
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
        type: 'custom',
        data: {
          label: '新連接',
          style: {
            fontSize: '140px',
            fill: '#e2e8f0',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
          }
        }
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  }, []);

  // 使用 useMemo 來記憶化節點類型和邊類型
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

  return (
    <div className="theme-dark" style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: 'var(--background-primary)',
      color: 'var(--text-normal)',
      fontFamily: 'var(--font-text)',
      overflow: 'hidden'  // 防止出現滾動條
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        fitView
        style={{
          backgroundColor: 'var(--background-primary)'
        }}
      >
        <Background 
          color="var(--background-modifier-border)" 
          gap={16} 
          style={{
            backgroundColor: 'var(--background-primary)'
          }}
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
