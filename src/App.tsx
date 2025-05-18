import React, { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import { convertToReactFlowGraph, toFlowNode, toFlowEdge } from "./utils/mappingUtils";
import { readCanvasFile } from "./utils/fileUtils";
import type { Node, Edge } from 'react-flow-renderer';
import { Position } from 'react-flow-renderer';
function App() {
  const [nodes, setNodes] = useState<Node[]>([] as Node[]);
  const [edges, setEdges] = useState<Edge[]>([] as Edge[]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCanvasData = async () => {
      try {
        const nodes = [
          {
            id: 'node1',
            type: 'textNode',
            position: { x: 100, y: 100 },
            data: {
              label: '# Title\n\nDescription\n\n- Feature 1\n- Feature 2\n\n**Important**: Note'
            },
            style: {
              width: 200,
              height: 1000,
              backgroundColor: '#000000'
            }
          },
          {
            id: 'node2',
            type: 'textNode',
            position: { x: 1000, y: 100 },
            data: {
              label: '# Title 2\n\nDescription 2\n\n- Feature 1\n- Feature 2\n\n**Important**: Note 2'
            },
            style: {
              width: 1500,
              height: 200,
              backgroundColor: '#FFFFFF'
            }
          }
        ];

        const edges = [
          {
            id: 'edge1',
            source: 'node1',
            target: 'node2',
            sourceHandle: Position.Right as Position,
            targetHandle: Position.Left as Position,  
            style: {
              strokeWidth: 2
            },
            label: 'Connection between nodes'
          }
        ];
        
        setNodes(nodes);
        setEdges(edges);
      } catch (err) {
        console.error('Error loading canvas file:', err);
        setError('Failed to load canvas file. Please check the file path and content.');
      }
    };

    loadCanvasData();
  }, []); // Empty dependency array means this runs once on mount

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!nodes.length) {
    return <div className="loading">Loading...</div>;
  }

  return <Canvas nodes={nodes} edges={edges} />;

function App() {
  const [nodes, setNodes] = useState<Node[]>([] as Node[]);
  const [edges, setEdges] = useState<Edge[]>([] as Edge[]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCanvasData = async () => {
      try {

        const nodes = [
          {
            id: 'node1',
            type: 'textNode',
            position: { x: 100, y: 0 },
            data: {
              label: '# Title\n\nDescription\n\n- Feature 1\n- Feature 2\n\n**Important**: Note'
            },
            style: {
              width: 200,
              height: 10,
              backgroundColor: '#000000'
            }
          },
          {
            id: 'node2',
            type: 'textNode',
            position: { x: 0, y: 100 },
            data: {
              label: '# Title 2\n\nDescription 2\n\n- Feature 1\n- Feature 2\n\n**Important**: Note 2'
            },
            style: {
              width: 200,
              height: 10,
              backgroundColor: '#FFFFFF'
            }
          }
        ];

        const edges = [
          {
            id: 'edge1',
            source: 'node1',
            target: 'node2',

            sourceHandle: Position.Right as Position,
            targetHandle: Position.Left as Position,  
            style: {
              strokeWidth: 1
            },
            
            label: 'Connection between nodes'
          }
        ];
        
        setNodes(nodes);
        setEdges(edges);
        // setError(null);
      } catch (err) {
        console.error('Error loading canvas file:', err);
        setError('Failed to load canvas file. Please check the file path and content.');
      }
    };

    loadCanvasData();
  }, []); // Empty dependency array means this runs once on mount


  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!nodes.length) {
    return <div className="loading">Loading...</div>;
  }

  return <Canvas nodes={nodes} edges={edges} />;
}
}
export default App;
