import React, { useState, useRef } from 'react';
import { Handle, Position } from 'react-flow-renderer';

type BaseNodeWithHandlesProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const BaseNodeWithHandles: React.FC<BaseNodeWithHandlesProps> = ({ children, style = {} }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  
  const showHandles = isHovered || isSelected;
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  // 當節點被選中或取消選中時更新狀態
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(prev => !prev);
  };
  const nodeRef = useRef<HTMLDivElement>(null);

  // 基礎樣式
  const baseStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: '#344361',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  };

  // 合併樣式，確保傳入的樣式可以覆蓋基礎樣式
  const combinedStyle = {
    ...baseStyle,
    ...style
  };

  return (
    <div 
      ref={nodeRef}
      className="base-node"
      style={combinedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* 左側 Handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left" 
        style={{
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#555',
          width: 12,
          height: 12,
          border: '2px solid #fff',
          zIndex: 100,
          opacity: showHandles ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: showHandles ? 'auto' : 'none'
        }}
      />

      {/* 右側 Handle - 確保它在節點正確的右邊緣 */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right" 
        style={{
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#555',
          width: 12,
          height: 12,
          border: '2px solid #fff',
          zIndex: 100,
          opacity: showHandles ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: showHandles ? 'auto' : 'none'
        }}
      />

      {/* 上側 Handle */}
      <Handle 
        type="source" 
        position={Position.Top} 
        id="top" 
        style={{
          top: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#555',
          width: 12,
          height: 12,
          border: '2px solid #fff',
          zIndex: 100,
          opacity: showHandles ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: showHandles ? 'auto' : 'none'
        }}
      />

      {/* 下側 Handle */}
      <Handle 
        type="target" 
        position={Position.Bottom} 
        id="bottom" 
        style={{
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#555',
          width: 12,
          height: 12,
          border: '2px solid #fff',
          zIndex: 100,
          opacity: showHandles ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: showHandles ? 'auto' : 'none'
        }}
      />

      {children}
    </div>
  );
};

export default BaseNodeWithHandles;
