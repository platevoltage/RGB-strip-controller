
// import './App.css';
import { HuePicker, AlphaPicker } from 'react-color';
import { useState } from 'react';
import CurrentConfig from './components/CurrentConfig';


function App() {
  const [pickerColor, setPickerColor] = useState({ r: 0, g: 0, b: 0 });
  const [whiteLevel, setWhiteLevel] = useState({ r: 0, g: 0, b: 0, a: 0 });
  
  const style = {
    marginTop: "100px"
  }

  return (
    <div className="App" style={style}>

      <HuePicker color={ pickerColor } onChange={ (color) => setPickerColor({ r: color.rgb.r, g: color.rgb.g, b: color.rgb.b}) }/>
      <AlphaPicker color={ whiteLevel } onChange={ (color) => setWhiteLevel({ r: 0, g: 0, b: 0, a: color.rgb.a }) }/>


     <CurrentConfig pickerColor={ pickerColor } whiteLevel={ whiteLevel.a*255 }/>
     
    </div>
  );
}

export default App;
