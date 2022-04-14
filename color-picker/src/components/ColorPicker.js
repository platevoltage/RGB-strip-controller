import { Hue, Alpha } from 'react-color/lib/components/common';
import { RGBToHSL, HSLtoRGB } from '../utils/conversion';


export default function ColorPicker({setPickerColor, setWhiteLevel, pickerColor, setSaturation, saturation, whiteLevel }) {

    const saturationSlider = {...pickerColor, a: saturation};
    const whiteSlider = {r:255, g:255, b:255, a: whiteLevel.a};
    
    console.log(saturationSlider);

  
    return (
        <div style={{display: 'flex'}}>
            <div style={{margin: "30px", width: "50%"}}>
                <div style={{marginTop: "20px"}}>
                    Hue
                    <div style={{height: "20px", width: "100%", position: "relative"}}>
                        <Hue hsl={ RGBToHSL(pickerColor) }  onChange={ (color) => setPickerColor(HSLtoRGB(color)) } />
                    </div>
                    Saturation
                    <div style={{height: "20px", width: "100%", position: "relative", backgroundColor: "#000000"}}>
                        <Alpha rgb={ saturationSlider } hsl={ {h:0,s:0,l:0} } onChange={ (color) => setSaturation(color.a) } />
                    </div>
                    White Level
                    <div style={{height: "20px", width: "100%", position: "relative", backgroundColor: "#000000"}}>
                        <Alpha rgb={ whiteSlider } hsl={ {h:0,s:0,l:0} } onChange={ (color) => setWhiteLevel({ r: 0, g: 0, b: 0, a: color.a }) } />
                    </div>
                
                </div>
            </div>

            <div style={{margin: "30px", width: "50%"}}>
                <div style={{width: "100px", height: "100px", backgroundColor: "#000000"}}>
                    <div style={{width: "100%", height: "100%", backgroundColor: `rgba(${saturationSlider.r}, ${saturationSlider.g}, ${saturationSlider.b}, ${saturationSlider.a})`}}>

                    </div>
                </div>
            </div>
        </div>
    );
  }
  