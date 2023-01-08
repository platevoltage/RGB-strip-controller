import { useState } from 'react';
import { writeChanges } from '../utils/API';
import { deepEqual } from '../utils/conversion';

export default function SubmitButton({length, pixels, setLoadingParent, loadingParent, setError, error, address, verifySave, dividers, effectSpeed}) {
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
    }

    const handleSubmit = async () => {
        window.localStorage.setItem("length", length);
        if (!loadingParent) {
            setLoading(true);
            setLoadingParent(true);
            setSaveError(false);
            
            try {
                pixels = pixels.slice(0, length);
                const submittedData  = {pixels, dividers: dividers.filter(x => x!==0), effectSpeed};
                console.log(submittedData);
                await writeChanges(length, pixels.slice(0, length), address, dividers, effectSpeed);
                setLoadingParent(false);
                setError(false);
                setLoading(false);
                const verification = await verifySave();
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
        <div style={{margin: "10px", display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center"}}>
            {loading ? 
                <a href="#x" style={style}>Loading</a>
                : 
                <>
                    {!error ? 
                        <a href="#x" style={style} onClick={handleSubmit} >
                            {saveError ? <>Save Failed</> : <>Sync</>}
                        </a> 
                        : 
                        <a href="#x" style={style}>Error</a>
                    }
                </>
            }
            
        </div>
    );
  }
  