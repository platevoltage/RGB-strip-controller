export default function Divider({exists}) {
    
    const style = {
        display: 'flex',
        backgroundColor: exists ? "#111111" : "#11111100",
        position: "relative",
        width: exists ? "10px" : "4px",
        height: "58px",
        borderRadius: "4px",
        margin: exists ? "-2px 6px 0px 6px" : "2px 2px 0px 2px",
        overflow: "hidden",
        cursor: exists ? "no-drop" : "ew-resize"
    }

    return (
        <div style={style}></div>
    );
  }
  