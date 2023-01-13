import { getData } from '../utils/API';

export default function Profile({setLoadingParent, get, set}) {
    const { setProfile, setError } = set;
    const handleSubmit = async (e) => {
        setProfile(e.target.value);
        // setLoading(true);
        setLoadingParent(true);
        setError(false);
        try {
            await getData(e.target.value, get, set);
            // setLoading(false);
            setLoadingParent(false);
        }
        catch (error) {
            console.error(error);
            // setLoading(false);
            setLoadingParent(false);
            setError(true);
        }
    }

    const style = {
        display: 'flex',
        flexDirection: 'column',
        margin: "10px",
        backgroundColor: "#444444"
    }

    const inputStyle = {
        width: "100px",
        fontSize: "1.6em",
    }
  
    return (
        <div style={style}>
            <span>Profile:</span>
            <select
                // value={textBox}
                // name="effect-speed"
                onChange={handleSubmit}
                // type="text"
                // placeholder="#"
                style={inputStyle}
            >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                {/* <option value={3}>3</option> */}
            </select>
        </div>
    );
  }
  