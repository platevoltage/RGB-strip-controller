import {getCurrentConfig } from '../utils/API';
import { rgbwToHex } from '../utils/conversion'
import Tile from './Tile';
import { useState, createContext, useContext, useEffect } from 'react';


export default function CurrentConfig() {

    const [colorData, setColorData] = useState([]);
   
    const getData = async () => {
        
        try {
            const response = await getCurrentConfig();
            
            const result = await response.json();

            console.log(result);
            let hexColorArray = [];
            for (let i of result) {
                hexColorArray.push(rgbwToHex(i));
            }
            // console.log(hexColorArray);
            setColorData(hexColorArray);
            

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
  
  
    return (
      <div style={style}>
            
        {colorData.map((color, index) => (
          
            <Tile color={color} key={index} />   
        ))}

      </div>
    );
}
  