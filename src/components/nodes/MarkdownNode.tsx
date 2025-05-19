import { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownNodeProps extends NodeProps {
  data: {
    file: string;
    nodeType: 'primary' | 'secondary' | 'accent' | 'default';
  };
}

const MarkdownNode = memo(({ data, isConnectable }: MarkdownNodeProps) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(data.file);
        if (!response.ok) {
          throw new Error(`Failed to fetch markdown file: ${response.statusText}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load markdown file');
      }
    };

    if (data.file) {
      fetchMarkdown();
    }
  }, [data.file]);

  const getBorderColor = () => {
    switch (data.nodeType) {
      case 'primary':
        return 'var(--primary)';
      case 'secondary':
        return 'var(--secondary)';
      case 'accent':
        return 'var(--accent)';
      default:
        return 'var(--border-color)';
    }
  };

  return (
    <div 
      className="markdown-node" 
      style={{ 
        cursor: 'move',
        backgroundColor: 'var(--background-light)',
        border: `1px solid ${getBorderColor()}`,
        borderRadius: 'var(--border-radius-md)',
        padding: 'var(--spacing-md)',
        boxShadow: 'var(--shadow-sm)',
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--font-size-md)',
        transition: 'var(--transition-normal)'
      }}
    >
      {/* 頂部連接點 */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ 
          background: 'var(--border-color)',
          width: 6,
          height: 6,
          transition: 'var(--transition-fast)'
        }}
      />
      
      {/* 右側連接點 */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ 
          background: 'var(--border-color)',
          width: 6,
          height: 6,
          transition: 'var(--transition-fast)'
        }}
      />
      
      {/* 底部連接點 */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ 
          background: 'var(--border-color)',
          width: 6,
          height: 6,
          transition: 'var(--transition-fast)'
        }}
      />
      
      {/* 左側連接點 */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ 
          background: 'var(--border-color)',
          width: 6,
          height: 6,
          transition: 'var(--transition-fast)'
        }}
      />

      <div className="markdown-content" style={{ color: 'var(--text-primary)' }}>
        {error ? (
          <div className="error-message" style={{ color: 'var(--color-red)' }}>{error}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                return (
                  <code 
                    className={className} 
                    {...props}
                    style={{
                      backgroundColor: 'var(--background-medium)',
                      color: 'var(--text-primary)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontFamily: 'var(--font-family)'
                    }}
                  >
                    {children}
                  </code>
                );
              },
              h1: ({ children }) => (
                <h1 style={{ 
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-xl)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 style={{ 
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-lg)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p style={{ 
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--spacing-md)',
                  lineHeight: 1.6
                }}>
                  {children}
                </p>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
});

export default MarkdownNode;
