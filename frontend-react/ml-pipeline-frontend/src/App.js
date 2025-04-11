// src/App.js
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PipelineBuilder from './components/PipelineBuilder';
//import PipelineGraph from './components/PipelineGraph';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container-fluid p-0">
        <header className="bg-success text-white p-3">
          <h1 className="text-center">Java Data Pipeline Platform</h1>
        </header>
        <main className="p-3">
          <PipelineBuilder />
        </main>
      </div>
    </DndProvider>
  );
}

export default App;
