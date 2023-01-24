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
        width: "3.3em",
        fontSize: "1em"
    }
  
    return (
        <div style={style}>
            <span style={{fontSize: ".8em"}}>Profile:</span>
            <div style={{position: "relative"}}>
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
                <svg style={{position: "absolute", right: "5px", bottom: "20%", pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
            </div>
        </div>
    );
  }
  