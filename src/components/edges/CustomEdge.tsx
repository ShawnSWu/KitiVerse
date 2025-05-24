import { getBezierPath, BaseEdge, EdgeLabelRenderer } from 'reactflow';
import { useStore } from '@reactflow/core';
import { useMemo } from 'react';

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  style?: React.CSSProperties;
  markerEnd?: string;
  data?: {
    label?: string;
  };
}

export default function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: Omit<CustomEdgeProps, 'id'>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // 獲取當前的縮放級別
  const zoom = useStore((state) => state.transform[2]);
  const fontSize = useMemo(() => Math.min(14 / zoom, 14), [zoom]);

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: style.stroke || '#94a3b8',
          strokeWidth: style.strokeWidth || 2,
        }}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '2px 8px',
              borderRadius: 5,
              fontSize: `${fontSize}px`,
              fontWeight: 500,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              pointerEvents: 'all',
              maxWidth: 200,
              textAlign: 'center',
            }}
            className="nodrag nopan"
          >
            {data.label.split('\n').map((line, i) => (
              <div key={i} style={{ lineHeight: '1.4' }}>
                {line}
              </div>
            ))}
          </div>
        </EdgeLabelRenderer>
      )}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#94a3b8"
          />
        </marker>
      </defs>
      {data?.label && (
        <g transform={`translate(${(sourceX + targetX) / 2}, ${(sourceY + targetY) / 2})`}>
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fill: '#ffffff',
              fontSize: `${fontSize}px`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              pointerEvents: 'all',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
              paintOrder: 'stroke',
              stroke: '#000000',
              strokeWidth: '4px',
            }}
          >
            {data.label}
          </text>
        </g>
      )}
    </>
  );
}
