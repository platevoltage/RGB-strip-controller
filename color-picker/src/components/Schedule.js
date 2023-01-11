import { useRef, useEffect, useState } from 'react'
import ScheduleTile from './ScheduleTile'
import ScheduleTimeline from './ScheduleTimeline';

const style = {
    position: 'relative',
    backgroundColor: "#ffffff55",
    height: "100px"
}

export default function Schedule() {
    const selfRef = useRef(null);
    const timelineRef = useRef(null);

    return (
        <div style={style} ref={selfRef}>
            <div ref={timelineRef} style={{position: 'absolute', right: "20px", top: "40%", width: "600px", height: "20px"}}>
                <ScheduleTimeline />
            </div>
            <ScheduleTile parentRef={selfRef} timelineRef={timelineRef} xOrigin={10} yOrigin={30}/>
            <ScheduleTile parentRef={selfRef} timelineRef={timelineRef} xOrigin={70} yOrigin={30}/>
            <ScheduleTile parentRef={selfRef} timelineRef={timelineRef} xOrigin={130} yOrigin={30}/>
        </div>
    )
}
