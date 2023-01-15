import { useState } from 'react';
import CurrentConfig from './components/CurrentConfig';
import ColorPicker from './components/ColorPicker';
import Schedule from './components/Schedule';
import ColorLayout from './components/ColorLayout';

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
  const [addressTextBox, setAddressTextBox] = useState(window.localStorage.getItem("ip"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [colorDataUnsaved, setColorDataUnsaved] = useState(noConnectionArray);
  const [dividerLocations, setDividerLocations] = useState([]);
  const [effectSpeedTextBox, setEffectSpeedTextBox] = useState("0");
  const [currentTime, setCurrentTime] = useState(0);

  const [colors, setColors] = useState(
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
    setScheduleColors: setColors,
    setUndoArray,
    setCurrentTime
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
    scheduleColors: colors,
    undoArray,
    currentTime,
    noConnectionArray
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

  return (
    <div className="App" style={style}>
      
      <ColorPicker setPickerColor={setPickerColor} setWhiteLevel={setWhiteLevel} pickerColor={pickerColor} setSaturation={setSaturation} saturation={saturation} whiteLevel={whiteLevel} mode={mode} />

      <ColorLayout set={globalSetters} get={globalGetters}/>

      <Schedule schedule={schedule} setSchedule={setSchedule} colors={colors} currentTime={currentTime}/>
      
      <CurrentConfig set={globalSetters} get={globalGetters}/>
 
     
    </div>
  );
}

export default App;
