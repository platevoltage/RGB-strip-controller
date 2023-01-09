import { getCurrentConfig } from '../utils/API';
import { RGBToHSL, HSLtoRGB } from '../utils/conversion';
import { useState, useEffect, useRef } from 'react';
import Tile from './Tile';
import Divider from './Divider';
import SubmitButton from './SubmitButton';
import ReadButton from './ReadButton';
import StripLength from './StripLength';
import Address from './Address';
import EffectSpeed from './EffectSpeed';
import Mode from './Mode';

const noConnectionArray = [];
for (let i = 0; i < 200; i++) noConnectionArray.push({r: 0, g: 0, b: 0, w:0});
let storedLength = window.localStorage.getItem("length");

if (!storedLength) storedLength = 20;

export default function CurrentConfig({pickerColor, setPickerColor, setSaturation, saturation, whiteLevel, setWhiteLevel}) {
    const tilesRef = useRef(null);
    const [lengthTextBox, setLengthTextBox] = useState(storedLength);
    const [addressTextBox, setAddressTextBox] = useState(window.localStorage.getItem("ip"));
    const [effectSpeedTextBox, setEffectSpeedTextBox] = useState("0");
    const [colorData, setColorData] = useState([]);
    const [dividerLocations, setDividerLocations] = useState([]);
    const [tempArray, setTempArray] = useState([]);
    const [undoArray, setUndoArray] = useState([]);
    const [colorDataUnsaved, setColorDataUnsaved] = useState(noConnectionArray);
    const [mouseClick, setMouseClick] = useState(false);
    const [shiftKey, setShiftKey] = useState(false);
    const [altKey, setAltKey] = useState(false);
    const [ctrlKey, setCtrlKey] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [mode, setMode] = useState("regular");

    const [draggedFrom, setDraggedFrom] = useState(0);
    

    const verifySave = async () => {
        try {
            const response = await getCurrentConfig(addressTextBox);
            const result = await response.json();
            let colorArray = [];

            for (let i of result.pixels) {
                const colorObject = { w:(i >> 24)& 0xFF, r:(i >> 16)& 0xFF, g:(i >> 8)& 0xFF, b:(i >> 0)& 0xFF };
                colorArray.push(colorObject);
            }
            result.pixels = colorArray;
            result.dividers = result.dividers.filter(x => x!==0);
            return result;
        } catch (error){
            console.error(error);
        }
        
    }
    const getData = async () => {
        document.title = `RGB strip controller - ${window.location.href.split("//")[1].split(":")[0]}`;
        setUndoArray([...tempArray]);
        
        try {
            window.localStorage.setItem("ip", addressTextBox);

            const response = await getCurrentConfig(addressTextBox);
            const result = await response.json();
            let colorArray = [];

            for (let i of result.pixels) {
                const colorObject = { w:(i >> 24)& 0xFF, r:(i >> 16)& 0xFF, g:(i >> 8)& 0xFF, b:(i >> 0)& 0xFF };
                colorArray.push(colorObject);
            }

            setDividerLocations(result.dividers);
            setEffectSpeedTextBox(result.effectSpeed);
            setLengthTextBox(colorArray.length);
            setColorData(colorArray);
            setColorDataUnsaved([...colorArray, ...noConnectionArray]);
            setLoading(false);


        } catch (error){
            console.error(error);
            setLoading(false);
            setError(true);
        }
    }
    function handleKeyDown(e) {
        if (e.shiftKey) setShiftKey(true);
        if (e.altKey) setAltKey(true);
        if (e.ctrlKey) setCtrlKey(true);
        if (e.key === 'z') {
            setColorDataUnsaved([...undoArray]);
        }
    }
    function handleKeyUp(e) {
        if (e.shiftKey) setShiftKey(false);
        if (e.altKey) setAltKey(false);
        if (e.ctrlKey) setCtrlKey(false);
    }
    function handleMouseDown() {
        setMouseClick(true);
    }
    function handleMouseUp(e) {
        setMouseClick(false);
    }
    
    useEffect(()=>{
        const tilesSection = tilesRef.current;
        tilesSection.addEventListener("keydown", handleKeyDown);
        tilesSection.addEventListener("keyup", handleKeyUp);
        tilesSection.addEventListener("mousedown", handleMouseDown);
        tilesSection.addEventListener("mouseup", handleMouseUp);
        
        return () => {
            tilesSection.removeEventListener("mousedown", handleMouseDown);
            tilesSection.removeEventListener("mouseup", handleMouseUp);
            tilesSection.removeEventListener("keyup", handleKeyUp);
            tilesSection.removeEventListener("keydown", handleKeyDown);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [undoArray, mode]);

    useEffect(()=>{
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(()=>{
        setUndoArray([...tempArray]);
    },[tempArray]);
    useEffect(() => {
        setMouseClick(false)
    },[mode])
    // useEffect(()=>{
    //     // console.log(colorDataUnsaved);
    //     if (+lengthTextBox > colorDataUnsaved.length ) {
    //         console.log(lengthTextBox);
    //         for (let i=0; i<+lengthTextBox-colorDataUnsaved.length; i++) {

    //         }
    //     }
    // }, [lengthTextBox]);

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
        //regular
        if (mode === "regular" &&(mouseClick && e.type === "mouseover")) {
            for (let i = 0; i < +lengthTextBox; i++) {
                colorDataUnsaved[i] = {...tempArray[i]};
            }
            const draggedTo = index;
            if (draggedFrom-1 < draggedTo) {
                for (let i = draggedFrom; i <= draggedTo; i++) {
                    colorDataUnsaved[i] = {r: pickerColor.r*saturation, g: pickerColor.g*saturation, b: pickerColor.b*saturation, w: whiteLevel}
                }
            } 
            if (draggedFrom > draggedTo) {
                for (let i = draggedTo; i <= draggedFrom; i++) {
                    colorDataUnsaved[i] = {r: pickerColor.r*saturation, g: pickerColor.g*saturation, b: pickerColor.b*saturation, w: whiteLevel}
                }
            }
        }
        //start regular
        if (mode === "regular" && (e.type === "mousedown")) {
            setTempArray([...colorDataUnsaved]);
            colorDataUnsaved[index] = {r:pickerColor.r*saturation, g:pickerColor.g*saturation, b:pickerColor.b*saturation, w: whiteLevel};
            setDraggedFrom(index);
        }
        //rainbow  
        if (mode === "rainbow" && (mouseClick && e.type === "mouseover")) {
            for (let i = 0; i < +lengthTextBox; i++) {
                colorDataUnsaved[i] = {...tempArray[i]};
            }
            const draggedTo = index;
            if (draggedFrom < draggedTo) {
                const length = draggedTo - draggedFrom+1;
                for (let i = draggedFrom; i <= draggedTo; i++) {
                    const h = 360/(length/(i-draggedFrom));
                    colorDataUnsaved[i] = HSLtoRGB({h, s:100, v:50});
                }
            } 
            if (draggedFrom > draggedTo) {
                const length =  draggedFrom - draggedTo;
                for (let i = draggedTo; i <= draggedFrom; i++) {
                    const h = 360/(length/(draggedFrom-i-1));
                    colorDataUnsaved[i] = HSLtoRGB({h, s:100, v:50});
                }
            }
        }
        //start rainbow
        if (mode === "rainbow" && (e.type === "mousedown")) {
            setDraggedFrom(index);
            setTempArray([...colorDataUnsaved]);
        }
        //gradient  
        if (mode === "gradient" && (mouseClick && e.type === "mouseover")) {
            for (let i = 0; i < +lengthTextBox; i++) {
                colorDataUnsaved[i] = {...tempArray[i]};
            }
            const draggedTo = index;
            if (draggedFrom < draggedTo) {
                const length = draggedTo - draggedFrom+1;
                for (let i = draggedFrom; i <= draggedTo; i++) {
                    colorDataUnsaved[i].r = Math.floor(tempArray[draggedFrom].r + (pickerColor.r*saturation - tempArray[draggedFrom].r)/(length/(i-draggedFrom)));
                    colorDataUnsaved[i].g = Math.floor(tempArray[draggedFrom].g + (pickerColor.g*saturation - tempArray[draggedFrom].g)/(length/(i-draggedFrom)));
                    colorDataUnsaved[i].b = Math.floor(tempArray[draggedFrom].b + (pickerColor.b*saturation - tempArray[draggedFrom].b)/(length/(i-draggedFrom)));
                    colorDataUnsaved[i].w = Math.floor(tempArray[draggedFrom].w + (whiteLevel - tempArray[draggedFrom].w)/(length/(i-draggedFrom)));
                }
            } 
            if (draggedFrom > draggedTo) {
                const length =  draggedFrom - draggedTo;
                for (let i = draggedTo; i <= draggedFrom; i++) {
                    colorDataUnsaved[i].r = Math.floor(tempArray[draggedFrom].r + (pickerColor.r*saturation - tempArray[draggedFrom].r)/(length/(draggedFrom-i)));
                    colorDataUnsaved[i].g = Math.floor(tempArray[draggedFrom].g + (pickerColor.g*saturation - tempArray[draggedFrom].g)/(length/(draggedFrom-i)));
                    colorDataUnsaved[i].b = Math.floor(tempArray[draggedFrom].b + (pickerColor.b*saturation - tempArray[draggedFrom].b)/(length/(draggedFrom-i)));
                    colorDataUnsaved[i].w = Math.floor(tempArray[draggedFrom].w + (whiteLevel - tempArray[draggedFrom].w)/(length/(draggedFrom-i)));  
                }
            }
        }
        //start gradient
        if (mode === "gradient" && (e.type === "mousedown")) {
            setDraggedFrom(index);
            setTempArray([...colorDataUnsaved]);
        }
        //end gradient
        if (mode === "gradient" && (e.type === "mouseup")) {
            colorDataUnsaved[index] = {r:pickerColor.r*saturation, g:pickerColor.g*saturation, b:pickerColor.b*saturation, w: whiteLevel};
        }

        setColorDataUnsaved([...colorDataUnsaved]);  

    }
  
    return (
        <>
            <div style={{position: "relative"}} ref={tilesRef}>
                <div style={stripStyle}>
                    {(loading || error) && 
                        <div style={loadingOverlayStyle}>
                            {error ? <span>Connection Error</span> : <span>Loading...</span>}
                        </div>
                    }
                    {colorDataUnsaved.map((color, index) => (
                        <div key={index} style={{"display": "flex"}}>
                            {(index < +lengthTextBox) && <>
                                <div onMouseDown={(e) => {
                                        update(e, index);
                                        if (shiftKey) {
                                            setPickerColor(color);
                                            setWhiteLevel({a: color.w});
                                        }
                                    }} 
                                    onMouseOver={(e) => update(e, index)}
                                    onMouseUp={(e) => update(e, index)}>
                                    <Tile index={index} color={color} shiftKey={shiftKey}/>
                                </div>
                            </>}
                            <div style={{display: 'flex'}} onMouseDown={(e) => {
                                const indexClicked = dividerLocations.indexOf(index+1);
                                if (indexClicked === -1) {
                                    setDividerLocations([...dividerLocations.filter(x => x !== 0), index+1]);
                                } else {
                                    setDividerLocations(dividerLocations.filter(x => x !== index+1));
                                }
                            }}>
                                {(index === +lengthTextBox) && (dividerLocations.includes(index+1)) && <div style={{width: "24px"}}></div> }
                                { /*(index !== +lengthTextBox) && */
                                    <Divider 
                                        previous={(index>+lengthTextBox-1)? `${(index>+lengthTextBox-1) ? "..." : ""}${index+1}` : ""} 
                                        next={(index!==dividerLocations[dividerLocations.length-1]-1) ? `${index+2}...` : ""}  exists={dividerLocations.includes(index+1)} 
                                        outOfRange={index > +lengthTextBox-2}   
                                    /> 
                                }   
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <div style={buttonStyle}>
                <SubmitButton length={+lengthTextBox} pixels={colorDataUnsaved} setLoadingParent={setLoading} loadingParent={loading} setError={setError} error={error} address={addressTextBox} verifySave={verifySave} dividers={dividerLocations} effectSpeed={+effectSpeedTextBox}/>
                <ReadButton getData={getData} setLoadingParent={setLoading} setError={setError}/>
                <StripLength colorData={colorData} textBox={lengthTextBox} setTextBox={setLengthTextBox} />
                <Address textBox={addressTextBox} setTextBox={setAddressTextBox} />
                <EffectSpeed textBox={effectSpeedTextBox} setTextBox={setEffectSpeedTextBox} />
                <Mode mode={mode} setMode={setMode}/>
                {mode} {+mouseClick}
            </div>
        </>     
    );
    
}