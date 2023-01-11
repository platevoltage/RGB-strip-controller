import { useRef, useEffect, useState } from 'react'

export default function ScheduleTile({parentRef, timelineRef, xOrigin, yOrigin, schedule, setSchedule, index}) {
    const tileRef = useRef();
    const [mouseClick, setMouseClick] = useState(false);
    const [x, setX] = useState(xOrigin);
    const [y, setY] = useState(yOrigin);

    const style = {
        position: 'absolute',
        backgroundColor: "#000000",
        height: "60px",
        width: "40px",
        left: `${x}px`,
        top: `${y}px`,
        zIndex: mouseClick ? 10 : 0
    
    }
    let timePlacement = (((tileRef.current?.getBoundingClientRect().x - timelineRef.current?.getBoundingClientRect().x + tileRef.current?.getBoundingClientRect().width/2 ) / ( timelineRef.current?.getBoundingClientRect().width  ))*24) || 0;
    const minutes = (Math.round(60*(timePlacement-Math.floor(timePlacement))));
    const timeOffset = (new Date().getTimezoneOffset()/60);
    const gmtTime = (timePlacement + timeOffset) - Math.floor((timePlacement + timeOffset)/24)*24;

    // console.log(ref.current);

    function handleMouseDown(e) {
        setMouseClick(true);
    }
    function handleMouseUp(e) {
        setMouseClick(false);
        // if (e.clientX - parentRef.current.getBoundingClientRect().x > timelineRef.current.getBoundingClientRect().x - tileRef.current.getBoundingClientRect().width) {
        if (tileRef.current.getBoundingClientRect().x - timelineRef.current.getBoundingClientRect().x + tileRef.current.getBoundingClientRect().width/2 > 0) {
            setY(30);
        } else {
            setX(xOrigin);
            setY(yOrigin);
        }
    }
    function handleMouseOut(e) {
        setMouseClick(false);
    }
    function handleMouseMove(e) {
        // console.log(timelineRef.current.getBoundingClientRect().x, tileRef.current.getBoundingClientRect().x );
        if (mouseClick) {

            setX((e.clientX - parentRef.current.getBoundingClientRect().x) - tileRef.current.getBoundingClientRect().width/2);
            setY((e.clientY - parentRef.current.getBoundingClientRect().y) - tileRef.current.getBoundingClientRect().height/2);
            // setY((e.clientY - parentRef.current.getBoundingClientRect().y));
        }
        if (tileRef.current.getBoundingClientRect().x - timelineRef.current.getBoundingClientRect().x + tileRef.current.getBoundingClientRect().width/2 > 0) {
            setY(30);
        }
    }
    useEffect(() => {

        if (timePlacement<=0) schedule[index] = 0;
        else schedule[index] = +gmtTime.toFixed(2);
        setSchedule(schedule);
        console.log(schedule);

        const reference = tileRef.current;
        reference.addEventListener('mousedown', handleMouseDown);
        reference.addEventListener('mouseup', handleMouseUp);
        reference.addEventListener('mouseout', handleMouseOut);
        reference.addEventListener('mousemove', handleMouseMove);
        return () => {
            reference.removeEventListener('mousedown', handleMouseDown);
            reference.removeEventListener('mouseup', handleMouseUp);
            reference.removeEventListener('mouseout', handleMouseOut);
            reference.removeEventListener('mousemove', handleMouseMove);
        };
        
    },[mouseClick])

    return (
        <div ref={tileRef} style={style}>
            {/* {tileRef.current.getBoundingClientRect().x - timelineRef.current.getBoundingClientRect().x } */}
            {/* <br></br> */}
            {timePlacement > 0 && <>
                {Math.floor(timePlacement)}:{minutes < 10 ? "0" : ""}{minutes}<br></br>
                {timePlacement.toFixed(2)}<br></br>
                {gmtTime.toFixed(2)}
            </>}

        </div>
    )
}
