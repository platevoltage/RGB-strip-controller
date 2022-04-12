import {getCurrentConfig } from '../utils/API';
import { rgbwToHex } from '../utils/conversion'
import Tile from './Tile';
import { useState, useEffect } from 'react';
import SubmitButton from './SubmitButton';
import ReadButton from './ReadButton';

export default function CurrentConfig({pickerColor}) {

    const [colorData, setColorData] = useState([]);
    const [colorDataUnsaved, setColorDataUnsaved] = useState([]);
    const [state, setState] = useState();
   
    const getData = async () => {
        
        try {
            const response = await getCurrentConfig();
            
            const result = await response.json();

            let hexColorArray = [];
            for (let i of result) {
                hexColorArray.push(rgbwToHex(i));
            }
            
            setColorData(hexColorArray);

            setColorDataUnsaved([...hexColorArray]);
            // console.log(hexColorArray);

        } catch (error){
            console.error(error);
        }
    }

    useEffect(()=>{

        getData();
        
    }, []);

    const style = {
        display: "flex",
        padding: "10px",
    }

    const update = (index) => {
        colorDataUnsaved[index] = pickerColor;
        setColorDataUnsaved(colorDataUnsaved);
        setState({});
    }
  
    return (
        <>
            <div style={style}>
                    
                {colorDataUnsaved.map((color, index) => (
                    <div key={index} onClick={() => update(index)}>
                        <Tile color={color} />   
                    </div>
                ))}
                
            </div>
            <div style={style}>
                <SubmitButton oldData={colorData} newData={colorDataUnsaved}/>
                <ReadButton getData={getData}/>

            </div>
            
        </>
    );
}
  