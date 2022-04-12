import {getCurrentConfig } from '../utils/API';
import { useState, createContext, useContext, useEffect } from 'react';


export default function CurrentConfig() {
   
    const getData = async () => {
        
        try {
            const response = await getCurrentConfig();
            
            const result = await response.json();

            console.log(result);

            // const randomNumber = Math.floor(Math.random() * result.length);

            // setCurrentStory(result[randomNumber]);

        } catch (error){
            console.error(error);
        }
    }

    useEffect(()=>{

        getData();
        
    }, [])
  
  
    return (
      <div>
        test
      </div>
    );
  }
  