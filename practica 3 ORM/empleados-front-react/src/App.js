import React from 'react';
import ObreroLista from './components/obreroList.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Gestion de Obreros</h1>
        <p>Control de horas y salarios</p>
      </header>
      <main>
        <ObreroLista />
      </main>
    </div>
  );
}

export default App;