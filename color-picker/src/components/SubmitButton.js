import { useState } from 'react';
import { writeChanges, verifySave } from '../utils/API';
import { deepEqual } from '../utils/conversion';

export default function SubmitButton({length, pixels, setLoadingParent, loadingParent, setError, error, address, dividers, effectSpeed, profile, schedule, addressTextBox}) {
    const [loading, setLoading] = useState(false);
    const [saveError, setSaveError] = useState(false);

    const style = {
        backgroundColor: "#666666",
        padding: "10px",
        textDecoration: "none",
        color: error || loadingParent || loading ? "#ffffff44" : "#ffffff",
        borderRadius: "4px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#ffffff22",
        boxShadow: "2px 2px 2px #00000044",
        width: "100px",
        fontSize: "1em"
    }

    const handleSubmit = async () => {
        window.localStorage.setItem("length", length);
        if (!loadingParent) {
            setLoading(true);
            setLoadingParent(true);
            setSaveError(false);
            
            try {
                pixels = pixels.slice(0, length);
                for (let pixel of pixels) {
                    pixel.r = Math.floor(pixel.r);
                    pixel.g = Math.floor(pixel.g);
                    pixel.b = Math.floor(pixel.b);
                    pixel.w = Math.floor(pixel.w);
                }
                console.log(schedule);
                const submittedData  = {pixels, dividers: dividers.filter(x => x!==0), effectSpeed, schedule: schedule.map(x => x.toFixed(2))};
                console.log(submittedData);
                await writeChanges(length, pixels.slice(0, length), address, dividers, effectSpeed, profile, schedule);
                setLoadingParent(false);
                setError(false);
                setLoading(false);
                const verification = await verifySave(addressTextBox, profile);
                setSaveError(!deepEqual(submittedData, verification));
                console.log(verification);
                console.log(deepEqual(submittedData, verification));
            }
            catch (error) {
                console.error(error);
                setLoading(false);
                setLoadingParent(false);
                setError(true);
            }
        }
 
    }
 
    return (
        <div style={{margin: "10px", display: "flex", justifyContent: "flex-end", flexDirection: "column", textAlign: "center"}}>
            {loading ? 
                <a href="#x" style={style}>Loading</a>
                : 
                <>
                    {!error ? 
                        <button style={style} onClick={handleSubmit} >
                            {saveError ? <>Save Failed</> : <>Sync</>}
                        </button> 
                        : 
                        <button style={style}>Error</button>
                    }
                </>
            }
            
        </div>
    );
  }
  