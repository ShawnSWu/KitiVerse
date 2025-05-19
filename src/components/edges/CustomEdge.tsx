import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

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
          stroke: 'var(--border-color)',
          strokeWidth: 1,
        }}
      />
      {data?.label && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill: 'var(--text-secondary)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family)',
            pointerEvents: 'all',
          }}
        >
          {data.label}
        </text>
      )}
    </>
  );
}
