import React from 'react';
import './App.css';
import TaskList from './components/TaskList';

const App = () => {
  return (
    <div className="App">
      <main className="App-main">
        <div className="container">
          <TaskList />
        </div>
      </main>
    </div>
  );
};

export default App;
