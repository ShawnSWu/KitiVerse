import { memo, forwardRef, useCallback, useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import './ResizableNode.css';

interface ResizableNodeProps {
  id: string;
  children: React.ReactNode;
  width: number;
  height: number;
  onResize: (id: string, size: { width: number; height: number }) => void;
  style?: React.CSSProperties;
}

const ResizableNode = memo(forwardRef<HTMLDivElement, ResizableNodeProps>(({ 
  id, 
  width, 
  height, 
  onResize, 
  children, 
  style = {} 
}, ref) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [nodeSize, setNodeSize] = useState({ width, height });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  // 更新本地尺寸狀態，當外部props變化時
  useEffect(() => {
    if (!isResizing) {
      setNodeSize({ width, height });
    }
  }, [width, height, isResizing]);

  // 開始縮放
  const startResize = useCallback((e: React.MouseEvent) => {
    // 阻止事件冒泡，防止觸發節點拖動
    e.stopPropagation();
    e.preventDefault();
    
    // 設置縮放狀態和初始位置/尺寸
    setIsResizing(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setStartSize({ width: nodeSize.width, height: nodeSize.height });
    
    // 設置鼠標捕獲
    document.addEventListener('mousemove', handleResize, true);
    document.addEventListener('mouseup', endResize, true);
    
    // 禁用文本選擇
    document.body.style.userSelect = 'none';
  }, [nodeSize]);

  // 縮放過程
  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    // 阻止事件冒泡和默認行為
    e.stopPropagation();
    e.preventDefault();
    
    // 計算新的尺寸
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    
    const newWidth = Math.max(100, startSize.width + deltaX);
    const newHeight = Math.max(50, startSize.height + deltaY);
    
    // 更新本地尺寸狀態
    setNodeSize({ 
      width: newWidth, 
      height: newHeight 
    });
  }, [isResizing, startPosition, startSize]);

  // 結束縮放
  const endResize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    // 阻止事件冒泡和默認行為
    e.stopPropagation();
    e.preventDefault();
    
    // 移除事件監聽器
    document.removeEventListener('mousemove', handleResize, true);
    document.removeEventListener('mouseup', endResize, true);
    
    // 恢復文本選擇
    document.body.style.userSelect = '';
    
    // 通知父組件尺寸變化
    onResize(id, { 
      width: nodeSize.width, 
      height: nodeSize.height 
    });
    
    // 重置縮放狀態
    setIsResizing(false);
  }, [isResizing, id, nodeSize, onResize]);

  // 添加全局事件監聽
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize, true);
      window.addEventListener('mouseup', endResize, true);
      
      return () => {
        window.removeEventListener('mousemove', handleResize, true);
        window.removeEventListener('mouseup', endResize, true);
      };
    }
  }, [isResizing, handleResize, endResize]);

  return (
    <div 
      ref={(el) => {
        // 同時設置 forwardRef 和 local ref
        if (ref) {
          if (typeof ref === 'function') {
            ref(el);
          } else {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }
        }
        nodeRef.current = el;
      }}
      style={{ 
        position: 'relative',
        ...style,
        width: nodeSize.width,
        height: nodeSize.height,
      }}
      className={isResizing ? 'resizing' : ''}
    >
      <div 
        className="resizable-content"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {children}
        
        {/* 連接點 handles */}
        <Handle 
          type="source" 
          position={Position.Right} 
          id="right" 
        />
        <Handle 
          type="target" 
          position={Position.Left} 
          id="left" 
        />
        
        {/* 自定義縮放手柄 */}
        <div 
          className="resize-handle"
          onMouseDown={startResize}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
}));

const MemoizedResizableNode = memo(ResizableNode);

export default MemoizedResizableNode;
