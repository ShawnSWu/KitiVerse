// src/components/nodes/ImageNode.tsx
import React from 'react';
import type { NodeProps } from 'react-flow-renderer';

export default function ImageNode({ data }: NodeProps) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, width: 160, height: 120 }}>
      <img src={data.url} alt={data.alt || 'image'} style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );
}
