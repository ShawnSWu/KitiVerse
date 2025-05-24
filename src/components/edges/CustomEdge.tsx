import { BaseEdge, getBezierPath, useStore } from 'reactflow';
import type { EdgeProps } from '@reactflow/core';
import { useMemo } from 'react';

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

  // 獲取當前的縮放級別
  const zoom = useStore((state) => state.transform[2]);

  // 使用 useMemo 記憶化計算字體大小，只有當 zoom 變化時才重新計算
  const fontSize = useMemo(() => Math.min(20 / zoom, 20), [zoom]);

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd="url(#arrowhead)"
        style={{
          ...style,
          stroke: '#94a3b8',
          strokeWidth: 4,
        }}
      />
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
