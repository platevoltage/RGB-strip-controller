import {getCurrentConfig } from '../utils/API';
import Tile from './Tile';
import { useState, createContext, useContext, useEffect } from 'react';


export default function CurrentConfig() {

    const [colorData, setColorData] = useState([]);
   
    const getData = async () => {
        
        try {
            const response = await getCurrentConfig();
            
            const result = await response.json();

            console.log(result);
            setColorData(result);

        } catch (error){
            console.error(error);
        }
    }

    useEffect(()=>{

        getData();
        
    }, [])
  
  
    return (
      <div>
        <Tile color={"#ffff00"} />
      </div>
    );
  }
  