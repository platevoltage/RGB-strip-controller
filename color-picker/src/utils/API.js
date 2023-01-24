

export const getCurrentConfig = (address, profile, colorsOnly) => {
    return fetch(`${address}/current?profile=${profile}&colorsonly=${colorsOnly ? 1:0}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const getPreferences = async (address) => {
    const response = await fetch(`${address}/getprefs`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    // console.log(address);
    return response.json();

}

export const savePreferences = async (address, pin, bitOrder, ssid, wifiPassword, bonjourName, brightness) => {
    return fetch(`${address}/saveprefs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pin,
            bitOrder,
            ssid,
            wifiPassword,
            bonjourName,
            brightness
        })
    });

}

export const writeChanges = (stripLength, pixels, address, dividers, effectSpeed, profile, schedule) => {
    console.log(schedule);
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
        delete result["profile"]; 
        return result;
    } catch (error){
        console.error(error);
    }
    
}

export const getData = async (_profile, get, set, skipSetters) => {
    document.title = `RGB strip controller - ${window.location.href.split("//")[1].split(":")[0]}`;
    set.setUndoArray([...get.tempArray]);
    
    try {
        window.localStorage.setItem("ip", get.addressTextBox);
        console.log(_profile);
        // const response = await getCurrentConfig(get.addressTextBox, _profile, skipSetters);
        // const result = await response.json();
        const result = demoData[_profile];
        console.log(process.env);

        console.log(result);
        let colorArray = [];

        for (let i of result.pixels) {
            const colorObject = { w:(i >> 24)& 0xFF, r:(i >> 16)& 0xFF, g:(i >> 8)& 0xFF, b:(i >> 0)& 0xFF };
            colorArray.push(colorObject);
        }
        if (!skipSetters) (function setState() {
            let scheduleArray = [];
            for (let i of result.schedule) {
                scheduleArray.push(i);
            }
            set.setSchedule([...scheduleArray]);
            set.setDividerLocations(result.dividers);
            set.setEffectSpeedTextBox(result.effectSpeed);
            set.setLengthTextBox(colorArray.length);
            set.setCurrentTime(result.time);
            // set.setSchedule([...result.schedule]);
            // setProfile(+result.profile);
            set.setColorData(colorArray);
            set.setColorDataUnsaved([...colorArray, ...get.noConnectionArray]);
            set.setLoading(false);
        })();
        get.scheduleColors[_profile] = [{...colorArray[0]},{...colorArray[Math.round(colorArray.length/2)]},{...colorArray[colorArray.length-1]}];
        set.setScheduleColors([...get.scheduleColors]);
        


    } catch (error){
        console.error(error);
        set.setLoading(false);
        set.setError(true);
    }
}


