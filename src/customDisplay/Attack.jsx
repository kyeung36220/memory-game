import attackImg from "../assets/customOverlay/attack.png"
import attackGlowImg from "../assets/customOverlay/attackGlow.png"

function Attack({currentCard, handleGuessClicked}) {
    return(
        <>
            <a id="attackNumber"
                onMouseEnter={() => document.querySelector("#attack").src = attackGlowImg}
                onMouseLeave={() => document.querySelector("#attack").src = attackImg}
                onClick={(e) => handleGuessClicked(e)}>
            {currentCard.attack}</a>
            <img id="attack" 
                src={attackImg}
                onMouseEnter={(e) => e.target.src=(attackGlowImg)}
                onMouseLeave={(e) => e.target.src=(attackImg)}
                onClick={(e) => handleGuessClicked(e)}/>
        </>
    )
}

export default Attack