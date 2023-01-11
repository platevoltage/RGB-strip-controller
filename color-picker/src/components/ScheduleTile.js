import { useRef, useEffect, useState } from 'react'

export default function ScheduleTile({parentRef, timelineRef, xOrigin, yOrigin}) {
    const tileRef = useRef();
    const [mouseClick, setMouseClick] = useState(false);
    const [x, setX] = useState(xOrigin);
    const [y, setY] = useState(yOrigin);

    const style = {
        position: 'absolute',
        backgroundColor: "#ffffff88",
        height: "60px",
        width: "40px",
        left: `${x}px`,
        top: `${y}px`
    
    }

    // console.log(ref.current);

    function handleMouseDown(e) {
        setMouseClick(true);
    }
    function handleMouseUp(e) {
        setMouseClick(false);
        if (e.clientX - parentRef.current.getBoundingClientRect().x > timelineRef.current.getBoundingClientRect().x - tileRef.current.getBoundingClientRect().width) {
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
        console.log(e.clientX - parentRef.current.getBoundingClientRect().x, timelineRef.current.getBoundingClientRect().x - tileRef.current.getBoundingClientRect().width);
        if (mouseClick) {
            setX((e.clientX - parentRef.current.getBoundingClientRect().x) - tileRef.current.getBoundingClientRect().width/2);
            setY((e.clientY - parentRef.current.getBoundingClientRect().y) - tileRef.current.getBoundingClientRect().height/2);
            // setY((e.clientY - parentRef.current.getBoundingClientRect().y));
        }
    }
    useEffect(() => {
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
            {+mouseClick}
        </div>
    )
}
