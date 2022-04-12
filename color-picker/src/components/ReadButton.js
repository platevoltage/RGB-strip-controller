
// import { useState, createContext, useContext, useEffect } from 'react';
// import { writeChanges } from '../utils/API';

export default function ReadButton({getData}) {

    const style = {
        backgroundColor: "#666666",
        padding: "10px",
        borderRadius: "4px",
        textDecoration: "none",
        color: "#ffffff",
    }

    const handleSubmit = () => {

        getData();
    }
 
  
    return (
        <div style={{margin: "10px"}}>
            <a href="#x" style={style} onClick={handleSubmit} >Read</a>
        </div>
    );
  }
  