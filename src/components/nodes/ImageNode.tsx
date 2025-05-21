// src/components/nodes/ImageNode.tsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from '@reactflow/core';

interface ImageNodeData {
  label: string;
  imagePath: string;
  contentFolder?: string;
}

export default function ImageNode({ data }: NodeProps<ImageNodeData>) {
  // 構建圖片路徑
  const imageUrl = data.contentFolder 
    ? `./src/content/${data.contentFolder}/attachments/${data.imagePath}`
    : `./src/content/attachments/${data.imagePath}`;

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
            console.error('Image load error:', imageUrl);
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="image-label">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
