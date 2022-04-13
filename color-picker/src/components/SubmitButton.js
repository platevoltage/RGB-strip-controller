
import { useState } from 'react';
import { writeChanges } from '../utils/API';

export default function SubmitButton({length, oldData, newData}) {
    const [loading, setLoading] = useState(false);

    const style = {
        backgroundColor: "#666666",
        padding: "10px",
        borderRadius: "4px",
        textDecoration: "none",
        color: "#ffffff",
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await writeChanges(length, oldData, newData);
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
  