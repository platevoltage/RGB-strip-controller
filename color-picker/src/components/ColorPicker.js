import { Hue, Alpha } from 'react-color/lib/components/common';
import { useState } from 'react';
import { RGBToHSL, HSLtoRGB } from '../utils/conversion';
// import { writeChanges } from '../utils/API';

export default function ColorPicker({setPickerColor, setWhiteLevel, pickerColor, setSaturation, saturation, whiteLevel }) {

    const saturationSlider = {...pickerColor, a: saturation};
    const whiteSlider = {r:255, g:255, b:255, a: whiteLevel.a};
 

  
    return (
        <div style={{margin: "30px"}}>
            <div style={{marginTop: "20px"}}>
          Hue
          <div style={{height: "20px", width: "1000px", position: "relative"}}>
            <Hue hsl={ RGBToHSL(pickerColor) }  onChange={ (color) => setPickerColor(HSLtoRGB(color)) } />
          </div>
          Saturation
          <div style={{height: "20px", width: "1000px", position: "relative", backgroundColor: "#000000"}}>
            <Alpha rgb={ saturationSlider } hsl={ {h:0,s:0,l:0} } onChange={ (color) => setSaturation(color.a) } />
          </div>
          White Level
          <div style={{height: "20px", width: "1000px", position: "relative", backgroundColor: "#000000"}}>
            <Alpha rgb={ whiteSlider } hsl={ {h:0,s:0,l:0} } onChange={ (color) => setWhiteLevel({ r: 0, g: 0, b: 0, a: color.a }) } />
          </div>
          
        </div>
        </div>
    );
  }
  