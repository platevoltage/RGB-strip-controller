export const getCurrentConfig = () => {
    return fetch("http://10.0.0.143/current", {
        headers: {
         'Content-Type': 'application/json',
       }
    });
}

