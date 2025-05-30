import { Handle, Position } from 'reactflow';
import { memo } from 'react';

type BasicNodeProps = {
  data: {
    label: string;
    description?: string;
  };
  selected?: boolean;
};

const BasicNode = ({ data, selected }: BasicNodeProps) => {
  return (
    <div 
      className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <div className="flex">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          {data.description && (
            <div className="text-gray-500">{data.description}</div>
          )}
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  );
};

export default memo(BasicNode);
