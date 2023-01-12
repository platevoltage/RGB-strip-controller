import { getCurrentConfig } from '../utils/API';
import { useState, useEffect } from 'react';
import SubmitButton from './SubmitButton';
import ReadButton from './ReadButton';
import StripLength from './StripLength';
import Address from './Address';
import EffectSpeed from './EffectSpeed';
import Mode from './Mode';
import Profile from './Profile';

const noConnectionArray = [];
for (let i = 0; i < 200; i++) noConnectionArray.push({r: 0, g: 0, b: 0, w:0});


export default function CurrentConfig({get, set}) {
    const { lengthTextBox, colorDataUnsaved, tempArray, colorData, error, loading, scheduleColors, profile, mode, addressTextBox, dividerLocations, effectSpeedTextBox, schedule } = get;
    const { setColorDataUnsaved, setScheduleColors, setLoading, setError, setDividerLocations, setEffectSpeedTextBox, setLengthTextBox, setColorData, setAddressTextBox, setMode, setProfile} = set;
    const [undoArray, setUndoArray] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);

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
            console.log(_profile);
            const response = await getCurrentConfig(addressTextBox, _profile);
            const result = await response.json();
            console.log(result);
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

    function tick() {
        let time = currentTime + (Math.floor(new Date().getTime()/1000) - currentTime);
        setCurrentTime(time);
    }
    
    useEffect(()=>{
        setInterval(tick, 1000);
        
        return () => {
            clearInterval(tick);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [undoArray, mode]);

    useEffect(()=>{
        getData(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // setMouseClick(false)
    },[mode])


    const buttonStyle = {
        display: "flex",
        padding: "10px",
    }

    return (
        <>

            <div style={buttonStyle}>
                <SubmitButton length={+lengthTextBox} pixels={colorDataUnsaved} setLoadingParent={setLoading} loadingParent={loading} setError={setError} error={error} address={addressTextBox} verifySave={verifySave} dividers={dividerLocations} effectSpeed={+effectSpeedTextBox} profile={+profile} schedule={schedule}/>
                <ReadButton getData={getData} setLoadingParent={setLoading} setError={setError}/>
                <StripLength colorData={colorData} textBox={lengthTextBox} setTextBox={setLengthTextBox} />
                <Address textBox={addressTextBox} setTextBox={setAddressTextBox} />
                <EffectSpeed textBox={effectSpeedTextBox} setTextBox={setEffectSpeedTextBox} />
                <Mode mode={mode} setMode={setMode}/>
                <Profile profile={profile} setProfile={setProfile} getData={getData} setLoadingParent={setLoading} setError={setError} />
            </div>
                 {/* {new Date(currentTime*1000).toLocaleString()} */}
        </>     
    );
    
}