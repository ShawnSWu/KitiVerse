// src/components/nodes/ImageNode.tsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from '@reactflow/core';

interface ImageNodeData {
  label: string;
  src: string;  // 使用 src 而不是 imagePath
  nodeType: string;
}

export default function ImageNode({ data }: NodeProps<ImageNodeData>) {
  // 直接使用 src 作為圖片路徑
  const imageUrl = data.src.startsWith('http') || data.src.startsWith('/')
    ? data.src
    : `/${data.src}`;  // 確保是絕對路徑

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
            console.error('Image load error:', imageUrl, data);
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="image-label">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
