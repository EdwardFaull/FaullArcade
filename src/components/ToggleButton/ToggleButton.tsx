import Icon from "../Icon/Icon";
import "./togglebutton.css";
import React, { useState } from "react";

export type ToggleButtonProps = {
    onClick: () => void;
    onLabel: string;
    offLabel: string;
    onClass: string;
    offClass: string;
    initialValue: boolean;
    enabled: boolean;
};

export default function ToggleButton({onClick, onLabel, offLabel, onClass, offClass, initialValue, enabled} : ToggleButtonProps) {

    const [isOn, setIsOn] = useState(initialValue);    

    const handleOnClick = () => {
        if(!enabled) return;
        setIsOn((prevState) => !prevState);
        onClick();
    };

    return (
        <div className="toggle-button-container atkinson-hyperlegible-mono toggle-button-text-light" onClick={handleOnClick}>
            {!enabled && 
                <div className="toggle-overlay">
                    <Icon iconName="lock" iconProps={{viewBox: "0 0 256 256", width: "30px", height: "30px"}}/>
                </div>
            }
            <div style={{all: "inherit", ...(enabled ? {} : {opacity: "25%", transition: "opacity 0.25s ease-in-out"})}}>
                <div className="toggle-button-labels">
                    <p className={`toggle-button-text ${isOn ? "" : "toggle-button-text-show"} ${offClass}`}>{offLabel}</p>
                    <p className={`toggle-button-text ${isOn ? "toggle-button-text-show" : ""} ${onClass}`}>{onLabel}</p>
                </div>
                <div className="toggle-button-circle-wrapper">
                    <div className="toggle-button-switch">
                        <div className={`toggle-button-circle ${isOn ? "toggle-button-circle-on" : ""}`} />
                    </div>
                </div>
            </div>
            
        </div>
    );
}