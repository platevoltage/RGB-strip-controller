export default function Tile({index, color, shiftKey}) {
    
    const style = {
        display: 'flex',
        backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
        position: "relative",
        width: "30px",
        height: "50px",
        borderRadius: "4px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#555555",
        boxShadow: "inset 2px 2px 2px #00000044",
        overflow: "hidden",
        cursor: shiftKey ? "copy" : "pointer"
    }
    const whiteStyle = {
        position: "absolute",
        bottom: "0px",
        width: "100%",
        height: "20%",
        backgroundColor: `rgb(${color.w}, ${color.w}, ${color.w})`,
        borderRadius: "0 0 4px 4px",
        boxShadow: "inset 2px 2px 2px #00000044",
        overflow: "hidden"
        
    }
    const countStyle = {
        fontSize: "10px",
        color: (color.r + color.g + color.b < 300) ? "#ffffff" : "#000000" ,
    }

    const xStyle = {
        color: "#ff000055",
        fontSize: "30px",
        position: "absolute",
        left: "calc(50% - 10px )",
        top: "calc(50% - 20px)"
    }

    return (
        <div style={style} >
            <span style={countStyle}>{index+1}</span>
            {(color.r + color.g + color.b + color.w === 0) ? <span style={xStyle}>X</span> : <></>}
            <div style={whiteStyle}>
            
            </div>
           
        </div>
    );
  }
  