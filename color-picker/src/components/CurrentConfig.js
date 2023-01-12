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
import Profile from './Profile';

const noConnectionArray = [];
for (let i = 0; i < 200; i++) noConnectionArray.push({r: 0, g: 0, b: 0, w:0});
let storedLength = window.localStorage.getItem("length");

if (!storedLength) storedLength = 20;

export default function CurrentConfig({pickerColor, setPickerColor, setSaturation, saturation, whiteLevel, setWhiteLevel, mode, setMode, schedule, setScheduleColors, scheduleColors}) {
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
    const [profile, setProfile] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const [draggedFrom, setDraggedFrom] = useState(0);
    

    const verifySave = async () => {
        try {
            const response = await getCurrentConfig(addressTextBox, profile);
            const result = await response.json();
            let colorArray = [];

            for (let i of result.pixels) {
                const colorObject = { w:(i >> 24)& 0xFF, r:(i >> 16)& 0xFF, g:(i >> 8)& 0xFF, b:(i >> 0)& 0xFF };
                colorArray.push(colorObject);
            }
            result.pixels = colorArray;
            result.dividers = result.dividers.filter(x => x!==0);
            result.schedule = result.schedule.map(x => x.toFixed(2));
            delete result["time"]; 
            return result;
        } catch (error){
            console.error(error);
        }
        
    }
    const getData = async (_profile) => {
        document.title = `RGB strip controller - ${window.location.href.split("//")[1].split(":")[0]}`;
        setUndoArray([...tempArray]);
        
        try {
            window.localStorage.setItem("ip", addressTextBox);

            const response = await getCurrentConfig(addressTextBox, _profile);
            const result = await response.json();
            let colorArray = [];

            for (let i of result.pixels) {
                const colorObject = { w:(i >> 24)& 0xFF, r:(i >> 16)& 0xFF, g:(i >> 8)& 0xFF, b:(i >> 0)& 0xFF };
                colorArray.push(colorObject);
            }

            setDividerLocations(result.dividers);
            setEffectSpeedTextBox(result.effectSpeed);
            setLengthTextBox(colorArray.length);
            setCurrentTime(result.time);
            // setProfile(+result.profile);
            setColorData(colorArray);
            setColorDataUnsaved([...colorArray, ...noConnectionArray]);
            setLoading(false);
            scheduleColors[profile] = [{...colorArray[0]},{...colorArray[colorArray.length/2]},{...colorArray[colorArray.length-1]}];
            setScheduleColors([...scheduleColors]);
            


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
        // scheduleColors[profile] = [{...colorDataUnsaved[0]},{...colorDataUnsaved[colorData.length/2]},{...colorDataUnsaved[colorData.length-1]}];
        // // console.log(profile);
        // // console.log(scheduleColors);
        // setScheduleColors([...scheduleColors]);
    }
    function handleMouseUp(e) {
        setMouseClick(false);
    }
    function tick() {
        let time = currentTime + (Math.floor(new Date().getTime()/1000) - currentTime);
        setCurrentTime(time);
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
        getData(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(()=>{
        setUndoArray([...tempArray]);
        scheduleColors[profile] = [{...colorDataUnsaved[0]},{...colorDataUnsaved[colorData.length/2]},{...colorDataUnsaved[colorData.length-1]}];
        setScheduleColors([...scheduleColors]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[tempArray]);
    useEffect(() => {
        setMouseClick(false)
    },[mode])

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
                <SubmitButton length={+lengthTextBox} pixels={colorDataUnsaved} setLoadingParent={setLoading} loadingParent={loading} setError={setError} error={error} address={addressTextBox} verifySave={verifySave} dividers={dividerLocations} effectSpeed={+effectSpeedTextBox} profile={+profile} schedule={schedule}/>
                <ReadButton getData={getData} setLoadingParent={setLoading} setError={setError}/>
                <StripLength colorData={colorData} textBox={lengthTextBox} setTextBox={setLengthTextBox} />
                <Address textBox={addressTextBox} setTextBox={setAddressTextBox} />
                <EffectSpeed textBox={effectSpeedTextBox} setTextBox={setEffectSpeedTextBox} />
                <Mode mode={mode} setMode={setMode}/>
                <Profile profile={profile} setProfile={setProfile} getData={getData} setLoadingParent={setLoading} setError={setError} />
            </div>
                 {new Date(currentTime*1000).toLocaleString()}
        </>     
    );
    
}