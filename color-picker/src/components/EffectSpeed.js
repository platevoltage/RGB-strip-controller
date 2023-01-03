import { useEffect } from 'react';
// import { writeChanges } from '../utils/API';

export default function EffectSpeed({colorData, textBox, setTextBox}) {


    const style = {
        display: 'flex',
        flexDirection: 'column',
        margin: "10px",
        backgroundColor: "#444444"
    }

    const inputStyle = {
        width: "70px",
        fontSize: "1.6em"
    }
  
    return (
        <div style={style}>
            EffectSpeed:
            <input
                value={textBox}
                name="effect-speed"
                onChange={(e) => {setTextBox(e.target.value)}}
                // onChange={orThisWayForBoth}
                type="text"
                placeholder="#"
                style={inputStyle}
            />

        </div>
    );
  }
  