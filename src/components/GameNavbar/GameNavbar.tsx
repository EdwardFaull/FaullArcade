import { useRouter } from "next/navigation";
import Icon from "../Icon/Icon";
import { ReactNode } from "react";
import "./gamenavbar.css"

export type GameNavbarType = {
    showLeave? : boolean;
    children?: ReactNode;
    navbarAlign?: string;
    solidBg?: boolean;
    enabled? : boolean;
}

export type GameNavbarButtonType = {
    button: string | ReactNode;
    onClick: () => void;
    animate? : boolean;
}

export const GAME_NAVBAR_ICON_DIM = {height: "30px", width: "30px"};

export const GameNavbarButton = ({button, onClick, animate=false} : GameNavbarButtonType) => {
    return (
        <div onClick={onClick} className="game-navbar-item" style={animate ? {} : {animation: "none", opacity: "75%"}}>
            <button className="game-navbar-button">
                {button}
            </button>
        </div> 
    )
}

export default function GameNavbar( {showLeave=true, children=<></>, navbarAlign="flex-end", solidBg=false, enabled=true} : GameNavbarType ) {
    const router = useRouter();

    return (
        <div className={`game-navbar-container ${solidBg ? "game-navbar-opaque" : ""}`}>
            { showLeave && 
                <GameNavbarButton animate onClick={() => router.push("/games")} button={<Icon iconName="chevron" iconProps={{ ...GAME_NAVBAR_ICON_DIM}}/>} />
            }
            <div className="game-navbar-buttons-container" style={{justifyContent: navbarAlign}}>
                {children}
            </div>
            {
                !enabled && <div className="game-navbar-overlay" />
            }
        </div>
    );

}