import { useState } from 'react';
import CurrentConfig from './components/CurrentConfig';
import ColorPicker from './components/ColorPicker';

function App() {
  const [pickerColor, setPickerColor] = useState({ r: 255, g: 0, b: 0 });
  const [saturation, setSaturation] = useState(1);
  const [whiteLevel, setWhiteLevel] = useState({ r: 0, g: 0, b: 0, a: 0 });
  const [mode, setMode] = useState("regular");

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

  return (
    <div className="App" style={style}>
      
      <ColorPicker setPickerColor={setPickerColor} setWhiteLevel={setWhiteLevel} pickerColor={pickerColor} setSaturation={setSaturation} saturation={saturation} whiteLevel={whiteLevel} mode={mode}/>
      <CurrentConfig pickerColor={ pickerColor } setPickerColor={ setPickerColor } setSaturation={setSaturation} saturation={saturation} whiteLevel={ whiteLevel.a*255 } setWhiteLevel={ setWhiteLevel} mode={mode} setMode={setMode}/>
     
    </div>
  );
}

export default App;
