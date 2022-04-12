
import './App.css';
import { PhotoshopPicker } from 'react-color';
import { useState } from 'react';
import CurrentConfig from './components/CurrentConfig';

function App() {
  const [state, setState] = useState("#ffffff");
  


  return (
    <div className="App">
     <PhotoshopPicker color={ state } onChange={ (color) => setState(color.hex) }/>
     <CurrentConfig />
    </div>
  );
}

export default App;
