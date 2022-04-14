
// import './App.css';
import { HuePicker, AlphaPicker, SliderPicker } from 'react-color';
import { Hue, Alpha } from 'react-color/lib/components/common';
import { useState } from 'react';
import CurrentConfig from './components/CurrentConfig';
import { RGBToHSL, HSLtoRGB } from './utils/conversion';

function App() {
  const [pickerColor, setPickerColor] = useState({ r: 0, g: 0, b: 0 });
  const [whiteLevel, setWhiteLevel] = useState({ r: 0, g: 0, b: 0, a: 0 });
  
  const whiteSlider = {...whiteLevel, a: 1-whiteLevel.a};

  console.log(whiteLevel);
  console.log(whiteSlider);
  const style = {
    marginTop: "100px"
  }
  // console.log(pickerColor);
  return (
    <div className="App" style={style}>
      <div style={{margin: "30px"}}>
        {/* <div>
          Hue
          <SliderPicker color={ pickerColor } onChange={ (color) => setPickerColor({ r: color.rgb.r, g: color.rgb.g, b: color.rgb.b}) }/>
        </div>
        <div style={{marginTop: "20px"}}>
          White Level
          <AlphaPicker color={ whiteLevel } onChange={ (color) => setWhiteLevel({ r: 0, g: 0, b: 0, a: color.rgb.a }) }/>
        </div> */}
        <div style={{marginTop: "20px"}}>
          Hue
          <div style={{height: "20px", width: "1000px", position: "relative"}}>
            <Hue hsl={ RGBToHSL(pickerColor) }  onChange={ (color) => setPickerColor(HSLtoRGB(color)) } />
          </div>
          White Level
          <div style={{height: "20px", width: "1000px", position: "relative", backgroundColor: "#ffffff", transform: "scale(-1, 1)"}}>
            <Alpha rgb={ whiteSlider } hsl={ {h:0,s:0,l:0} } onChange={ (color) => setWhiteLevel({ r: 0, g: 0, b: 0, a: color.a }) } />
          </div>
          
        </div>
        
      </div>
      


     <CurrentConfig pickerColor={ pickerColor } whiteLevel={ whiteLevel.a*255 }/>
     
    </div>
  );
}

export default App;
