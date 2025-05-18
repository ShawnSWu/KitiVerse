import type { FC } from 'react';
import { getBezierPath } from 'react-flow-renderer';
import type { EdgeProps } from 'react-flow-renderer';

const CustomEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
  markerEnd,
}) => {
  // 計算連接線路徑
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // 邊緣線樣式
  const edgeStyle = {
    stroke: '#6366f1',
    strokeWidth: 2,
    ...style,
  };

  return (
    <>
      {/* 渲染邊緣線 */}
      <path
        id={id}
        style={edgeStyle}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      
      {/* 渲染標籤 - 直接在中間位置顯示 */}
      {label && (
        <text
          style={{
            fontSize: 16,
            fontWeight: 700,
            fill: 'white',
            dominantBaseline: 'central',
            textAnchor: 'middle',
          }}
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2}
          dy={-10}
        >
          <tspan
            style={{
              fontSize: 16,
              fontWeight: 700,
              fill: 'white',
            }}
            dx={-10}
            dy={0}
          >
            {label}
          </tspan>
          <rect
            x={(sourceX + targetX) / 2 - 60}
            y={(sourceY + targetY) / 2 - 15}
            width={120}
            height={30}
            rx={4}
            fill="rgba(0, 0, 0, 0.7)"
            stroke="none"
          />
        </text>
      )}
    </>
  );
};

export default CustomEdge;
