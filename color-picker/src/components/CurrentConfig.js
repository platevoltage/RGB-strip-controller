import {getCurrentConfig } from '../utils/API';
import Tile from './Tile';
import { useState, useEffect } from 'react';
import SubmitButton from './SubmitButton';
import ReadButton from './ReadButton';
import StripLength from './StripLength';
import Address from './Address';

const noConnectionArray = [];
for (let i = 0; i < 20; i++) noConnectionArray.push({r: 0, g: 0, b: 0, w:0});
let storedLength = window.localStorage.getItem("length");
console.log(storedLength);
if (!storedLength) storedLength = 20;

export default function CurrentConfig({pickerColor, setPickerColor, saturation, whiteLevel, setWhiteLevel}) {

    const [lengthTextBox, setLengthTextBox] = useState(storedLength);
    const [addressTextBox, setAddressTextBox] = useState(window.localStorage.getItem("ip"));
    const [colorData, setColorData] = useState([]);
    const [colorDataUnsaved, setColorDataUnsaved] = useState(noConnectionArray);
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
            for (let i of result) {
                const colorObject = {r:i[0], g:i[1], b:i[2], w:i[3]};
                colorArray.push(colorObject);
            }

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
    }, []);

    const stripStyle = {
        backgroundColor: "#444444",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        // margin: "30px 10px 10px 10px",
        // width: "100vw",

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
        // padding: "10px",
        // margin: "-10px",
    }

    

    const update = (e, index) => {

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
                    
               
                            {loading || error ? 
                                <div style={loadingOverlayStyle}>
                                    {error ? <span>Connection Error</span> : <span>Loading...</span>}
                                </div>
                                :
                                <></>
                            
                            }
                            
                         
                            {colorDataUnsaved.map((color, index) => (
                                <div key={index} 
                                onMouseDown={(e) => {
                                    update(e, index);
                                    if (shiftKey) {
                                        setPickerColor(color);
                                        setWhiteLevel({a: color.w});
                                    }
                                }} 
                                onMouseOver={(e) => update(e, index)}>
                                    <Tile index={index} color={color} shiftKey={shiftKey}/>   
                                </div>
                            ))}
                        
                                    
                </div>
                
            </div>

            <div style={buttonStyle}>
                <SubmitButton length={lengthTextBox} oldData={colorData} newData={colorDataUnsaved} setLoadingParent={setLoading} loadingParent={loading} setError={setError} error={error} address={addressTextBox} getData={getData}/>
                <ReadButton getData={getData} setLoadingParent={setLoading} setError={setError}/>
                <StripLength colorData={colorData} textBox={lengthTextBox} setTextBox={setLengthTextBox} />
                <Address textBox={addressTextBox} setTextBox={setAddressTextBox} />
            </div>
        </>  
        
    );
}
  