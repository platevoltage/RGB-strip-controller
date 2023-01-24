export default function Mode({mode, setMode}) {

    const style = {
        display: 'flex',
        flexDirection: 'column',
        margin: "10px",
        backgroundColor: "#444444"
    }

    const inputStyle = {
        width: "6em",
        fontSize: "1em"
    }
  
    return (
        <div style={style}>
            <span style={{fontSize: ".8em"}}>Mode:</span>
            <select
                // value={textBox}
                // name="effect-speed"
                onChange={(e) => {setMode(e.target.value)}}
                // type="text"
                // placeholder="#"
                style={inputStyle}
            >
                <option value="regular">Regular</option>
                <option value="gradient">Gradient</option>
                <option value="rainbow">Rainbow</option>
            </select>
        </div>
    );
  }
  