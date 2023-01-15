import { getData } from '../utils/API';
import { useEffect } from 'react';
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
    const { lengthTextBox, colorDataUnsaved, colorData, error, loading, profile, mode, addressTextBox, dividerLocations, effectSpeedTextBox, schedule, undoArray, currentTime, scheduleColors } = get;
    const { setLoading, setError, setEffectSpeedTextBox, setLengthTextBox, setAddressTextBox, setMode, setCurrentTime, setScheduleColors } = set;


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
        getData(profile, get, set);
        setTimeout(() => {
            for(let i=0; i<3; i++) {
                if (profile !== i) {
                    getData(i, get, set, true);
                    console.log(profile, i);
                }
            }
        }, 5000)
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
        
            <div style={buttonStyle}>
                <SubmitButton length={+lengthTextBox} pixels={colorDataUnsaved} setLoadingParent={setLoading} loadingParent={loading} setError={setError} error={error} address={addressTextBox} dividers={dividerLocations} effectSpeed={+effectSpeedTextBox} profile={+profile} schedule={schedule} addressTextBox={addressTextBox}/>
                <ReadButton get={get} set={set} setLoadingParent={setLoading}/>
                <StripLength colorData={colorData} textBox={lengthTextBox} setTextBox={setLengthTextBox} />
                <Address textBox={addressTextBox} setTextBox={setAddressTextBox} />
                <EffectSpeed textBox={effectSpeedTextBox} setTextBox={setEffectSpeedTextBox} />
                <Mode mode={mode} setMode={setMode}/>
                <Profile setLoadingParent={setLoading} get={get} set={set} />
            </div>
             
    );
    
}