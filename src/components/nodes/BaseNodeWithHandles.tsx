import React, { useRef } from 'react';
import { Handle, Position } from 'react-flow-renderer';

type BaseNodeWithHandlesProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const BaseNodeWithHandles: React.FC<BaseNodeWithHandlesProps> = ({ children, style = {} }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={nodeRef}
      style={{
        position: 'relative',
        width: style.width || 200,
        minWidth: 100,
        minHeight: 40,
        height: style.height || 'auto',
        backgroundColor: style.backgroundColor || '#344361',
        borderRadius: style.borderRadius || 8,
        padding: style.padding || '12px',
        boxShadow: style.boxShadow || '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        color: style.color || '#fff'
      }}
    >
      {/* 左側 Handle */}
      <div style={{ 
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        width: 1,
        height: 1
      }}>
        <Handle type="target" position={Position.Left} id="left" />
      </div>

      {/* 右側 Handle */}
      <div style={{ 
        position: 'absolute',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        width: 1,
        height: 1
      }}>
        <Handle type="source" position={Position.Right} id="right" />
      </div>

      {/* 上側 Handle */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1,
        height: 1
      }}>
        <Handle type="source" position={Position.Top} id="top" />
      </div>

      {/* 下側 Handle */}
      <div style={{ 
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1,
        height: 1
      }}>
        <Handle type="target" position={Position.Bottom} id="bottom" />
      </div>

      {children}
    </div>
  );
};

export default BaseNodeWithHandles;
