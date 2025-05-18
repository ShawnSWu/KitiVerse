import React from "react";
import BaseNodeWithHandles from "./BaseNodeWithHandles";

interface TextNodeProps {
  data: {
    label: string;
  };
  style?: React.CSSProperties;
}

const TextNode: React.FC<TextNodeProps> = ({ data, style = {} }) => {
  return (
    <BaseNodeWithHandles style={style}>
      <div style={{
        color: style?.backgroundColor === '#FFFFFF' ? '#000' : '#fff',
        width: '100%',
        height: '100%',
        padding: '8px',
        overflow: 'hidden',
        wordBreak: 'break-word'
      }}>
        {data.label}
      </div>
    </BaseNodeWithHandles>
  );
};

export default TextNode;
