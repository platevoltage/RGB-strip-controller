export default function Profile({profile, setProfile}) {

    const style = {
        display: 'flex',
        flexDirection: 'column',
        margin: "10px",
        backgroundColor: "#444444"
    }

    const inputStyle = {
        width: "100px",
        fontSize: "1.6em",
    }
  
    return (
        <div style={style}>
            <span>Mode:</span>
            <select
                // value={textBox}
                // name="effect-speed"
                onChange={(e) => {setProfile(e.target.value)}}
                // type="text"
                // placeholder="#"
                style={inputStyle}
            >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
            </select>
        </div>
    );
  }
  