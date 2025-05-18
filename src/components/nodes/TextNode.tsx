import React, { useRef, useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import BaseNodeWithHandles from "./BaseNodeWithHandles";

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

interface TextNodeProps {
  id: string;
  data: {
    label: string;
  };
  style?: React.CSSProperties;
  selected?: boolean;
}

const TextNode: React.FC<TextNodeProps> = ({ id, data, style = {}, selected = false }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 使用傳入的樣式，如果沒有則使用默認值
  const nodeStyle = {
    width: style.width || 200,
    height: style.height || 'auto',
    ...style
  };

  return (
    <BaseNodeWithHandles 
      style={{
        ...nodeStyle,
        padding: '12px',
        borderRadius: '8px',
        boxShadow: selected ? '0 0 0 2px #6366f1' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        ref={contentRef}
        style={{
          color: style?.backgroundColor === '#FFFFFF' ? '#000' : '#fff',
          width: '100%',
          minHeight: '100%',
          overflow: 'hidden',
          wordBreak: 'break-word',
          lineHeight: 1.6,
          padding: '10px',
          boxSizing: 'border-box'
        }}
      >
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

export default TextNode;
