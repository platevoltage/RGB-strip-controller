
import { useEffect } from 'react';
// import { writeChanges } from '../utils/API';

export default function StripLength({colorData, textBox, setTextBox}) {

    // const [textBox, setTextBox] = useState("");
    
 
    useEffect(()=>{
  
        setTextBox(colorData.length);
        
    }, [colorData]);

    const style = {
        display: 'flex',
        flexDirection: 'column',
        margin: "10px",
        backgroundColor: "#444444"
    }

    const inputStyle = {
        width: "40px",
        fontSize: "1.6em"
    }
  
    return (
        <div style={style}>
            Length:
            <input
                value={textBox}
                name="strip-length"
                onChange={(e) => {setTextBox(e.target.value)}}
                // onChange={orThisWayForBoth}
                type="text"
                placeholder="#"
                style={inputStyle}
            />

        </div>
    );
  }
  