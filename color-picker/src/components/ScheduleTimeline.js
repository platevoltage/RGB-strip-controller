import React from 'react'

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

    return (
        <div style={style}>
        {[...Array(24)].map((_,index) => (

            <div style={hourStyle}>
                <p style={{marginTop: "20%"}}>{index}</p>
            </div>
        ))}
        </div>
    )
}
