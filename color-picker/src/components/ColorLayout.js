import { useState, useEffect, useRef } from 'react';
import { RGBToHSL, HSLtoRGB } from '../utils/conversion';
import Tile from './Tile';
import Divider from './Divider';

const noConnectionArray = [];
for (let i = 0; i < 200; i++) noConnectionArray.push({r: 0, g: 0, b: 0, w:0});
let storedLength = window.localStorage.getItem("length");

if (!storedLength) storedLength = 20;

export default function ColorLayout({get, set}) {
    const { lengthTextBox, pickerColor, colorDataUnsaved, saturation, whiteLevel, tempArray, colorData, error, loading, scheduleColors, profile, mode, undoArray } = get;
    const { setPickerColor, setWhiteLevel, setColorDataUnsaved, setScheduleColors, setTempArray, setUndoArray } = set;

    const tilesRef = useRef(null);

    const [draggedFrom, setDraggedFrom] = useState(0);
    const [mouseClick, setMouseClick] = useState(false);
    const [dividerLocations, setDividerLocations] = useState([]);
    const [shiftKey, setShiftKey] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [altKey, setAltKey] = useState(false);
    const [ctrlKey, setCtrlKey] = useState(false);

    const stripStyle = {
        backgroundColor: "#444444",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: "8px"
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
        function handleKeyDown(e) {
        if (e.shiftKey) setShiftKey(true);
        if (e.altKey) setAltKey(true);
        if (e.ctrlKey) setCtrlKey(true);
        if (e.key === 'z') {
            set.setColorDataUnsaved([...undoArray]);
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
    function tick() {
        let time = currentTime + (Math.floor(new Date().getTime()/1000) - currentTime);
        setCurrentTime(time);
    }
    function update(e, index) {
        if (mouseClick && e.type === "mouseover") {
            for (let i = 0; i < +lengthTextBox; i++) {
                colorDataUnsaved[i] = {...tempArray[i]};
            }
            const draggedTo = index;
            switch (mode) {
                case "regular": {
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
                    break;
                }
                case "gradient": {
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
                    break;
                }
                case "rainbow": {
                    if (draggedFrom < draggedTo) {
                        const length = draggedTo - draggedFrom+1;
                        for (let i = draggedFrom; i <= draggedTo; i++) {
                            const h = 360/(length/(i-draggedFrom));
                            colorDataUnsaved[i] = {...HSLtoRGB({h, s:100, l:saturation*50}), w: whiteLevel};
                        }
                    } 
                    if (draggedFrom > draggedTo) {
                        const length =  draggedFrom - draggedTo+1;
                        for (let i = draggedTo; i <= draggedFrom; i++) {
                            const h = 360/(length/(draggedFrom-i));
                            colorDataUnsaved[i] = {...HSLtoRGB({h, s:100, l:saturation*50}), w: whiteLevel};
                        }
                    }
                    break;
                }
                default:
            }

        }
        else if (e.type === "mousedown") {
            setTempArray([...colorDataUnsaved]);
            switch (mode) {
                case "regular": {
                    colorDataUnsaved[index] = {r:pickerColor.r*saturation, g:pickerColor.g*saturation, b:pickerColor.b*saturation, w: whiteLevel};
                    break;
                }
                case "gradient":
                case "rainbow":
                default:
            }
            setDraggedFrom(index);

        }
        else if (e.type === "mouseup") {
            setTempArray([...colorDataUnsaved]);
            switch (mode) {
                case "gradient": {
                    colorDataUnsaved[index] = {r:pickerColor.r*saturation, g:pickerColor.g*saturation, b:pickerColor.b*saturation, w: whiteLevel};
                    break;
                }
                case "regular":
                case "rainbow":
                default:
            }
        }
        setColorDataUnsaved([...colorDataUnsaved]);  
    }
    useEffect(()=>{
        const tilesSection = tilesRef.current;
        tilesSection.addEventListener("keydown", handleKeyDown);
        tilesSection.addEventListener("keyup", handleKeyUp);
        tilesSection.addEventListener("mousedown", handleMouseDown);
        tilesSection.addEventListener("mouseup", handleMouseUp);
        setInterval(tick, 1000);
        
        return () => {
            tilesSection.removeEventListener("mousedown", handleMouseDown);
            tilesSection.removeEventListener("mouseup", handleMouseUp);
            tilesSection.removeEventListener("keyup", handleKeyUp);
            tilesSection.removeEventListener("keydown", handleKeyDown);
            clearInterval(tick);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [undoArray, mode]);
    useEffect(()=>{
        setUndoArray([...tempArray]);
        scheduleColors[profile] = [{...colorDataUnsaved[0]},{...colorDataUnsaved[colorData.length/2]},{...colorDataUnsaved[colorData.length-1]}];
        setScheduleColors([...scheduleColors]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[tempArray]);

  return (
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
  )
}
