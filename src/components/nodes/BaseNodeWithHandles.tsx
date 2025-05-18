import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

type BaseNodeWithHandlesProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const BaseNodeWithHandles: React.FC<BaseNodeWithHandlesProps> = ({ children, style = {} }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width = 200, height = 100 } = style as { width?: number; height?: number };

  return (
    <div ref={containerRef} style={style}>
      {/* 左側 */}
      <div style={{ 
        position: 'absolute' as const,
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        width: 1,
        height: 1
      }}>
        <Handle type="target" position={Position.Left} id="left" />
      </div>

      {/* 右側 */}
      <div style={{ 
        position: 'absolute' as const,
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        width: 1,
        height: 1
      }}>
        <Handle type="source" position={Position.Right} id="right" />
      </div>

      {/* 上側 */}
      <div style={{ 
        position: 'absolute' as const,
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1,
        height: 1
      }}>
        <Handle type="source" position={Position.Top} id="top" />
      </div>

      {/* 下側 */}
      <div style={{ 
        position: 'absolute' as const,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1,
        height: 1
      }}>
        <Handle type="target" position={Position.Bottom} id="bottom" />
      </div>

      <div style={{ 
        width: '100%',
        height: '100%',
        position: 'relative' as const,
        padding: '10px'
      }}>
        {children}
      </div>
    </div>
  );
};

export default BaseNodeWithHandles;
