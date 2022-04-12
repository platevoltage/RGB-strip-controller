export const getCurrentConfig = () => {
    return fetch("http://10.0.0.143/current", {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const writeChanges = (dataOld, dataNew) => {
    return fetch("http://10.0.0.143/update", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "status" : "Success!",
            "length" : 3,
            "positions" : [5,6,7],
            "red" : [0, 255, 0],
            "green" : [255, 0, 0],
            "blue" : [0, 255, 255],
            "white" : [0, 0, 0]
            
        })
    });
}

