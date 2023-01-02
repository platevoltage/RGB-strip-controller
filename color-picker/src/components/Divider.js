export default function Divider({exists}) {
    

    const style = {
        display: 'flex',
        // justifyContent: 'center',
        backgroundColor: exists ? "#111111" : "#11111100",
        position: "relative",
        width: exists ? "10px" : "4px",
        height: "58px",
        borderRadius: "4px",
        // borderStyle: "solid",
        // borderWidth: "0px",
        // borderColor: "#111111",
        margin: exists ? "-2px 6px 0px 6px" : "2px 2px 0px 2px",
        // boxShadow: "inset 2px 2px 2px #00000044",
        overflow: "hidden",
        // cursor: shiftKey ? "copy" : "pointer"
    }


    return (
        <div style={style} >

        </div>
    );
  }
  