import { useRef, useEffect } from 'react';

export default function ScheduleTimeline({currentTime, timelineRef}) {
    const timeRef = useRef(null);
    let timeWidth;
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
    const hourWidth = 2.4;
    const hourMargin = .97;
    const hourStyle = {
        color: "#ffffff",
        position: "relative",
        backgroundColor: "#888888",
        width: `${hourWidth}%`,
        minWidth: `${hourWidth}%`,
        height: "140%",
        top: "-20%",
        left: "-2%",
        margin: `0 ${hourMargin}% 0 ${hourMargin}%`,
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
    const date = new Date(currentTime*1000);
    const hour = date.getHours();
    const hourDecimal = date.getMinutes()/60;
    const currentTimeStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontSize: ".7em",
        position: "absolute", 
        backgroundColor: "#aa0000", 
        top: "-200%", 
        width: "8%", 
        left: `${(hour+hourDecimal)*(hourWidth+hourMargin*2)-5}%`,
    }
    const downArrowStyle = {
        position: "absolute", 
        width: "0",
        height: "0", 
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderTop: "6px solid #aa0000",
        // backgroundColor: "#aa0000", 
        bottom: "-6px",
        left: "calc(50% - 6px)"
    }



    // const hour = 10;
    // hour*4.35-4
    return (
        <div style={style}>
            <div style={{...hourStyle, ...currentTimeStyle}}>
                Current Time
                <div style={downArrowStyle}></div>
            </div>
            {[...Array(24)].map((_,index) => (

                <div style={hourStyle} key={index}>
                    <p style={{marginTop: "20%"}}>{index}</p>
                    { (index === 0 ||index > 12) && 
                        <div style={{...hourStyle,...twelveHourStyle}}>
                            <p style={{marginTop: "20%"}}>{Math.abs(index-12)}</p>
                        </div>
                    }
                </div>

            ))}
            <div style={{position: "absolute", bottom: "-200%", left: "3%", color: "#999999"}}>
                {new Date(currentTime*1000).toString()}
            </div>
        </div>
    )
}
