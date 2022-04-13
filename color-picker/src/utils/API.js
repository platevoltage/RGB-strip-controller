import { compare, hexToRGBW } from './conversion';


export const getCurrentConfig = () => {
    return fetch("http://10.0.0.143/current", {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const writeChanges = (length, oldData, newData) => {
    const data = compare(oldData, newData);
    const redArray = [];
    const greenArray = [];
    const blueArray = [];
    const whiteArray = [];

    for (let i of data.changes) {
        let rgbwData = hexToRGBW(i);
        redArray.push(rgbwData.r);
        greenArray.push(rgbwData.g);
        blueArray.push(rgbwData.b);
        whiteArray.push(0);
    }


    


    return fetch("http://10.0.0.143/update", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "status" : "Success!",
            "stripLength" : length,
            "length" : data.changes.length,
            "positions" : data.changePositions,
            "red" : redArray,
            "green" : greenArray,
            "blue" : blueArray,
            "white" : whiteArray
            
        })
    });
}

