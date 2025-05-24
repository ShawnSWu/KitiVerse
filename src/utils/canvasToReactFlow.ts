import type { Node } from 'reactflow';

// 定義 Canvas 節點的類型
type CanvasNode = {
  id: string;
  type: 'group' | 'text' | 'file';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  label?: string;
  text?: string;
  file?: string;
};

// 獲取文件擴展名
const getFileExtension = (filename: string): string | null => {
  const match = filename.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : null;
};

// 判斷是否為圖片文件
const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '');
};

// 判斷是否為 Markdown 文件
const isMarkdownFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ext === 'md' || ext === 'markdown';
};

// 轉換 Canvas 節點為 React Flow 節點
export const convertCanvasNode = (canvasNode: CanvasNode): Node => {
  // 基礎節點屬性
  const baseNode: any = {
    id: canvasNode.id,  // id => id
    position: { 
      x: canvasNode.x,  // x => position.x
      y: canvasNode.y   // y => position.y
    },
    data: {
      label: canvasNode.label || `Node ${canvasNode.type}`  // label => data.label
    },
    style: {
      width: canvasNode.width,  // width => style.width
      height: canvasNode.height,  // height => style.height
      ...(canvasNode.color && { bg_color: canvasNode.color }),  // color => style.bg_color
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
  };

  // 處理文件類型節點
  if (canvasNode.type === 'file' && canvasNode.file) {
    // 移除開頭的 public 或 /public 前綴（如果存在）
    let filePath = canvasNode.file.replace(/^\/?public\//, '');
    
    // 確保路徑不以 / 開頭，因為我們希望它是相對於 public 目錄的
    filePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    
    if (isMarkdownFile(canvasNode.file)) {
      // Markdown 文件處理
      console.log('Processing markdown file:', filePath);
      
      // 創建 React Flow 節點
      const node: Node = {
        id: canvasNode.id || `node-${Date.now()}`,
        type: 'markdown', // 這個類型必須與 App.tsx 中註冊的類型一致
        position: {
          x: canvasNode.x || 0,
          y: canvasNode.y || 0
        },
        data: {
          ...baseNode.data,
          file: filePath, // 這裡傳入相對路徑
          nodeType: 'markdown',
          label: canvasNode.label || (filePath ? filePath.split('/').pop() : 'Markdown') || 'Markdown',
          style: {
            width: canvasNode.width || 400,
            height: canvasNode.height || 300,
            padding: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }
        },
        style: {
          width: canvasNode.width || 400,
          height: canvasNode.height || 300
        }
      };
      
      return node;
    } else if (isImageFile(canvasNode.file)) {
      // 圖片文件處理
      return {
        ...baseNode,
        type: 'image',
        data: {
          ...baseNode.data,
          src: filePath,
          nodeType: 'image',
          label: canvasNode.label || filePath.split('/').pop() || 'Image'
        },
        style: {
          ...baseNode.style,
          padding: 0,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none'
        }
      };
    }
    // 其他文件類型保持默認處理
    return {
      ...baseNode,
      type: 'default',
      data: {
        ...baseNode.data,
        file: canvasNode.file,
        nodeType: 'file'
      }
    };
  }

  // 群組節點處理
  if (canvasNode.type === 'group') {
    return {
      ...baseNode,
      type: 'group',
      data: {
        ...baseNode.data,
        nodeType: 'group',
      },
      style: {
        ...baseNode.style,
        backgroundColor: canvasNode.color ? `${canvasNode.color}20` : 'rgba(200, 200, 200, 0.2)',
        border: `2px solid ${canvasNode.color || '#ccc'}`,
        padding: '20px',
      },
    };
  }

  return baseNode;
};

// 主轉換函數
export const convertCanvasToReactFlow = (canvasData: any) => {
  if (!canvasData?.nodes?.length) {
    return { nodes: [], edges: [] };
  }

  // 處理所有節點
  const processedNodes = canvasData.nodes.map((node: CanvasNode) => {
    // 處理文件路徑 - 確保路徑正確
    if (node.file) {
      // 如果路徑是相對路徑，轉換為相對於 public 目錄的路徑
      if (!node.file.startsWith('/') && !node.file.startsWith('http')) {
        node.file = `/${node.file}`;
      }
    }
    return convertCanvasNode(node);
  });

  // 找出每種節點類型的第一個實例（用於調試）
  const nodeTypes = new Set<string>();
  const sampleNodes: Node[] = [];

  for (const node of processedNodes) {
    if (!nodeTypes.has(node.type)) {
      nodeTypes.add(node.type);
      sampleNodes.push(node);
      
      // 如果已經找到三種節點類型，就停止
      if (nodeTypes.size === 3) break;
    }
  }

  console.log('Sample nodes:', sampleNodes);

  return {
    nodes: processedNodes,
    edges: canvasData.edges || []
  };
};

// 載入 Canvas 數據的函數
export const loadCanvasData = async (): Promise<{nodes: Node[]}> => {
  try {
    // 確保文件已經複製到 public 目錄下
    const canvasPath = '/content/Container/Kubernetes/Kubernetes Overview.canvas';
    console.log('Loading canvas from:', canvasPath);

    const response = await fetch(canvasPath);
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      console.error('Failed to load canvas data:', response.status, errorText);
      throw new Error(`Failed to load canvas data: ${response.status} ${response.statusText}`);
    }
    const canvasData = await response.json();
    console.log('Raw canvas data:', canvasData);
    const result = convertCanvasToReactFlow(canvasData);
    console.log('Converted nodes:', result.nodes);
    return result;
  } catch (error) {
    console.error('Failed to load canvas data:', error);
    return { nodes: [] };
  }
};
