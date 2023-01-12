import { useRef, useEffect, useState } from 'react'
import ScheduleTile from './ScheduleTile'
import ScheduleTimeline from './ScheduleTimeline';

const style = {
    position: 'relative',
    // backgroundColor: "#ffffff55",
    height: "100px"
}

export default function Schedule({schedule, setSchedule, colors}) {
    const selfRef = useRef(null);
    const timelineRef = useRef(null);

    return (
        <div style={style} ref={selfRef}>
            <div ref={timelineRef} style={{position: 'absolute', right: "30px", top: "40%", width: "calc(100% - 250px)", height: "20px"}}>
                <ScheduleTimeline />
            </div>

            <ScheduleTile parentRef={selfRef} timelineRef={timelineRef} xOrigin={10} yOrigin={30} schedule={schedule} setSchedule={setSchedule} index={0} colors={colors[0]}/>
            <ScheduleTile parentRef={selfRef} timelineRef={timelineRef} xOrigin={70} yOrigin={30} schedule={schedule} setSchedule={setSchedule} index={1} colors={colors[1]}/>
            <ScheduleTile parentRef={selfRef} timelineRef={timelineRef} xOrigin={130} yOrigin={30} schedule={schedule} setSchedule={setSchedule} index={2} colors={colors[2]}/>
        </div>
    )
}
