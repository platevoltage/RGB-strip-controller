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

