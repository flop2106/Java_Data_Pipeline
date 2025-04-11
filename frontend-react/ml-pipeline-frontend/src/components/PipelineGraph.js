// src/components/PipelineGraph.js
import React, { useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';
import ConfigurationPanel from './ConfigurationPanel';

const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { label: 'CSVDatabase', config: { csvPath: 'src/main/resources/static/temp.csv' } },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'default',
    data: {
      label: 'PythonScript',
      nodeName: 'My Python Script',
      config: {
        scriptPath: 'src/main/resources/static/LSTM.py',
        requirements: 'src/main/resources/static/requirements.txt',
        trainRatio: '0.7',
        seasonality: 'false',
        columns: 'open,high,low',
        parameters: {},
      },
    },
    position: { x: 300, y: 200 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'onSuccess' },
];

const PipelineGraph = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  // When a node is clicked, set it as selected so the sidebar appears.
  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  // Close the configuration panel.
  const closePanel = () => {
    setSelectedNode(null);
  };

  // Update the configuration in the selected node.
  const updateNodeConfig = (newConfig) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return { ...node, data: { ...node.data, config: newConfig } };
        }
        return node;
      })
    );
    closePanel();
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Graph area */}
      <div style={{ flex: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {/* Sidebar configuration panel */}
      {selectedNode && (
        <div style={{ width: '300px', borderLeft: '1px solid #ddd', padding: '16px', background: '#f8f9fa' }}>
          <ConfigurationPanel
            step={selectedNode.data}
            onUpdateConfig={updateNodeConfig}
            onClose={closePanel}
          />
        </div>
      )}
    </div>
  );
};

export default PipelineGraph;
