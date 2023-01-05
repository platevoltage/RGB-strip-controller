import { compare } from './conversion';

export const getCurrentConfig = (address) => {
    return fetch(`${address}/current`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const writeChanges = (stripLength, oldData, newData, address, dividers, effectSpeed) => {
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
        whiteArray.push(rgbwData.w);
    }
    // console.log([...dividers.sort((x, y) => { return  x - y }).filter(x => {return x!==0 }), 0, 0, 0, 0]);
    return fetch(`${address}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "status" : "Success!",
            stripLength,
            effectSpeed,
            "dividers": [...dividers.sort((x, y) => { return  x - y }).filter(x => {return x!==0 }), 0, 0, 0, 0],
            "length" : data.changes.length,
            "positions" : data.changePositions,
            "red" : redArray,
            "green" : greenArray,
            "blue" : blueArray,
            "white" : whiteArray
            
        })
    });
 
}

