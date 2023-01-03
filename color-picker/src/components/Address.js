export default function Address({textBox, setTextBox}) {

    const style = {
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
  