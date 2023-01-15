import { useRef, useEffect, useState } from 'react'

export default function ScheduleTile({parentRef, timelineRef, xOrigin, yOrigin, schedule, setSchedule, index, colors, setOnTop, onTop, off, currentTime, windowWidth}) {
    const tileRef = useRef();
    const [mouseClick, setMouseClick] = useState(false);
    const [x, setX] = useState(xOrigin);
    const [y, setY] = useState(yOrigin);
    let [timePlacement, setTimePlacement] = useState(0);

    const style = {
        textAlign: 'center',
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
        zIndex: onTop===index ? 10:0,
        color: (colors[0].r + colors[0].g + colors[0].b < 300) ? "#ffffff" : "#000000" ,
    
    }

    useEffect(() => {
        
        let adjustedTime = schedule[index]-timeOffset;

        if (adjustedTime < 0) adjustedTime +=24;
        if (adjustedTime >= 24) adjustedTime -=24;
        
        if (schedule[index] !== 0 && schedule[index] !== undefined && !mouseClick) {
            if (schedule[index] - timeOffset === 0) {
                setX( ((timeline.x - tile.width*2) + timeline.width));
                setTimePlacement(0);
            }
            else {
                setX( ((timeline.x - tile.width*2) + timeline.width) - timeline.width*((24 -  adjustedTime )/24) );
                setTimePlacement(adjustedTime);
            }
            setY(20);
        }
        console.log(schedule);
    }, [schedule, windowWidth]);

    useEffect(() => {
        console.log(colors);
        if (mouseClick) setTimePlacement((((tile.x - timeline.x + tile.width/2 ) / ( timeline.width  ))*24) || 0);
    }, [ x, y])

    let minutes = (Math.round(60*(timePlacement-Math.floor(timePlacement))));
    const timeOffset = (new Date().getTimezoneOffset()/60);
    const gmtTime = (timePlacement + timeOffset) - Math.floor((timePlacement + timeOffset)/24)*24;
    const parent = {
        x: parentRef.current?.getBoundingClientRect().x, 
        y: parentRef.current?.getBoundingClientRect().y,
        width: parentRef.current?.getBoundingClientRect().width, 
        height: parentRef.current?.getBoundingClientRect().height
    };
    const tile = {
        x: tileRef.current?.getBoundingClientRect().x, 
        y: tileRef.current?.getBoundingClientRect().y, 
        width: tileRef.current?.getBoundingClientRect().width, 
        height: tileRef.current?.getBoundingClientRect().height
    };
    const timeline = {
        x: timelineRef.current?.getBoundingClientRect().x, 
        y: timelineRef.current?.getBoundingClientRect().y, 
        width: timelineRef.current?.getBoundingClientRect().width, 
        height: timelineRef.current?.getBoundingClientRect().height
    };

    // console.log(ref.current);
    function snap() {
        tile.x = tileRef.current?.getBoundingClientRect().x;
        tile.y = tileRef.current?.getBoundingClientRect().y;

        if (tile.x - timeline.x + tile.width/2 > -40) {
            setY(20);
            if (tile.x - timeline.x + tile.width/2 <= 0) setX(timeline.x - tile.width*2);
        } 
        if (tile.x - timeline.x + tile.width/2 < timeline.width+40 && tile.x - timeline.x + tile.width/2 > -40) {
            setY(20);
            if (tile.x - timeline.x + tile.width/2 >= timeline.width) setX(timeline.x - tile.width*2 + timeline.width);
        } 
        else if(tile.x - timeline.x + tile.width/2 <= -40) {
            setX(xOrigin);
            setY(yOrigin);
        }
    }
    function handleMouseDown(e) {
        // snap();
        setMouseClick(true);
        setOnTop(index);
    }
    function handleMouseUp(e) {
        snap();
        setMouseClick(false);
    }
    function handleMouseOut(e) {
        // setMouseClick(false);
    }

    function handleMouseMove(e) {
        tile.x = tileRef.current?.getBoundingClientRect().x;
        tile.y = tileRef.current?.getBoundingClientRect().y;
        if (mouseClick) {
            setX((e.clientX - parent.x) - tile.width/2);
            setY((e.clientY - parent.y) - tile.height/2);
            if (tile.x - timeline.x + tile.width/2 > -40 && tile.x - timeline.x + tile.width/2 < timeline.width+40) {
                setY(20);
            }
        }
    }

    useEffect(() => {
        // console.log(timePlacement);
        if (timePlacement === 0) schedule[index] = 0;
        else if (timePlacement>-1 && timePlacement<0) schedule[index] = timeOffset+.01;
        else if (timePlacement<=-1) schedule[index] = 0;
        else if (timePlacement>24) schedule[index] = timeOffset;
        else schedule[index] = +gmtTime.toFixed(2);
        setSchedule(schedule);
        // console.log(schedule);

        const _tileRef = tileRef.current;
        const _parentRef = parentRef.current;
        _tileRef.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        _tileRef.addEventListener('mouseout', handleMouseOut);
        _parentRef.addEventListener('mousemove', handleMouseMove);
        return () => {
            _tileRef.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            _tileRef.removeEventListener('mouseout', handleMouseOut);
            _parentRef.removeEventListener('mousemove', handleMouseMove);
        };
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[mouseClick]);

    let _timePlacement = timePlacement;
    if (minutes === 60) {
        minutes = 0;
        _timePlacement++;
    }
    if (timePlacement<=0 && timePlacement>-1) {
        _timePlacement = 0;
        minutes = 1;
    } 
    if (timePlacement > 24) {
        _timePlacement = 0;
        minutes = 0;
    }
    if (timePlacement === 0) {
        minutes = 0;
    }

    return (
        <div ref={tileRef} style={style}>
            <div style={{position: 'absolute', left: 0, top: 0, fontSize: ".8em"}}>{off ? "OFF" : index}</div>


            {((tile.x - timeline.x + tile.width/2 +20 >= 0)) && <div style={{ height: "100%", display: "flex", justifyContent: "center", flexDirection: "column", fontSize: ".9em"}}>
                <span>{Math.floor(_timePlacement)}:{minutes < 10 ? "0" : ""}{minutes}</span>
                <span style={{fontSize: ".50em"}}>{Math.floor(_timePlacement)%12 || 12}:{minutes < 10 ? "0" : ""}{minutes}{Math.floor(_timePlacement) >= 12 ? "PM" : "AM"}</span>
                
                {/* {Math.floor(_timePlacement)%12 > 1 ? "AM" : "PM"} */}
            </div> }
  


        </div>
    )
}
