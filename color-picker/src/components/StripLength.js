export default function StripLength({colorData, textBox, setTextBox}) {

    const style = {
        display: 'flex',
        flexDirection: 'column',
        margin: "10px",
        backgroundColor: "#444444"
    }

    const inputStyle = {
        width: "3.3em",
        fontSize: "1em"
    }
  
    return (
        <div style={style}>
            <span style={{fontSize: ".8em"}}>Length:</span>
            <input
                value={textBox}
                name="strip-length"
                onChange={(e) => {setTextBox(e.target.value)}}
                type="text"
                placeholder="#"
                style={inputStyle}
            />
        </div>
    );
  }
  