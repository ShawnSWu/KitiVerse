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
        const { nodes: loadedNodes, edges: loadedEdges } = await loadCanvasData();
        console.log('Loaded nodes:', loadedNodes);
        console.log('Loaded edges:', loadedEdges);
        
        // 計算節點位置，確保有足夠的間距
        const NODE_PADDING = 100; // 節點之間的間距
        const BASE_X = 100; // 起始 X 坐標
        const BASE_Y = 100; // 起始 Y 坐標
        const COLUMN_WIDTH = 400; // 每列的寬度
        const ROW_HEIGHT = 300; // 每行的高度
        
        // 計算節點應該在哪一行哪一列
        const adjustedNodes = loadedNodes.map((node, index) => {
          const nodeWidth = typeof node.style?.width === 'number' ? node.style.width : 300;
          const nodeHeight = typeof node.style?.height === 'number' ? node.style.height : 200;
          
          // 計算行號和列號
          const column = Math.floor(index / 5); // 每行最多5個節點
          const row = index % 5;
          
          // 計算節點位置
          const x = BASE_X + (column * (COLUMN_WIDTH + NODE_PADDING));
          const y = BASE_Y + (row * (ROW_HEIGHT + NODE_PADDING));
          
          // 創建新的節點對象
          const newNode = {
            ...node,
            position: {
              x: node.position?.x ? node.position.x : x,
              y: node.position?.y ? node.position.y : y
            },
            style: {
              ...node.style,
              width: Math.min(nodeWidth, 800),
              height: Math.min(nodeHeight, 600),
              minHeight: '100px',
              minWidth: '200px',
              padding: '10px',
              backgroundColor: node.style?.backgroundColor || 'var(--background-primary)'
            }
          };
          
          return newNode;
        });
        
        console.log('Adjusted nodes:', adjustedNodes);
        setNodes(adjustedNodes);
        
        // 設置邊緣
        if (loadedEdges && loadedEdges.length > 0) {
          console.log('Setting edges:', loadedEdges);
          setEdges(loadedEdges);
        }
      } catch (error) {
        console.error('Failed to load canvas data:', error);
      }
    };
    
    loadData();
  }, [setNodes, setEdges]);

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
        style={{
          backgroundColor: 'var(--background-primary)'
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        fitViewOptions={{
          padding: 0.2,  // 增加內邊距，讓視覺更舒適
          includeHiddenNodes: false,
          minZoom: 0.1,  // 允許更小的縮放級別
          maxZoom: 4,    // 最大縮放級別
          duration: 1000  // 動畫過渡時間
        }}
        minZoom={0.05}   // 允許縮小到 5%
        maxZoom={4}     // 最大縮放到 400%
        nodesDraggable={true}
        nodesConnectable={true}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
      >
        <Background 
          gap={32}  // 增大網格間距
          size={1}  // 減小網格線粗細
          style={{
            backgroundColor: 'var(--background-primary)',
          }}
          variant={'dots' as const}  // 明確指定為字面量類型
          color="var(--background-modifier-border)"
          className="canvas-background"
        />
        {/* 添加自定義樣式來優化網格外觀 */}
        <style>
          {`
            .react-flow__background {
              background-color: var(--background-primary) !important;
            }
            .react-flow__background-dots {
              stroke: var(--background-modifier-border) !important;
              stroke-width: 1px !important;
            }
            
            /* 優化卡片樣式 */
            .react-flow__node {
              background: var(--background-primary);
              border: 1px solid var(--background-modifier-border);
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              transition: box-shadow 0.2s ease, border-color 0.2s ease;
            }
            
            .react-flow__node:hover {
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
              border-color: var(--interactive-accent);
            }
            
            /* 優化連接線樣式 */
            .react-flow__edge-path {
              stroke: var(--background-modifier-border);
              stroke-width: 2px;
            }
            
            .react-flow__edge.selected .react-flow__edge-path {
              stroke: var(--interactive-accent);
            }
            
            /* 優化控制欄樣式 */
            .react-flow__controls {
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
              border: 1px solid var(--background-modifier-border);
              background: var(--background-primary);
            }
            
            .react-flow__controls-button {
              background: var(--background-primary);
              border-bottom: 1px solid var(--background-modifier-border);
              color: var(--text-normal);
            }
            
            .react-flow__controls-button:hover {
              background: var(--background-modifier-hover);
            }
          `}
        </style>
        <Controls 
          style={{ 
            backgroundColor: 'var(--background-secondary)',
            border: '1px solid var(--background-modifier-border)',
            borderRadius: 'var(--radius-m)',
          }} 
        />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'input') return 'var(--interactive-accent)';
            if (n.type === 'output') return 'var(--text-error)';
            if (n.type === 'default') return 'var(--background-modifier-border)';
            return 'var(--text-muted)';
          }}
          nodeBorderRadius={4}
          nodeStrokeWidth={1}
          nodeStrokeColor="var(--background-modifier-border)"
          maskColor="rgba(0, 0, 0, 0.2)"
          style={{
            backgroundColor: 'var(--background-primary)',
            border: '1px solid var(--background-modifier-border)',
            borderRadius: '4px',
            opacity: 0.9,
            transition: 'opacity 0.2s ease',
            transform: 'scale(0.8)',
            transformOrigin: 'bottom right',
            margin: '0 8px 8px 0'
          }}
          className="minimap"
          zoomable
          pannable
          zoomStep={0.5}
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
}

export default App;
