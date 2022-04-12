export const rgbwToHex = ( rgbw ) => {
    let hex = "#";
    for (let i = 0; i < 3; i++) {
        let byte = rgbw[i].toString(16);
        if ( byte.length < 2 ) {
            byte = "0" + byte;
        }
        hex += byte
    }


    return hex;
}

export const hexToRGBW = ( hex ) => {
    hex = hex.slice(1);
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);

    return {r,g,b};
}

export const compare = (oldData, newData) => {
    let changePositions = [];
    let changes = [];
  
    // console.log(newData);
    for (let i in oldData) {
        if ( oldData[i] !== newData[i]) {
            changes.push(newData[i]);
            changePositions.push(parseInt(i));
        }
    }
    return {changes, changePositions};
}