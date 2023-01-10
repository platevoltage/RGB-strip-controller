export const getCurrentConfig = (address) => {
    return fetch(`${address}/current`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const writeChanges = (stripLength, pixels, address, dividers, effectSpeed, profile) => {

    const pixelsArray = [];

    for (let i of pixels) {
        let rgbwData = i;
        pixelsArray.push(((rgbwData.w << 24) | (rgbwData.r << 16) | (rgbwData.g << 8) | rgbwData.b) >>> 0);
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
            // "length" : stripLength,
            // "positions" : data.changePositions,
            "color" : pixelsArray,
            profile
            
        })
    });
 
}

