export default function Mode({mode, setMode}) {

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
            <span>Mode:</span>
            <select
                // value={textBox}
                // name="effect-speed"
                onChange={(e) => {setMode(e.target.value)}}
                // type="text"
                // placeholder="#"
                // style={inputStyle}
            >
                <option value="regular">Regular</option>
                <option value="gradient">Gradient</option>
                <option value="rainbow">Rainbow</option>
            </select>
        </div>
    );
  }
  