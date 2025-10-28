import './App.css';
import EmpleadoLista from './components/EmpleadoLista';

function App() {
  return (
    <div className="App">
      <header style={{ background: '#282c34', padding: '20px', color: 'white', textAlign: 'center' }}>
        <h1>🏢 Sistema de Gestión de Sueldos</h1>
        <p>Control de horas y nómina de empleados</p>
      </header>
      
      <main style={{ padding: '20px' }}>
        <EmpleadoLista />
      </main>
    </div>
  );
}

export default App;
