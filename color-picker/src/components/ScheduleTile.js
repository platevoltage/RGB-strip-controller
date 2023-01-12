import { useRef, useEffect, useState } from 'react'

export default function ScheduleTile({parentRef, timelineRef, xOrigin, yOrigin, schedule, setSchedule, index, colors}) {
    const tileRef = useRef();
    const [mouseClick, setMouseClick] = useState(false);
    const [x, setX] = useState(xOrigin);
    const [y, setY] = useState(yOrigin);
    const [timePlacement, setTimePlacement] = useState(0);

    const style = {
        position: 'absolute',
        backgroundImage: `linear-gradient(90deg, rgb(${colors[0].r}, ${colors[0].g}, ${colors[0].b}), rgb(${colors[1].r}, ${colors[1].g}, ${colors[1].b}), rgb(${colors[2].r}, ${colors[2].g}, ${colors[2].b})`,
        borderRadius: "4px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#555555",
        boxShadow: " 2px 2px 2px #00000044",
        overflow: "hidden",
        cursor: "pointer",
        height: "60px",
        width: "40px",
        left: `${x}px`,
        top: `${y}px`,
        zIndex: mouseClick ? 10 : 0,
        color: (colors[0].r + colors[0].g + colors[0].b < 300) ? "#ffffff" : "#000000" ,
    
    }

    useEffect(() => {
        setTimePlacement((((tileRef.current?.getBoundingClientRect().x - timelineRef.current?.getBoundingClientRect().x + tileRef.current?.getBoundingClientRect().width/2 ) / ( timelineRef.current?.getBoundingClientRect().width  ))*24) || 0);
    },[x,y, timelineRef])

    const minutes = (Math.round(60*(timePlacement-Math.floor(timePlacement))));
    const timeOffset = (new Date().getTimezoneOffset()/60);
    const gmtTime = (timePlacement + timeOffset) - Math.floor((timePlacement + timeOffset)/24)*24;

    // console.log(ref.current);
    function snap() {
        if (tileRef.current.getBoundingClientRect().x - timelineRef.current.getBoundingClientRect().x + tileRef.current.getBoundingClientRect().width/2 > 0) {
            setY(20);
        } else {
            setX(xOrigin);
            setY(yOrigin);
        }
    }
    function handleMouseDown(e) {
        setMouseClick(true);
        snap();
    }
    function handleMouseUp(e) {
        setMouseClick(false);
        snap();
    }
    function handleMouseOut(e) {
        // setMouseClick(false);
    }
    function handleMouseMove(e) {
        if (mouseClick) {
            setX((e.clientX - parentRef.current.getBoundingClientRect().x) - tileRef.current.getBoundingClientRect().width/2);
            setY((e.clientY - parentRef.current.getBoundingClientRect().y) - tileRef.current.getBoundingClientRect().height/2);
        }
        if (tileRef.current.getBoundingClientRect().x - timelineRef.current.getBoundingClientRect().x + tileRef.current.getBoundingClientRect().width/2 > 0) {
            setY(20);
        }
    }
    useEffect(() => {
        
        if (timePlacement<=0) schedule[index] = 0;
        else schedule[index] = +gmtTime.toFixed(2);
        setSchedule(schedule);
        console.log(schedule);

        const _tileRef = tileRef.current;
        const _parentRef = parentRef.current;
        _tileRef.addEventListener('mousedown', handleMouseDown);
        _tileRef.addEventListener('mouseup', handleMouseUp);
        _tileRef.addEventListener('mouseout', handleMouseOut);
        _parentRef.addEventListener('mousemove', handleMouseMove);
        return () => {
            _tileRef.removeEventListener('mousedown', handleMouseDown);
            _tileRef.removeEventListener('mouseup', handleMouseUp);
            _tileRef.removeEventListener('mouseout', handleMouseOut);
            _parentRef.removeEventListener('mousemove', handleMouseMove);
        };
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[mouseClick])

    return (
        <div ref={tileRef} style={style}>
            <div>{index}</div>
            {/* {tileRef.current.getBoundingClientRect().x - timelineRef.current.getBoundingClientRect().x } */}
            {/* <br></br> */}
            {timePlacement > 0 && <>
                {Math.floor(timePlacement)}:{minutes < 10 ? "0" : ""}{minutes}<br></br>
                {/* {timePlacement.toFixed(2)}<br></br>
                {gmtTime.toFixed(2)} */}
                
            </>}

        </div>
    )
}
