export default function EffectSpeed({colorData, textBox, setTextBox}) {

    const style = {
        display: 'flex',
        flexDirection: 'column',
        margin: "10px",
        // backgroundColor: "#888888"
    }

    const inputStyle = {
        width: "6em",
        fontSize: "1em"
    }
  
    return (
        <div style={style}>
            <span style={{fontSize: ".8em"}}>EffectSpeed:</span>
            <input
                value={textBox}
                name="effect-speed"
                onChange={(e) => {setTextBox(e.target.value)}}
                type="text"
                placeholder="#"
                style={inputStyle}
            />
        </div>
    );
  }
  