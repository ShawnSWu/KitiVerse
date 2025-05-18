import React, { useRef } from "react";
import ReactMarkdown from 'react-markdown';
import BaseNodeWithHandles from "./BaseNodeWithHandles";
import { useAutoResize } from "../../hooks/useAutoResize";

const markdownComponents = {
  h1: ({node, ...props}: any) => <h1 style={{fontSize: '1.5em', margin: '0.5em 0'}} {...props} />,
  h2: ({node, ...props}: any) => <h2 style={{fontSize: '1.3em', margin: '0.4em 0'}} {...props} />,
  p: ({node, ...props}: any) => <p style={{margin: '0.5em 0'}} {...props} />,
  ul: ({node, ...props}: any) => <ul style={{margin: '0.5em 0', paddingLeft: '1.5em'}} {...props} />,
  ol: ({node, ...props}: any) => <ol style={{margin: '0.5em 0', paddingLeft: '1.5em'}} {...props} />,
  li: ({node, ...props}: any) => <li style={{margin: '0.25em 0'}} {...props} />,
  strong: ({node, ...props}: any) => <strong style={{fontWeight: 'bold'}} {...props} />,
  em: ({node, ...props}: any) => <em style={{fontStyle: 'italic'}} {...props} />,
  code: ({node, ...props}: any) => (
    <code style={{
      backgroundColor: 'rgba(255,255,255,0.1)', 
      padding: '0.2em 0.4em',
      borderRadius: '3px',
      fontFamily: 'monospace',
      fontSize: '0.9em'
    }} {...props} />
  )
};

interface MarkdownNodeProps {
  id: string;
  data: {
    label: string;
  };
  style?: React.CSSProperties;
  selected?: boolean;
}

const MarkdownNode: React.FC<MarkdownNodeProps> = ({ data, style = {}, selected = false }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 設置自適應卡片的極限值
  const MIN_WIDTH = 150;   // 最小寬度
  const MIN_HEIGHT = 80;   // 最小高度
  const MAX_WIDTH = 500;   // 最大寬度
  const MAX_HEIGHT = 400;  // 最大高度
  
  // 使用 useAutoResize hook 來自動調整尺寸
  const initialWidth = style.width ? Number(style.width) : 200;
  const initialHeight = 100; // 初始高度
  const autoSize = useAutoResize(
    contentRef,    // 內容元素的引用
    initialWidth,  // 初始寬度
    initialHeight, // 初始高度
    MIN_WIDTH,     // 最小寬度
    MIN_HEIGHT,    // 最小高度
    MAX_WIDTH,     // 最大寬度
    MAX_HEIGHT     // 最大高度
  );
  
  // 基礎節點樣式
  const nodeStyle = {
    backgroundColor: style.backgroundColor || '#344361',
    color: style.color || '#fff',
    padding: '12px',
    borderRadius: '8px',
    boxShadow: selected ? '0 0 0 2px #6366f1' : '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    ...style,
    // 確保寬高使用自動計算的尺寸
    width: autoSize.width,
    height: autoSize.height
  };

  // 內容容器樣式
  const contentStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '100%',
    overflow: 'hidden',
    wordBreak: 'break-word' as const,
    lineHeight: 1.6,
    padding: '10px',
    boxSizing: 'border-box',
    color: style.color || (style.backgroundColor === '#FFFFFF' ? '#000' : '#fff')
  };

  return (
    <BaseNodeWithHandles style={{
      ...nodeStyle,
      position: 'relative',  // 確保連接點相對於節點定位
      boxSizing: 'border-box',  // 確保 padding 和 border 包含在元素尺寸內
      display: 'inline-block',  // 確保元素正確包裹內容
      width: 'auto',  // 讓寬度由內容決定
      height: 'auto', // 讓高度由內容決定
      minWidth: style.minWidth,
      minHeight: style.minHeight
    }}>
      <div ref={contentRef} style={contentStyle}>
        <ReactMarkdown 
          components={{
            ...markdownComponents,
            pre: ({node, ...props}: any) => (
              <pre style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '1em',
                borderRadius: '4px',
                overflowX: 'auto',
                margin: '0.75em 0'
              }} {...props} />
            ),
            blockquote: ({node, ...props}: any) => (
              <blockquote style={{
                borderLeft: '3px solid #ccc',
                margin: '0.5em 0',
                paddingLeft: '1em',
                color: style?.backgroundColor === '#FFFFFF' ? '#555' : '#ddd'
              }} {...props} />
            ),
            a: ({node, ...props}: any) => (
              <a 
                style={{
                  color: '#60a5fa',
                  textDecoration: 'none'
                }} 
                target="_blank" 
                rel="noopener noreferrer" 
                {...props} 
              />
            )
          }}
        >
          {data.label}
        </ReactMarkdown>
      </div>
    </BaseNodeWithHandles>
  );
};

export default MarkdownNode;
