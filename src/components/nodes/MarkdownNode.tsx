import { Handle, Position } from 'reactflow';
import type { NodeProps } from '@reactflow/core';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './markdownNode.css';

interface MarkdownNodeData {
  file?: string;
  content?: string;
  nodeType: string;  // 更新為 string 類型以匹配 convertCanvasNode 中的值
  label?: string;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
}

export default function MarkdownNode({ data }: NodeProps<MarkdownNodeData>) {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      // 如果沒有提供文件路徑，則使用 content 屬性（如果存在）
      if (!data.file) {
        if (data.content) {
          setContent(data.content);
          setError(null);
        } else {
          setError('No file path or content provided');
        }
        return;
      }

      try {
        // 確保文件路徑格式正確
        let filePath = data.file;
        if (!filePath.startsWith('/') && !filePath.startsWith('http')) {
          filePath = `/${filePath}`;
        }
        
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
        setContent('');
      }
    };

    fetchContent();
  }, [data.file, data.content]);

  const getNodeBackground = () => {
    switch (data.nodeType) {
      case 'primary':
        return 'var(--background-primary)';
      case 'secondary':
        return 'var(--background-secondary)';
      default:
        return 'var(--background-primary)';
    }
  };

  return (
    <div
      className="markdown-node theme-dark"
      style={{
        background: getNodeBackground(),
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '200px',
        maxWidth: '800px',
      }}
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
              a: ({ ...props }) => <a className="markdown-link" {...props} />,
              ul: ({ ...props }) => <ul className="markdown-ul" {...props} />,
              ol: ({ ...props }) => <ol className="markdown-ol" {...props} />,
              li: ({ ...props }) => <li className="markdown-li" {...props} />,
              blockquote: ({ ...props }) => (
                <blockquote className="markdown-blockquote" {...props} />
              ),
              table: ({ ...props }) => <table className="markdown-table" {...props} />,
              th: ({ ...props }) => <th className="markdown-th" {...props} />,
              td: ({ ...props }) => <td className="markdown-td" {...props} />,
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
