import React, { useState, useCallback, useEffect } from 'react';
import './SimpleResizable.css';

interface SimpleResizableProps {
  width: number;
  height: number;
  onResize: (size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

export default function SimpleResizable({ 
  width: initialWidth, 
  height: initialHeight,
  onResize,
  children 
}: SimpleResizableProps) {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // 更新本地狀態，如果外部props改變
  useEffect(() => {
    if (!isResizing) {
      setSize({ width: initialWidth, height: initialHeight });
    }
  }, [initialWidth, initialHeight, isResizing]);

  // 處理鼠標按下事件
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('Resize started');
    
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    
    document.body.style.userSelect = 'none';
  }, [size]);

  // 處理鼠標移動事件
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    console.log('Resizing');
    
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    const newWidth = Math.max(100, resizeStart.width + deltaX);
    const newHeight = Math.max(50, resizeStart.height + deltaY);
    
    setSize({ width: newWidth, height: newHeight });
  }, [isResizing, resizeStart]);

  // 處理鼠標釋放事件
  const handleMouseUp = useCallback(() => {
    if (!isResizing) return;
    
    console.log('Resize ended');
    
    setIsResizing(false);
    document.body.style.userSelect = '';
    onResize(size);
  }, [isResizing, onResize, size]);

  // 添加和移除全局事件監聽器
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove, { capture: true });
      window.addEventListener('mouseup', handleMouseUp, { capture: true });
      return () => {
        window.removeEventListener('mousemove', handleMouseMove, { capture: true });
        window.removeEventListener('mouseup', handleMouseUp, { capture: true });
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div 
      className={`simple-resizable ${isResizing ? 'resizing' : ''}`}
      style={{ 
        width: size.width, 
        height: size.height 
      }}
    >
      {children}
      <div 
        className="resize-handle"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
