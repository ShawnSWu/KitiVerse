import { BaseEdge, getBezierPath, useStore } from 'reactflow';
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

  // 獲取當前的縮放級別
  const zoom = useStore((state) => state.transform[2]);

  // 根據縮放級別計算文字大小（與縮放級別成反比）
  const fontSize = Math.min(20 / zoom, 20); // 最大字體大小為 20px

  // 輸出當前的縮放級別和字體大小
  console.log('Current zoom:', zoom, 'Font size:', fontSize);

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: '#94a3b8',
          strokeWidth: 4,
        }}
      />
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
