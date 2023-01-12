export const getCurrentConfig = (address, profile) => {
    return fetch(`${address}/current?profile=${profile}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const writeChanges = (stripLength, pixels, address, dividers, effectSpeed, profile, schedule) => {

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
            profile,
            schedule: schedule
            
        })
    });
 
}

export const verifySave = async (addressTextBox, profile) => {
    try {
        const response = await getCurrentConfig(addressTextBox, profile);
        const result = await response.json();
        let colorArray = [];

        for (let i of result.pixels) {
            const colorObject = { w:(i >> 24)& 0xFF, r:(i >> 16)& 0xFF, g:(i >> 8)& 0xFF, b:(i >> 0)& 0xFF };
            colorArray.push(colorObject);
        }
        result.pixels = colorArray;
        result.dividers = result.dividers.filter(x => x!==0);
        result.schedule = result.schedule.map(x => x.toFixed(2));
        delete result["time"]; 
        return result;
    } catch (error){
        console.error(error);
    }
    
}
export const getData = async (_profile, get, set) => {
    document.title = `RGB strip controller - ${window.location.href.split("//")[1].split(":")[0]}`;
    set.setUndoArray([...get.tempArray]);
    
    try {
        window.localStorage.setItem("ip", get.addressTextBox);
        console.log(_profile);
        const response = await getCurrentConfig(get.addressTextBox, _profile);
        const result = await response.json();
        console.log(result);
        let colorArray = [];

        for (let i of result.pixels) {
            const colorObject = { w:(i >> 24)& 0xFF, r:(i >> 16)& 0xFF, g:(i >> 8)& 0xFF, b:(i >> 0)& 0xFF };
            colorArray.push(colorObject);
        }

        set.setDividerLocations(result.dividers);
        set.setEffectSpeedTextBox(result.effectSpeed);
        set.setLengthTextBox(colorArray.length);
        set.setCurrentTime(result.time);
        // setProfile(+result.profile);
        set.setColorData(colorArray);
        set.setColorDataUnsaved([...colorArray, ...get.noConnectionArray]);
        set.setLoading(false);
        get.scheduleColors[get.profile] = [{...colorArray[0]},{...colorArray[colorArray.length/2]},{...colorArray[colorArray.length-1]}];
        set.setScheduleColors([...get.scheduleColors]);
        


    } catch (error){
        console.error(error);
        set.setLoading(false);
        set.setError(true);
    }
}