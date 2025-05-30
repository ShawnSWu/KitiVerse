import MarkdownNode from '../components/nodes/MarkdownNode';
import CustomEdge from '../components/edges/CustomEdge';
import ImageNode from '../components/nodes/ImageNode';

// 節點類型
export const nodeTypes = {
  textNode: MarkdownNode,  // 保持使用 textNode 作為節點類型，以保持向後兼容性
  imageNode: ImageNode
};

// 邊緣類型
export const edgeTypes = {
  custom: CustomEdge
};
