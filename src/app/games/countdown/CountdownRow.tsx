
type CountdownRowProps = {
    text: string;
    colour: string;
    index: number;
}

export default function CountdownRow( {text, colour, index} : CountdownRowProps ) {
    return (
        <div className="countdown-help-table">
            <div className="countdown-row">
            {
                [...Array(9).keys()].map(
                    (i) => 
                    <div key={i} className={`countdown-help-square`} style={{animation: 'none', backgroundColor: i == index ? colour : "transparent"}}> 
                        <p className="countdown-text countdown-text-white atkinson-hyperlegible-mono" style={{fontSize: "150%", color: i == index ? "white" : "black"}} >{text[i].toUpperCase()}</p> 
                    </div>
                )
            }
            </div>
        </div>
        
    );
}