const demoData = [
    {
        "pixels": [
        2031871,
        2294015,
        2556159,
        2883839,
        3145983,
        3473663,
        3735807,
        4063487,
        4325631,
        4653311,
        4915455,
        5177599,
        5505279,
        5767423,
        6095103,
        6357247,
        6684927,
        6947071,
        7274751,
        7536895,
        7799039,
        8126719,
        8388863,
        8716543,
        8978687,
        9306367,
        9568511,
        9896191,
        10158335,
        10420479,
        10748159,
        11010303,
        11337983,
        11600127,
        11927807,
        12517631,
        12058879,
        11665663,
        11272447,
        10879231,
        10486015,
        10092799,
        9634047,
        9240831,
        8847615,
        8454399,
        8061183,
        7667967,
        7274751,
        6815999,
        6422783,
        6029567,
        5636351,
        5243135,
        4849919,
        4391167,
        3997951,
        3604735,
        3211519,
        2818303,
        2425087,
        2031871,
        12517631,
        11994111,
        11536383,
        11013119,
        10555391,
        10097663,
        9574399,
        9116671,
        8658943,
        8135679,
        7677951,
        7220223,
        6696959,
        6239231,
        5781247,
        5257983,
        4800255,
        4342527,
        3819263,
        3361535,
        2903807,
        2380543,
        1922815,
        1465087,
        941823,
        26367,
        614911,
        1203455,
        1791999,
        2380543,
        2969087,
        3557631,
        4146431,
        4734975,
        5323519,
        5912063,
        6566143,
        7154687,
        7743231,
        8332031,
        8920575,
        9509119,
        10097663,
        10686207,
        11274751,
        11863295,
        12517631,
        4278216447,
        4278216447,
        4278216447,
        4278216447,
        4278216447,
        4278216447,
        4278216447,
        4278216447,
        4278216447,
        4278216447,
        4278216447
        ],
        "dividers": [
        62,
        109,
        0,
        0
        ],
        "time": 1674527583,
        "effectSpeed": 100,
        "profile": 0,
        "schedule": [
        17.04000092,
        5,
        0,
        9
        ]
    },
    {
        "pixels": [
          16711680,
          16712192,
          16712960,
          16713728,
          16714496,
          16715264,
          16716032,
          16716544,
          16717312,
          16718080,
          16718848,
          16719616,
          16720384,
          16720896,
          16721664,
          16722432,
          16723200,
          16723968,
          16724736,
          16725248,
          16726016,
          16726784,
          16727552,
          16728320,
          16729088,
          16729600,
          16730368,
          16731136,
          16731904,
          16732672,
          16733440,
          16733952,
          16734720,
          16735488,
          16736256,
          16737792,
          16737792,
          16736512,
          16735488,
          16734464,
          16733440,
          16732416,
          16731392,
          16730368,
          16729344,
          16728320,
          16727296,
          16726272,
          16725248,
          16723968,
          16722944,
          16721920,
          16720896,
          16719872,
          16718848,
          16717824,
          16716800,
          16715776,
          16714752,
          16713728,
          16712704,
          16711680,
          16720640,
          16721920,
          16723456,
          16724992,
          16726272,
          16727808,
          16729344,
          16730624,
          16732160,
          16733696,
          16734976,
          16736512,
          16738048,
          16739584,
          16740864,
          16742400,
          16743936,
          16745216,
          16746752,
          16748288,
          16749568,
          16751104,
          16752640,
          16753920,
          16755456,
          16758528,
          16756480,
          16754688,
          16752896,
          16751104,
          16749312,
          16747520,
          16745728,
          16743936,
          16742144,
          16740352,
          16738560,
          16736768,
          16734976,
          16733184,
          16731392,
          16729600,
          16727808,
          16726016,
          16724224,
          16722432,
          16720640,
          4278203903,
          4278203903,
          4278203903,
          4278203903,
          4278203903,
          4278203903,
          4278203903,
          4278203903,
          4278203903,
          4278203903,
          4278203903
        ],
        "dividers": [
          62,
          109,
          0,
          0
        ],
        "time": 1674527913,
        "effectSpeed": 100,
        "profile": 1,
        "schedule": [
          17.04000092,
          5,
          0,
          9
        ]
    },
    {
        "pixels": [
          16711680,
          16722176,
          16732928,
          16743424,
          16753920,
          16764672,
          16775168,
          14548736,
          11796224,
          9109248,
          6356736,
          3669760,
          982784,
          65308,
          65349,
          65390,
          65432,
          65473,
          65514,
          60159,
          49663,
          39167,
          28415,
          17919,
          7423,
          917759,
          3604735,
          6291711,
          9044223,
          11731199,
          14483711,
          16711928,
          16711887,
          16711845,
          16711804,
          16711763,
          16711739,
          16711798,
          16711857,
          16711915,
          14156031,
          10289407,
          6422783,
          2556159,
          5375,
          20223,
          35327,
          50431,
          65535,
          65476,
          65417,
          65358,
          65300,
          2621184,
          6487808,
          10354432,
          14221056,
          16771840,
          16756992,
          16741888,
          16726784,
          16711680,
          16711680,
          16727296,
          16742912,
          16758784,
          16774400,
          13434624,
          9436928,
          5439232,
          1376000,
          65321,
          65382,
          65443,
          65504,
          57599,
          41983,
          26367,
          10751,
          1310975,
          5374207,
          9371903,
          13369599,
          16711925,
          16711864,
          16711802,
          16711747,
          16711813,
          16711880,
          15991039,
          11600127,
          7274751,
          2883839,
          5887,
          23039,
          39935,
          57087,
          65502,
          65435,
          65369,
          65302,
          2948864,
          7339776,
          11665152,
          16056064,
          16762880,
          16745728,
          16728832,
          16711680,
          16711680,
          16747264,
          15269632,
          6160128,
          65326,
          65465,
          47615,
          12031,
          6095103,
          15204607,
          16711819
        ],
        "dividers": [
          62,
          109,
          0,
          0
        ],
        "time": 1674527937,
        "effectSpeed": 100,
        "profile": 2,
        "schedule": [
          17.04000092,
          5,
          0,
          9
        ]
      }

]