
import { useState } from 'react';
import { writeChanges } from '../utils/API';

export default function SubmitButton({length, oldData, newData, setLoadingParent, loadingParent, setError, error, address, getData}) {
    const [loading, setLoading] = useState(false);

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
            
            try {
                await writeChanges(length, oldData, newData, address);
                // setLoading(false);
                setLoadingParent(false);
                setError(false);
                await getData();
                setLoading(false);
                setLoadingParent(false);

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
                            <a href="#x" style={style} onClick={handleSubmit} >Sync</a> 
                            : 
                            <a href="#x" style={style}>Error</a>
                        }
                    </>
            }
            
        </div>
    );
  }
  