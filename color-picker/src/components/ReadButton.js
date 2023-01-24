import { useState } from 'react';
import { getData } from '../utils/API'

export default function ReadButton({get, set, setLoadingParent}) {
    const { setError } = set;
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
        width: "100px",
        fontSize: "1em"
    }

    const handleSubmit = async () => {
        setLoading(true);
        setLoadingParent(true);
        setError(false);
        try {
            await getData(get.profile, get, set);
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
        <div style={{margin: "10px", display: "flex", justifyContent: "flex-end", flexDirection: "column", textAlign: "center"}}>
            {loading ? 
                <button style={style}>Loading</button>
                : 
                <button style={style} onClick={handleSubmit} >Read</button>
            } 
        </div>
    );
  }
  