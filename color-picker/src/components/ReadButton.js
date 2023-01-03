import { useState } from 'react';

export default function ReadButton({getData, setLoadingParent, setError}) {
    const [loading, setLoading] = useState(false);

    const style = {
        backgroundColor: "#666666",
        padding: "10px",
        textDecoration: "none",
        color: loading ? "#ffffff44" : "#ffffff",
        borderRadius: "4px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#ffffff22",
        boxShadow: "2px 2px 2px #00000044",
        width: "100px"
    }

    const handleSubmit = async () => {
        setLoading(true);
        setLoadingParent(true);
        setError(false);
        try {
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
  
    return (
        <div style={{margin: "10px", display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center"}}>
            {loading ? 
                <a href="#x" style={style}>Loading</a>
                : 
                <a href="#x" style={style} onClick={handleSubmit} >Read</a>
            } 
        </div>
    );
  }
  