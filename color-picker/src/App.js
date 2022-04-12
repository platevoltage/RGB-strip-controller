
// import './App.css';
import { ChromePicker } from 'react-color';
import { useState } from 'react';
import CurrentConfig from './components/CurrentConfig';


function App() {
  const [state, setState] = useState("#ffffff");
  


  return (
    <div className="App">
     <ChromePicker color={ state } onChange={ (color) => setState(color.hex) }/>
     <CurrentConfig pickerColor={ state } />
     
    </div>
  );
}

export default App;
