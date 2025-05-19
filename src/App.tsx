import { useState, useEffect, useCallback } from "react";
import Canvas from "./components/Canvas";
import type { Node, Edge, NodeChange, Connection } from 'reactflow';
import { applyNodeChanges, addEdge } from 'reactflow';

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 處理節點變更（包括拖動）
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  // 處理連線
  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  useEffect(() => {
    const loadCanvasData = async () => {
      try {
        const initialNodes = [
          {
            id: 'node1',
            type: 'textNode',
            position: { x: 10, y: 10 },
            data: {
              label: '# 當你透過 kubectl 或其他方式向 Kubernetes API 發送請求（例如創建一個 Pod）時，流程如下：\n\n1. **認證（Authentication）**：確認你是誰。\n2. **授權（Authorization）**：確認你有權限這麼做。\n3. **Admission Control**：在這裡，Admission Controllers 介入，根據啟用的控制器進行驗證或修改。\n4. **持久化**：如果通過上述步驟，請求才會被存入 etcd。'
            },
            style: {
              width: 200,
              backgroundColor: '#344361'
            }
          }, 
          {
            id: 'node2',
            type: 'textNode',
            position: { x: 1000, y: 100 },
            data: {
              label: '# 將流量轉發到對應的 Pod\n### KubeProxy 會根據 Service 的要求，將流量轉發到對應的後端的 Pod'
            },
            style: {
              width: 200,
              backgroundColor: '#344361'
            }
          },
          {
            id: 'imageNode1',
            type: 'imageNode',
            position: { x: 500, y: 300 },
            data: {
              url: 'https://picsum.photos/400/300',  // 使用一個示例圖片
              alt: 'Example Image'
            }
          }
        ];

        const initialEdges = [
          {
            id: 'edge1',
            type: 'custom',
            source: 'node1',
            target: 'node2',
            sourceHandle: 'right',
            targetHandle: 'left',
            style: {
              strokeWidth: 2
            },
            data: {
              config: {
                fontSize: 'normal',
                backgroundColor: 'primary',
                textColor: 'default'
              }
            },
            label: 'Connection between nodesqqqqqqq',
          },
          {
            id: 'edge2',
            type: 'custom',
            source: 'node1',
            target: 'imageNode1',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            style: {
              strokeWidth: 2
            },
            data: {
              config: {
                fontSize: 'normal',
                backgroundColor: 'secondary',
                textColor: 'default'
              }
            },
            label: 'Image Connection',
          }
        ];
        
        setNodes(initialNodes);
        setEdges(initialEdges);
      } catch (err) {
        console.error('Error loading canvas file:', err);
        setError('Failed to load canvas file. Please check the file path and content.');
      }
    };

    loadCanvasData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!nodes.length) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <Canvas 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onNodesUpdate={setNodes}
      />
    </div>
  );
}

export default App;
