
// import { useState, createContext, useContext, useEffect } from 'react';
import { writeChanges } from '../utils/API';

export default function SubmitButton({oldData, newData}) {

    const style = {
        backgroundColor: "#666666",
        padding: "10px",
        borderRadius: "4px",
        textDecoration: "none",
        color: "#ffffff",
    }

    const handleSubmit = () => {
        writeChanges(oldData, newData);
 
    }
 
  
    return (
        <div style={{margin: "10px"}}>
            <a href="#x" style={style} onClick={handleSubmit} >Sync</a>
        </div>
    );
  }
  