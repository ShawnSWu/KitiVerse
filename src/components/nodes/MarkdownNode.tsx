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

  return (
    <div className="markdown-node">
      {/* 頂部連接點 */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      {/* 右側連接點 */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      
      {/* 底部連接點 */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      
      {/* 左側連接點 */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <div className="markdown-content">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
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
