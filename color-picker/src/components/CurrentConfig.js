import {getCurrentConfig } from '../utils/API';
import { rgbwToHex } from '../utils/conversion';
import Tile from './Tile';
import { useState, useEffect } from 'react';
import SubmitButton from './SubmitButton';
import ReadButton from './ReadButton';
import StripLength from './StripLength';

export default function CurrentConfig({pickerColor, whiteLevel}) {

    const [textBox, setTextBox] = useState("");
    const [colorData, setColorData] = useState([]);
    const [colorDataUnsaved, setColorDataUnsaved] = useState([]);
    const [state, setState] = useState();
    const [mouseClick, setMouseClick] = useState(false);
   
    const getData = async () => {
        
        try {
            const response = await getCurrentConfig();
            
            const result = await response.json();



            let hexColorArray = [];
            for (let i of result) {
                const colorObject = {r:i[0], g:i[1], b:i[2], w:i[3]};
                hexColorArray.push(colorObject);
            }

            
            setColorData(hexColorArray);
            setColorDataUnsaved([...hexColorArray]);


        } catch (error){
            console.error(error);
        }
    }
    
    useEffect(()=>{
        window.addEventListener("mousedown", () => (setMouseClick(true)));
        window.addEventListener("mouseup", () => (setMouseClick(false)));
        getData();
        return () => {
            window.removeEventListener("mousedown", () => (setMouseClick(true)));
            window.removeEventListener("mouseup", () => (setMouseClick(false)));
        };
    }, []);

    const stripStyle = {
        backgroundColor: "#444444",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: "30px 10px 10px 10px",
        // width: "100vw",

    }
    const buttonStyle = {

        display: "flex",
        padding: "10px",

    }

    const update = (e, index) => {
        if ((mouseClick && e.type === "mouseover") || (e.type === "mousedown")) {
            colorDataUnsaved[index] = {...pickerColor, w: whiteLevel};
        
            setColorDataUnsaved(colorDataUnsaved);

            setState({});
              
        }
    }
  
    return (
        <>
            
            <div style={stripStyle}>
                {!colorData.length ?
                    <>Loading...</>
                    :
                    <>{colorDataUnsaved.map((color, index) => (
                        <div key={index} onMouseDown={(e) => update(e, index)} onMouseOver={(e) => update(e, index)}>
                            <Tile color={color} />   
                        </div>
                    ))}</> 
                }                 
            </div>
            


            <div style={buttonStyle}>
                <SubmitButton length={textBox} oldData={colorData} newData={colorDataUnsaved}/>
                <ReadButton getData={getData}/>
                <StripLength colorData={colorData} textBox={textBox} setTextBox={setTextBox} />

            </div>
            
        </>
    );
}
  