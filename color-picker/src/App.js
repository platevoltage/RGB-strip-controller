import { useEffect, useState } from 'react';
import CurrentConfig from './components/CurrentConfig';
import ColorPicker from './components/ColorPicker';
import Schedule from './components/Schedule';
import ColorLayout from './components/ColorLayout';
import Preferences from './components/Preferences';

function App() {

  const noConnectionArray = [];
  for (let i = 0; i < 200; i++) noConnectionArray.push({r: 0, g: 0, b: 0, w:0});
  let storedLength = window.localStorage.getItem("length");
  if (!storedLength) storedLength = 20;

  const [pickerColor, setPickerColor] = useState({ r: 255, g: 0, b: 0 });
  const [saturation, setSaturation] = useState(1);
  const [whiteLevel, setWhiteLevel] = useState({ r: 0, g: 0, b: 0, a: 0 });
  const [schedule, setSchedule] = useState([]);
  const [mode, setMode] = useState("regular");
  const [profile, setProfile] = useState(0);
  const [colorData, setColorData] = useState([]);
  const [tempArray, setTempArray] = useState([]);
  const [undoArray, setUndoArray] = useState([]);
  const [lengthTextBox, setLengthTextBox] = useState(storedLength);
  const [addressTextBox, setAddressTextBox] = useState(window.localStorage.getItem("ip") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [colorDataUnsaved, setColorDataUnsaved] = useState(noConnectionArray);
  const [dividerLocations, setDividerLocations] = useState([]);
  const [effectSpeedTextBox, setEffectSpeedTextBox] = useState("0");
  const [currentTime, setCurrentTime] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  const [scheduleColors, setScheduleColors] = useState(
    [
      [{r:0, g:0, b:0},{r:0, g:0, b:0},{r:0, g:0, b:0}],
      [{r:0, g:0, b:0},{r:0, g:0, b:0},{r:0, g:0, b:0}],
      [{r:0, g:0, b:0},{r:0, g:0, b:0},{r:0, g:0, b:0}],
      [{r:0, g:0, b:0},{r:0, g:0, b:0},{r:0, g:0, b:0}],
    ]
  );

  const globalSetters = {
    setPickerColor,
    setSaturation,
    setWhiteLevel,
    setSchedule,
    setMode,
    setProfile,
    setColorData,
    setTempArray,
    setLengthTextBox,
    setAddressTextBox,
    setLoading,
    setError,
    setColorDataUnsaved,
    setDividerLocations,
    setEffectSpeedTextBox,
    setScheduleColors,
    setUndoArray,
    setCurrentTime,
    setWindowWidth
  }
  const globalGetters = {
    pickerColor,
    saturation,
    whiteLevel: whiteLevel.a*255,
    schedule,
    mode,
    profile,
    colorData,
    tempArray,
    lengthTextBox,
    addressTextBox,
    loading,
    error,
    colorDataUnsaved,
    dividerLocations,
    effectSpeedTextBox,
    scheduleColors,
    undoArray,
    currentTime,
    noConnectionArray,
    windowWidth
  }

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
  function handleResize(e) {
      console.log(windowWidth);
      setWindowWidth(e.target.window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="App" style={style}>

      {document.URL.includes("github") && <div style={{position: "absolute", top: "0", left: "0"}}>This app is in demo mode, <a href={process.env.PUBLIC_URL+ "/demo.html"} target="_blank" rel="noopener noreferrer">Click here for demo video</a></div>}
      
      <Preferences set={globalSetters} get={globalGetters} />

      <ColorPicker setPickerColor={setPickerColor} setWhiteLevel={setWhiteLevel} pickerColor={pickerColor} setSaturation={setSaturation} saturation={saturation} whiteLevel={whiteLevel} mode={mode} />

      <ColorLayout set={globalSetters} get={globalGetters}/>

      <Schedule schedule={schedule} setSchedule={setSchedule} colors={scheduleColors} currentTime={currentTime} windowWidth={windowWidth}/>

      <CurrentConfig set={globalSetters} get={globalGetters}/>
 
    </div>
  );
}

export default App;
