
// import { useState, createContext, useContext, useEffect } from 'react';


export default function Tile({color}) {
    

    const style = {
        backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
        position: "relative",
        width: "30px",
        height: "50px",
        borderRadius: "4px",
        margin: "4px",
    }
    const whiteStyle = {
        position: "absolute",
        bottom: "0px",
        width: "100%",
        height: "20%",
        backgroundColor: `rgb(${color.w}, ${color.w}, ${color.w})`,
        borderRadius: "0 0 4px 4px",
        
    }
 
  
    return (
        <div style={style} >
            <div style={whiteStyle}>

            </div>
           
        </div>
    );
  }
  