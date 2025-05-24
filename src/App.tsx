import { useCallback, useEffect } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import { loadCanvasData } from './utils/canvasToReactFlow';
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
  image: ImageNode,  // 確保類型名稱與 convertCanvasNode 中的一致
};

const edgeTypes = {
  custom: CustomEdge,
};

// 初始化空節點和邊
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  
  // 載入 Canvas 數據
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading canvas data...');
        const { nodes } = await loadCanvasData();
        console.log('Loaded nodes:', nodes);
        
        // 調整節點位置到可見範圍
        const adjustedNodes = nodes.map(node => {
          const nodeWidth = typeof node.style?.width === 'number' ? node.style.width : 300;
          const nodeHeight = typeof node.style?.height === 'number' ? node.style.height : 200;
          
          return {
            ...node,
            position: {
              x: ((node.position?.x || 0) + 20000) / 50,  // 調整坐標到可見範圍
              y: ((node.position?.y || 0) + 15000) / 50
            },
            style: {
              ...node.style,
              width: Math.min(nodeWidth, 800),  // 限制最大寬度
              height: Math.min(nodeHeight, 600),  // 限制最大高度
              minHeight: 100,
            }
          };
        });
        
        setNodes(adjustedNodes);
      } catch (error) {
        console.error('Error loading canvas data:', error);
      }
    };
    
    loadData();
  }, [setNodes]);

  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target) {
      const newEdge = {
        id: `edge-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: 'custom',
        data: {
          label: '連接',
          style: {
            stroke: '#94a3b8',
            strokeWidth: 2,
          },
        },
      };
      setEdges((eds) => [...eds, newEdge as Edge]);
    }
  }, [setEdges]);

  // 記憶化節點類型和邊類型
  const memoizedNodeTypes = nodeTypes;
  const memoizedEdgeTypes = edgeTypes;

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
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        fitView
        style={{
          backgroundColor: 'var(--background-primary)'
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
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
