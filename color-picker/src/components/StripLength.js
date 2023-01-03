export default function StripLength({colorData, textBox, setTextBox}) {

    const style = {
        display: 'flex',
        flexDirection: 'column',
        margin: "10px",
        backgroundColor: "#444444"
    }

    const inputStyle = {
        width: "50px",
        fontSize: "1.6em"
    }
  
    return (
        <div style={style}>
            <span>Length:</span>
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
  