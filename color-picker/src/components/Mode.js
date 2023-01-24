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
            <div style={{position: "relative"}}>
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
                <svg style={{position: "absolute", right: "5px", bottom: "20%", pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
            </div>
        </div>
    );
  }
  