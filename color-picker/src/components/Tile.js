
// import { useState, createContext, useContext, useEffect } from 'react';


export default function Tile({color}) {
    

    const style = {
        backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
        // backgroundColor: `rgb(${100}, ${100}, ${0})`,
        width: "30px",
        height: "50px",
        borderRadius: "4px",
        margin: "4px",
    }
 
  
    return (
        <div style={style} >
           
        </div>
    );
  }
  