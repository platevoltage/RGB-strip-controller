import { compare, hexToRGBW } from './conversion';


export const getCurrentConfig = (address) => {
    return fetch(`${address}/current`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const writeChanges = (stripLength, oldData, newData, address, dividers) => {
    const data = compare(oldData, newData);
    const redArray = [];
    const greenArray = [];
    const blueArray = [];
    const whiteArray = [];

    for (let i of data.changes) {
        let rgbwData = i;
        redArray.push(rgbwData.r);
        greenArray.push(rgbwData.g);
        blueArray.push(rgbwData.b);
        // redArray.push(255);
        // greenArray.push(0);
        // blueArray.push(0);
        whiteArray.push(rgbwData.w);
    }


    return fetch(`${address}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "status" : "Success!",
            stripLength,
            "dividers": [...dividers, 0, 0, 0, 0].splice(0, 4),
            "length" : data.changes.length,
            "positions" : data.changePositions,
            "red" : redArray,
            "green" : greenArray,
            "blue" : blueArray,
            "white" : whiteArray
            
        })
    });
 
   
}

