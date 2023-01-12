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
    const [onTop, setOnTop] = useState(0);

    return (
        <div style={style} ref={selfRef}>
            <div ref={timelineRef} style={{position: 'absolute', right: "30px", top: "40%", width: "calc(100% - 250px)", height: "20px"}}>
                <ScheduleTimeline />{schedule}
            </div>

            {/* { schedule.map((_, index) => (
                <div key={index}>
                    <ScheduleTile parentRef={selfRef} timelineRef={timelineRef} xOrigin={10+60*index} yOrigin={30} schedule={schedule} setSchedule={setSchedule} index={index} colors={colors[index]} setOnTop={setOnTop} onTop={onTop}/>
                </div>
            ))
            } */}
            <ScheduleTile parentRef={selfRef} timelineRef={timelineRef} xOrigin={10} yOrigin={30} schedule={schedule} setSchedule={setSchedule} index={0} colors={colors[0]} setOnTop={setOnTop} onTop={onTop}/>
            <ScheduleTile parentRef={selfRef} timelineRef={timelineRef} xOrigin={70} yOrigin={30} schedule={schedule} setSchedule={setSchedule} index={1} colors={colors[1]} setOnTop={setOnTop} onTop={onTop}/>
            <ScheduleTile parentRef={selfRef} timelineRef={timelineRef} xOrigin={130} yOrigin={30} schedule={schedule} setSchedule={setSchedule} index={2} colors={colors[2]} setOnTop={setOnTop} onTop={onTop}/>
        </div>
    )
}