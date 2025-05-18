import type { Node, Edge } from 'reactflow';

interface CustomNode {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  label?: string;
  text?: string;
  file?: string;
}

interface CustomEdge {
  id: string;
  fromNode: string;
  toNode: string;
  fromSide?: string;
  toSide?: string;
  label?: string;
}

// Node mapping
export function toFlowNode(rawJsonNode: CustomNode): Node {
  const nodeType = rawJsonNode.type === 'text' ? 'textNode' : rawJsonNode.type;
  
  return {
    id: rawJsonNode.id,
    type: nodeType,
    position: { x: rawJsonNode.x, y: rawJsonNode.y },
    data: {
      ...rawJsonNode,
      content: rawJsonNode.text || rawJsonNode.file || rawJsonNode.label || '',
      isText: rawJsonNode.type === 'text'
    },
    style: {
      width: rawJsonNode.width,
      height: rawJsonNode.height,
      backgroundColor: rawJsonNode.color || 'transparent',
    },
  };
}

// Edge mapping
export function toFlowEdge(rawJsonEdge: CustomEdge): Edge {
  return {
    id: rawJsonEdge.id,
    source: rawJsonEdge.fromNode,
    target: rawJsonEdge.toNode,
    sourceHandle: rawJsonEdge.fromSide,
    targetHandle: rawJsonEdge.toSide,
    markerStart: rawJsonEdge.toSide === 'top' ? 'arrowclosed' : undefined,
    markerEnd: rawJsonEdge.fromSide === 'bottom' ? 'arrowclosed' : undefined,
    label: rawJsonEdge.label,
    style: {
      strokeWidth: 2,
    },
    data: { ...rawJsonEdge },
  };
}

// Convert entire graph
export function convertToReactFlowGraph(nodes: CustomNode[], edges: CustomEdge[]) {
  return {
    nodes: nodes.map(toFlowNode),
    edges: edges.map(toFlowEdge),
  };
}