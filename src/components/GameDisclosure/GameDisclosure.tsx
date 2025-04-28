import { ReactNode, useState, useEffect } from "react";
import "./gamedisclosure.css";
import { GAME_NAVBAR_ICON_DIM, GameNavbarButton } from "../GameNavbar/GameNavbar";
import Icon from "../Icon/Icon";

export type GameDisclosureProps = {
    button: ReactNode;
    children: ReactNode;
    bg?: string;
    fullscreen?: boolean;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export default function GameDisclosure( {button, children, bg, fullscreen=false, isOpen, onOpen, onClose} : GameDisclosureProps ) {

    const [zIndex, setZIndex] = useState(-1);

    useEffect(() => {
        if(!isOpen){
            setTimeout(() => setZIndex(-1), 350);
        }
        else{
            setZIndex(100);
        }
    }, [isOpen])

    return ( 
    <>
        <GameNavbarButton onClick={onOpen} button={button} />
        <div className="game-disclosure-container" style={{zIndex : zIndex}}>
            <div className="game-disclosure-overlay" style={{backgroundColor: isOpen ? "rgba(0, 0, 0, 0.25)" : "transparent"}}/>
            <div className={`game-disclosure-box ${isOpen ? 'game-disclosure-open' : 'game-disclosure-closed'}`} 
                style={{backgroundColor: bg, height: fullscreen ? "100%" : "max-content"}}>
                <>
                    <div className="game-disclosure-exit">
                        <GameNavbarButton onClick={onClose} button={<Icon iconName="cross" iconProps={{...GAME_NAVBAR_ICON_DIM}}/>} />
                    </div>
                    <div className="game-disclosure-content">
                        {children}
                    </div>

                </>
            </div>
        </div>
    </> );
}