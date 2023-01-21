import { getPreferences, savePreferences } from '../utils/API'
import { useState, useRef, useEffect } from 'react';

export default function PreferencePanel({get, set}) {

    const pinRef = useRef();
    const bitOrderRef = useRef();
    const ssidRef = useRef();
    const wifiPasswordRef = useRef();
    const bonjourNameRef = useRef();

    const [pin, setPin] = useState(5);
    const [bitOrder, setBitOrder] = useState();
    const [ssid, setSsid] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [bonjourName, setBonjourName] = useState("");


    const style = {
        backgroundColor: '#555555ee',
        width: '500px',
        height: "400px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        MozBackdropFilter: "blur(8px)",
        border: '1px solid #ffffff33',
        borderRadius: '3px',
        padding: '10px',

    }

    const inputStyle = {
        width: "200px",
        fontSize: "1.2em",
    }

    const buttonStyle = {
        position: "absolute",
        right: "5px",
        bottom: "5px",
        backgroundColor: "#666666",
        padding: "10px",
        textDecoration: "none",
        color: "#ffffff",
        borderRadius: "4px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#ffffff22",
        boxShadow: "2px 2px 2px #00000044",
        // width: "100px",

    }

    useEffect(() => {

        pinRef.current.value=pin;
        bitOrderRef.current.value=bitOrder;
        (async () => {
            const result = await getPreferences(get.addressTextBox);
            setPin(+result.pin);
            setBitOrder(+result.bitOrder);
            setSsid(result.ssid);
            setWifiPassword(result.password);
            setBonjourName(result.bonjour);

            pinRef.current.value=result.pin;
            bitOrderRef.current.value=result.bitOrder;
            ssidRef.current.value=result.ssid;
            wifiPasswordRef.current.value=result.password;
            bonjourNameRef.current.value=result.bonjour;

        })();

    },[]);

    async function handleSave() {
        try {

            await savePreferences(get.addressTextBox, pin, bitOrder, ssid, wifiPassword, bonjourName);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div style={style}>
                <span>Pin: </span>
                <select
                    ref={pinRef}
                    // value={textBox}
                    // name="effect-speed"
                    onChange={(e) => {setPin(e.target.value)}}
                    // type="text"
                    // placeholder="#"
                    style={inputStyle}
                >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                    <option value={11}>11</option>
                    <option value={12}>12</option>
                    <option value={13}>13</option>
                    <option value={14}>14</option>
                    <option value={15}>15</option>
                    <option value={16}>16</option>

                </select>
            <br />
            <span>Bit Order: </span>
            <select
                ref={bitOrderRef}
                // value={textBox}
                // name="effect-speed"
                onChange={(e) => {setBitOrder(e.target.value)}}
                // type="text"
                // placeholder="#"
                style={inputStyle}
            >
                <option value={6}>RGB</option>
                <option value={9}>RBG</option>
                <option value={82}>GRB (most common)</option>
                <option value={161}>GBR</option>
                <option value={88}>BRG</option>
                <option value={164}>BGR</option>

                <option value={27}>WRGB</option>
                <option value={30}>WRBG</option>
                <option value={39}>WGRB</option>
                <option value={54}>WGBR</option>
                <option value={45}>WBRG</option>
                <option value={57}>WBGR</option>

                <option value={75}>RWGB</option>
                <option value={78}>RWBG</option>
                <option value={135}>RGWB</option>
                <option value={198}>RGBW</option>
                <option value={141}>RBWG</option>
                <option value={201}>RBGW</option>

                <option value={99}>GWRB</option>
                <option value={114}>GWBR</option>
                <option value={147}>GRWB</option>
                <option value={210}>GRBW (most common)</option>
                <option value={177}>GBWR</option>
                <option value={225}>GBRW</option>

                <option value={108}>BWRG</option>
                <option value={120}>BWGR</option>
                <option value={156}>BRWG</option>
                <option value={216}>BRGW</option>
                <option value={180}>BGWR</option>
                <option value={228}>BGRW</option>



            </select>

            <br />
            <span>SSID:</span>
            <input
                ref={ssidRef}
                value={ssid}
                name="ssid"
                onChange={(e) => {setSsid(e.target.value)}}
                type="text"
                placeholder=""
                style={inputStyle}
            />
            <br />
            <span>Wifi Password:</span>
            <input
                ref={wifiPasswordRef}
                value={wifiPassword}
                name="wifiPassword"
                onChange={(e) => {setWifiPassword(e.target.value)}}
                type="text"
                placeholder=""
                style={inputStyle}
            />
            <br />
            <span>Bonjour Name:</span>
            <input
                ref={bonjourNameRef}
                value={bonjourName}
                name="bonjourName"
                onChange={(e) => {setBonjourName(e.target.value)}}
                type="text"
                placeholder=""
                style={inputStyle}
            />

            <button style={buttonStyle} onClick={handleSave}
            >Save</button>
        </div>
    )
}
