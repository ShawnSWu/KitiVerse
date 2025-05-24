import { Handle, Position } from 'reactflow';
import type { NodeProps } from '@reactflow/core';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import './markdownNode.css';

export interface MarkdownNodeData {
  file?: string;
  content?: string;
  nodeType: string;
  label?: string;
  style?: React.CSSProperties;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
}

const MarkdownNode = ({ data }: NodeProps<MarkdownNodeData>) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkdownContent = async () => {
      try {
        // 如果直接提供了 content，則使用它
        if (data.content) {
          setContent(data.content);
          return;
        }

        // 如果提供了 file 路徑，則從文件加載
        if (data.file) {
          // 確保路徑以 public/ 開頭
          const filePath = data.file.startsWith('public/content/') 
            ? data.file 
            : `public/content/${data.file}`;
          
          console.log('Loading markdown from:', filePath);
          const response = await fetch(filePath);
          
          if (!response.ok) {
            throw new Error(`Failed to load markdown: ${response.status} ${response.statusText}`);
          }
          
          const text = await response.text();
          
          // 檢查是否是 HTML 響應（可能是 404 頁面）
          if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html>')) {
            throw new Error('Failed to load markdown: Received HTML response. Check if the file path is correct.');
          }
          
          setContent(text);
          setError(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load markdown content';
        console.error('Error loading markdown:', errorMessage);
        setError(errorMessage);
        setContent(`# Error

${errorMessage}

## File Path
\`${data.file || 'No file specified'}\``);
      }
    };

    loadMarkdownContent();
  }, [data.file, data.content]);

  // 合併默認樣式和傳入的樣式
  const nodeStyle = {
    background: 'var(--background-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '16px',
    minWidth: '200px',
    maxWidth: '800px',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    ...data.style, // 覆蓋默認樣式
  };

  return (
    <div
      className="markdown-node theme-dark"
      style={nodeStyle}
    >
      <Handle type="target" position={Position.Top} />
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="markdown-content theme-dark">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              h1: ({ ...props }) => <h1 className="markdown-h1" {...props} />,
              h2: ({ ...props }) => <h2 className="markdown-h2" {...props} />,
              h3: ({ ...props }) => <h3 className="markdown-h3" {...props} />,
              p: ({ ...props }) => <p className="markdown-p" {...props} />,
              a: ({ ...props }) => <a className="markdown-link" {...props} />,
              ul: ({ ...props }) => <ul className="markdown-ul" {...props} />,
              ol: ({ ...props }) => <ol className="markdown-ol" {...props} />,
              li: ({ ...props }) => <li className="markdown-li" {...props} />,
              blockquote: ({ ...props }) => (
                <blockquote className="markdown-blockquote" {...props} />
              ),
              table: ({ ...props }) => <table className="markdown-table" {...props} />,
              code: ({ inline, className, children, ...props }: CodeProps) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="markdown-code-block"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="markdown-inline-code" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

MarkdownNode.displayName = 'MarkdownNode';

export default MarkdownNode;
