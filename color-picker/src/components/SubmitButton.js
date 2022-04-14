
import { useState } from 'react';
import { writeChanges } from '../utils/API';

export default function SubmitButton({length, oldData, newData}) {
    const [loading, setLoading] = useState(false);

    const style = {
        backgroundColor: "#666666",
        padding: "10px",
        textDecoration: "none",
        color: "#ffffff",
        borderRadius: "4px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#ffffff22",
        boxShadow: "2px 2px 2px #00000044"
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await writeChanges(length, oldData, newData);
            setLoading(false);


        }
        catch (error) {
            console.error(error);
            setLoading(false);
        }
        
 
    }
 
  
    return (
        <div style={{margin: "10px"}}>
            {loading ? 
                    <a href="#x" style={style}>Loading</a>
                : 
                    <a href="#x" style={style} onClick={handleSubmit} >Sync</a>
            }
            
        </div>
    );
  }
  