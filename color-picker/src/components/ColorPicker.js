import { Hue, Alpha } from 'react-color/lib/components/common';
import { RGBToHSL, HSLtoRGB } from '../utils/conversion';

export default function ColorPicker({setPickerColor, setWhiteLevel, pickerColor, setSaturation, saturation, whiteLevel }) {

    const saturationSlider = {...pickerColor, a: saturation};
    const whiteSlider = {r:255, g:255, b:255, a: whiteLevel.a};
    const sliderStyle = {
        backgroundColor: "#000000",
        height: "20px", 
        width: "100%", 
        position: "relative",
        borderRadius: "4px",
        boxShadow: "2px 2px 2px #00000044",
        overflow: "hidden",
        cursor: "pointer"
    }
    const whiteStyle = {
        position: "absolute",
        bottom: "0px",
        width: "100%",
        height: "20%",
        backgroundColor: `rgb(${whiteSlider.a*255}, ${whiteSlider.a*255}, ${whiteSlider.a*255} )`,
        borderRadius: "0 0 4px 4px",
        boxShadow: "inset 2px 2px 2px #00000044",
    }
    const colorStyle = {
        width: "100%", height: "100%", 
        backgroundColor: `rgba(${saturationSlider.r}, ${saturationSlider.g}, ${saturationSlider.b}, ${saturationSlider.a})`, 
        borderRadius: "4px", 
        position: "relative", 
        boxShadow: "inset 2px 2px 2px #00000044", 
        borderStyle: "solid", 
        borderWidth: "1px", 
        borderColor: "#555555"
    }

    return (
        <div style={{display: 'flex', position: 'relative'}}>
            <div style={{margin: "30px", width: "calc(100% - 200px)"}}>
                <div>
                    <span>Hue</span>
                    <div style={sliderStyle}>
                        <Hue hsl={ RGBToHSL(pickerColor) }  onChange={ (color) => setPickerColor(HSLtoRGB(color)) } />
                    </div>
                    <span>Saturation</span>
                    <div style={sliderStyle}>
                        <Alpha rgb={ saturationSlider } hsl={ {h:0,s:0,l:0} } onChange={ (color) => setSaturation(color.a) } />
                    </div>
                    <span>White Level</span>
                    <div style={sliderStyle}>
                        <Alpha rgb={ whiteSlider } hsl={ {h:0,s:0,l:0} } onChange={ (color) => setWhiteLevel({ r: 0, g: 0, b: 0, a: color.a }) } />
                    </div>
                </div>
            </div>

            <div style={{margin: "30px",position: "absolute", right: 0}}>
                <div style={{width: "100px", height: "100px", backgroundColor: "#000000", borderRadius: "4px"}}>
                    <div style={colorStyle}>
                        <div style={whiteStyle}></div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
  