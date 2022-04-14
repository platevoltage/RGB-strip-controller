
// import './App.css';
import { HuePicker, AlphaPicker, SliderPicker } from 'react-color';
import { Hue, Alpha, Saturation } from 'react-color/lib/components/common';
import { useState } from 'react';
import CurrentConfig from './components/CurrentConfig';
import ColorPicker from './components/ColorPicker';
import { RGBToHSL, HSLtoRGB } from './utils/conversion';

function App() {
  const [pickerColor, setPickerColor] = useState({ r: 0, g: 0, b: 0 });
  const [saturation, setSaturation] = useState(1);
  const [whiteLevel, setWhiteLevel] = useState({ r: 0, g: 0, b: 0, a: 0 });

 
  const style = {
    marginTop: "100px",
    backgroundColor: "#444444",
    width: "90vw",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#ffffff33",
    boxShadow: "2px 2px 2px #ffffff33"
  }
  // console.log(pickerColor);
  return (
    <div className="App" style={style}>
      
      <ColorPicker setPickerColor={setPickerColor} setWhiteLevel={setWhiteLevel} pickerColor={pickerColor} setSaturation={setSaturation} saturation={saturation} whiteLevel={whiteLevel}/>


      <CurrentConfig pickerColor={ pickerColor } saturation={saturation} whiteLevel={ whiteLevel.a*255 }/>
     
    </div>
  );
}

export default App;
