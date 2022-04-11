
import './App.css';
import { PhotoshopPicker } from 'react-color';
import { useState } from 'react';

function App() {
  const [state, setState] = useState("#ffffff");
  


  return (
    <div className="App">
     <PhotoshopPicker color={ state } onChange={ (color) => setState(color.hex) }/>
    </div>
  );
}

export default App;
