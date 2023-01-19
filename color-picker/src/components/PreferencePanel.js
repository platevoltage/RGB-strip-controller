import { getPreferences } from '../utils/API'
import { useState, useRef, useEffect } from 'react';

export default function PreferencePanel({get, set}) {

    const pinRef = useRef();
    const bitOrderRef = useRef();
    const [pin, setPin] = useState(5);
    const [bitOrder, setBitOrder] = useState("GRB");


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
        width: "100px",
        fontSize: "1.6em",
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
            setPin(result.pin);
            setBitOrder(result.bitOrder);
            pinRef.current.value=result.pin;
            bitOrderRef.current.value=result.bitOrder;
        })();

    },[])
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
                <option value={"RGB"}>RGB</option>
                <option value={"RBG"}>RBG</option>
                <option value={"GRB"}>GRB (most common)</option>
                <option value={"GBR"}>GBR</option>
                <option value={"BRG"}>BRG</option>
                <option value={"BGR"}>BGR</option>

                <option value={"WRGB"}>WRGB</option>
                <option value={"WRBG"}>WRBG</option>
                <option value={"WGRB"}>WGRB</option>
                <option value={"WGBR"}>WGBR</option>
                <option value={"WBRG"}>WBRG</option>
                <option value={"WBGR"}>WBGR</option>

                <option value={"RWGB"}>RWGB</option>
                <option value={"RWBG"}>RWBG</option>
                <option value={"RGWB"}>RGWB</option>
                <option value={"RGBW"}>RGBW</option>
                <option value={"RBWG"}>RBWG</option>
                <option value={"RBGW"}>RBGW</option>

                <option value={"GWRB"}>GWRB</option>
                <option value={"GWBR"}>GWBR</option>
                <option value={"GRWB"}>GRWB</option>
                <option value={"GRBW"}>GRBW (most common)</option>
                <option value={"GBWR"}>GBWR</option>
                <option value={"GBRW"}>GBRW</option>

                <option value={"BWRG"}>BWRG</option>
                <option value={"BWGR"}>BWGR</option>
                <option value={"BRWG"}>BRWG</option>
                <option value={"BRGW"}>BRGW</option>
                <option value={"BGWR"}>BGWR</option>
                <option value={"BGRW"}>BGRW</option>



            </select>

            <button style={buttonStyle} onClick={
                async () => {
                    const result = await getPreferences(get.addressTextBox);
                    setPin(result.pin);
                    setBitOrder(result.bitOrder);
                    pinRef.current.value=result.pin;
                    bitOrderRef.current.value=result.bitOrder;

                } 
            }
            >Save</button>{get.addressTextBox}
        </div>
    )
}
