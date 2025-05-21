import { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './markdownNode.css';

interface MarkdownNodeProps {
  data: {
    file: string;
    nodeType?: 'primary' | 'secondary' | 'tertiary';
  };
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
}

const getNodeBackground = (nodeType?: string) => {
  switch (nodeType) {
    case 'primary':
      return 'var(--background-primary)';
    case 'secondary':
      return 'var(--background-secondary)';
    case 'tertiary':
      return 'var(--background-secondary-alt)';
    default:
      return 'var(--background-secondary)';
  }
};

const MarkdownNode = memo(({ data }: MarkdownNodeProps) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(data.file);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        setContent('');
      }
    };

    fetchContent();
  }, [data.file]);

  const nodeBackground = getNodeBackground(data.nodeType);

  return (
    <div
      className="markdown-node theme-dark"
      style={{ backgroundColor: nodeBackground }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="node-handle"
      />
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
      <Handle
        type="source"
        position={Position.Right}
        className="node-handle"
      />
    </div>
  );
});

MarkdownNode.displayName = 'MarkdownNode';

export default MarkdownNode;
