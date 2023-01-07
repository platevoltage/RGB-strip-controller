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
    const colorArray = [];

    for (let i of data.changes) {
        let rgbwData = i;
        colorArray.push(((rgbwData.w << 24) | (rgbwData.r << 16) | (rgbwData.g << 8) | rgbwData.b) >>> 0);
    }
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
            "color" : colorArray
            
        })
    });
 
}

