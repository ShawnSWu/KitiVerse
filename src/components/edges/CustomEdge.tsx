import type { FC } from 'react';
import { getBezierPath } from 'reactflow';
import type { EdgeProps } from 'reactflow';
import edgeStyles from '../../config/edgeStyles.json';

// 定義配置類型
type FontSizeKey = keyof typeof edgeStyles.fontSizes;
type BackgroundColorKey = keyof typeof edgeStyles.backgroundColors;
type TextColorKey = keyof typeof edgeStyles.textColors;

interface EdgeConfig {
  fontSize: FontSizeKey;
  backgroundColor: BackgroundColorKey;
  textColor: TextColorKey;
  fontWeight: string;
  rx: number;
}

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
  data,
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

  // 獲取標籤設定
  const config: EdgeConfig = {
    ...edgeStyles.defaults,
    ...data?.config
  };

  // 獲取字體大小設定
  const fontSizeConfig = edgeStyles.fontSizes[config.fontSize];
  
  // 獲取背景顏色設定
  const backgroundColorConfig = edgeStyles.backgroundColors[config.backgroundColor];
  
  // 獲取文字顏色
  const textColor = edgeStyles.textColors[config.textColor];

  // 合併文字樣式
  const textStyle = {
    fontSize: fontSizeConfig.fontSize,
    fontWeight: config.fontWeight,
    fill: textColor,
    dominantBaseline: 'central' as const,
    textAnchor: 'middle' as const,
  };

  // 計算文字寬度（使用一個臨時的 text 元素）
  const getTextWidth = (text: string, fontSize: number): number => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = `${config.fontWeight} ${fontSize}px sans-serif`;
      return context.measureText(text).width;
    }
    return 0;
  };

  const textWidth = getTextWidth(label?.toString() || '', fontSizeConfig.fontSize);
  const padding = fontSizeConfig.padding;

  // 合併背景樣式
  const backgroundStyle = {
    ...backgroundColorConfig,
    width: textWidth + (padding * 2),
    height: fontSizeConfig.fontSize + (padding * 2),
    rx: config.rx,
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
      
      {/* 渲染標籤 */}
      {label && (
        <g transform={`translate(${(sourceX + targetX) / 2}, ${(sourceY + targetY) / 2})`}>
          {/* 背景 */}
          <rect
            x={-backgroundStyle.width / 2}
            y={-backgroundStyle.height / 2}
            {...backgroundStyle}
          />
          {/* 文字 */}
          <text
            style={textStyle}
            x={0}
            y={0}
          >
            {label}
          </text>
        </g>
      )}
    </>
  );
};

export default CustomEdge;
