

export default function ScheduleTimeline() {
    const style = {
        // position: 'absolute',
        display: 'flex',
        width: "100%",
        height: "100%",
        backgroundColor: "#888888",
        borderRadius: "3px",
        opacity: "0.4"
        // right: "20px",
        // top: "40%"
    }
    const hourStyle = {
        color: "#ffffff",
        position: "relative",
        backgroundColor: "#888888",
        width: "2.4%",
        minWidth: "2.4%",
        height: "140%",
        top: "-20%",
        left: "-2%",
        margin: "0 0.97% 0 0.97%",
        textAlign: "center",
        borderRadius: "3px"
    }

    const twelveHourStyle = {
        backgroundColor: "#666666",
        position: "absolute",
        width: "90%",
        height: "90%",
        top: "108%",
        fontSize: ".8em",
        color: "#cccccc",
        margin: "0 0% 0 10%",
  

    }
    return (
        <div style={style}>
        {[...Array(24)].map((_,index) => (

            <div style={hourStyle} key={index}>
                <p style={{marginTop: "20%"}}>{index}</p>
                {index > 12 && <div style={{...hourStyle,...twelveHourStyle}}>
                    <p style={{marginTop: "20%"}}>{index-12}</p>
                </div>}
            </div>

        ))}
        </div>
    )
}
