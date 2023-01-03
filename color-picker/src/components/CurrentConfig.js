import {getCurrentConfig } from '../utils/API';
import Tile from './Tile';
import Divider from './Divider';
import { useState, useEffect } from 'react';
import SubmitButton from './SubmitButton';
import ReadButton from './ReadButton';
import StripLength from './StripLength';
import Address from './Address';
import EffectSpeed from './EffectSpeed';

const noConnectionArray = [];
for (let i = 0; i < 20; i++) noConnectionArray.push({r: 0, g: 0, b: 0, w:0});
let storedLength = window.localStorage.getItem("length");

if (!storedLength) storedLength = 20;

export default function CurrentConfig({pickerColor, setPickerColor, saturation, whiteLevel, setWhiteLevel}) {

    const [lengthTextBox, setLengthTextBox] = useState(storedLength);
    const [addressTextBox, setAddressTextBox] = useState(window.localStorage.getItem("ip"));
    const [effectSpeedTextBox, setEffectSpeedTextBox] = useState("0");
    const [colorData, setColorData] = useState([]);
    const [dividerLocations, setDividerLocations] = useState([]);
    const [colorDataUnsaved, setColorDataUnsaved] = useState(noConnectionArray);
    // eslint-disable-next-line no-unused-vars
    const [state, setState] = useState();
    const [mouseClick, setMouseClick] = useState(false);
    const [shiftKey, setShiftKey] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const getData = async () => {
        
        try {
            window.localStorage.setItem("ip", addressTextBox);

            const response = await getCurrentConfig(addressTextBox);
            const result = await response.json();
            let colorArray = [];

            for (let i of result.pixels) {
                const colorObject = {r:i[0], g:i[1], b:i[2], w:i[3]};
                colorArray.push(colorObject);
            }

            setDividerLocations(result.dividers);
            setEffectSpeedTextBox(result.effectSpeed);
            setLengthTextBox(colorArray.length);
            setColorData(colorArray);
            setColorDataUnsaved([...colorArray]);
            setLoading(false);

        } catch (error){
            console.error(error);
            setLoading(false);
            setError(true);
        }
    }
    
    useEffect(()=>{
        window.addEventListener("keydown", (e) => {
            if (e.shiftKey) setShiftKey(true);
        });
        window.addEventListener("keyup", (e) => {
            setShiftKey(false);
        });
        window.addEventListener("mousedown", () => (setMouseClick(true)));
        window.addEventListener("mouseup", () => (setMouseClick(false)));
        getData();
        return () => {
            window.removeEventListener("mousedown", () => (setMouseClick(true)));
            window.removeEventListener("mouseup", () => (setMouseClick(false)));
            window.removeEventListener("keyup", (e) => {
                if (e.shiftKey) setShiftKey(false);
            });
            window.removeEventListener("keydown", (e) => {
                if (e.shiftKey) setShiftKey(true);
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stripStyle = {
        backgroundColor: "#444444",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: "8px"
    }
    const buttonStyle = {
        display: "flex",
        padding: "10px",
    }
    const loadingOverlayStyle = {
        backgroundColor: "#77777755", 
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        boxShadow: "4px 4px 4px #77777755, -4px -4px 4px #77777755",
        position: "absolute", 
        width: "100%", 
        height: "100%", 
        zIndex: "1",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontSize: "60px"
    }

    function update(e, index) {
        if (!shiftKey && ((mouseClick && e.type === "mouseover") || (e.type === "mousedown"))) {
            colorDataUnsaved[index] = {r:pickerColor.r*saturation, g:pickerColor.g*saturation, b:pickerColor.b*saturation, w: whiteLevel};
            setColorDataUnsaved(colorDataUnsaved);
            setState({});     
        }
    }
  
    return (
        <>
            <div style={{position: "relative"}}>
                <div style={stripStyle}>
                    {(loading || error) && 
                        <div style={loadingOverlayStyle}>
                            {error ? <span>Connection Error</span> : <span>Loading...</span>}
                        </div>
                    }
                    {colorDataUnsaved.map((color, index) => (
                        <div key={index} style={{"display": "flex"}}>
                            <div onMouseDown={(e) => {
                                    update(e, index);
                                    if (shiftKey) {
                                        setPickerColor(color);
                                        setWhiteLevel({a: color.w});
                                    }
                                }} 
                                onMouseOver={(e) => update(e, index)}>
                                <Tile index={index} color={color} shiftKey={shiftKey}/>
                            </div>
                            <div onMouseDown={(e) => {
                                    const indexClicked = dividerLocations.indexOf(index+1);
                                    if (indexClicked === -1) {
                                        setDividerLocations([...dividerLocations.filter(x => x !== 0), index+1]);
                                    } else {
                                        setDividerLocations(dividerLocations.filter(x => x !== index+1));
                                    }
                                }}>
                                { (index !== colorData.length-1) && <Divider exists={dividerLocations.includes(index+1)}/> }   
                            </div>
                        </div>
                    ))}           
                </div>
            </div>

            <div style={buttonStyle}>
                <SubmitButton length={lengthTextBox} oldData={colorData} newData={colorDataUnsaved} setLoadingParent={setLoading} loadingParent={loading} setError={setError} error={error} address={addressTextBox} getData={getData} dividers={dividerLocations} effectSpeed={effectSpeedTextBox}/>
                <ReadButton getData={getData} setLoadingParent={setLoading} setError={setError}/>
                <StripLength colorData={colorData} textBox={lengthTextBox} setTextBox={setLengthTextBox} />
                <Address textBox={addressTextBox} setTextBox={setAddressTextBox} />
                <EffectSpeed textBox={effectSpeedTextBox} setTextBox={setEffectSpeedTextBox} />
            </div>
        </>     
    );
}
  