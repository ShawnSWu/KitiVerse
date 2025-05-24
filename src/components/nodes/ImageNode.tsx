import { Handle, Position } from 'reactflow';
import type { NodeProps } from '@reactflow/core';

interface ImageNodeData {
  label: string;
  src: string;
  nodeType: string;
}

export default function ImageNode({ data }: NodeProps<ImageNodeData>) {
  // 處理圖片路徑
  const getImageUrl = (src: string) => {
    // 如果已經是完整 URL 或絕對路徑（以 / 開頭）
    if (src.startsWith('http') || src.startsWith('/')) {
      return src;
    }
    
    // 處理沒有前導斜杠的路徑
    const normalizedSrc = src.startsWith('/') ? src : `/${src}`;
    
    // 如果路徑中已經包含 attachments，直接使用
    if (normalizedSrc.includes('attachments/')) {
      return normalizedSrc;  // 例如: /Container/Kubernetes/attachments/example.png
    }
    
    // 如果路徑中沒有 attachments，嘗試添加
    const pathParts = normalizedSrc.split('/');
    const fileName = pathParts.pop();
    return `${pathParts.join('/')}/attachments/${fileName}`;
  };
  
  const imageUrl = `../content/${getImageUrl(data.src)}`;

  return (
    <div className="image-node">
      <Handle type="target" position={Position.Top} />
      <div className="image-container">
        <img 
          src={imageUrl}
          alt={data.label}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            objectFit: 'cover'
          }}
          onError={(e) => {
            console.error('Image load error:', `../content${imageUrl}`, `${data}`);
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="image-label">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
