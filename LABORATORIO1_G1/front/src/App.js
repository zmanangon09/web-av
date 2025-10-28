import './App.css';
import EmpleadoLista from './components/EmpleadoLista';

function App() {
  return (
    <div align="center">
      <header>
        <h1>Sistema de Gestión de Sueldos</h1>
        <p>Control de horas y nómina de empleados</p>
      </header>

      <main>
        <fieldset>
          <legend>Aplicación</legend>
          <EmpleadoLista />
        </fieldset>
      </main>
    </div>
  );
}

export default App;
