export default function Address({textBox, setTextBox}) {

    const style = {
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        margin: "10px",
        backgroundColor: "#444444"
    }

    const inputStyle = {
        width: "200px",
        fontSize: "1.6em"
    }
  
    return (
        <div style={style}>
            Address:
            <input
                value={textBox}
                name="strip-length"
                onChange={(e) => {setTextBox(e.target.value)}}
                type="text"
                placeholder="0.0.0.0"
                style={inputStyle}
            />
        </div>
    );
  }
  