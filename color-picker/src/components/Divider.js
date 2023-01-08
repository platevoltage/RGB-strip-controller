export default function Divider({previous, next, exists, outOfRange}) {
    const style = {
        display: (!exists && outOfRange) ? 'none' : 'flex',
        backgroundColor: exists ? (outOfRange ? "#333333" : "#111111") : "#11111100",
        position: "relative",
        width: exists ? "10px" : "4px",
        height: "58px",
        borderRadius: "4px",
        margin: exists ? (outOfRange ? "-2px 20px 0px 6px" : "-2px 6px 0px 6px") : "2px 2px 0px 2px",
        overflow: "hidden",
        cursor: exists ? "no-drop" : "ew-resize",
    }

    return (
        <div style={{display: "flex", width: outOfRange && exists ? "60px" : "auto" }}>
            {outOfRange && exists && <div style={{ position: "relative"}}><span style={{ fontSize: "10px", position: "absolute", bottom: "10px", right: "-3px"}}>{previous}</span></div>}
            <div style={style}></div>
            {outOfRange && exists && <div style={{ position: "relative"}}><span style={{ fontSize: "10px", position: "absolute", bottom: "10px", right: "-4px"}}>{next}</span></div>}
            
        </div>
    );
  }
  