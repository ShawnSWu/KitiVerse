import { BaseEdge, getBezierPath } from 'reactflow';
import type { EdgeProps } from '@reactflow/core';

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
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: '#94a3b8',
          strokeWidth: 2,
        }}
      />
      {data?.label && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill: '#64748b',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            pointerEvents: 'all',
          }}
        >
          {data.label}
        </text>
      )}
    </>
  );
}
