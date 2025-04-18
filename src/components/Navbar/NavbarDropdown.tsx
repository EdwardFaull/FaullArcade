import { DropdownProps } from "@/types";
import React, { useState } from "react";
import Icon from "../Icon/Icon";

export default function NavbarDropdown({title,subtitles,callback} : DropdownProps) {

    const [open, setOpen] = useState(false);

    return (
        <div className="navbar-dropdown-container" 
            onMouseOver={() => setOpen(true)} onFocus={() => setOpen(true)} 
            onMouseOut={() => setOpen(false)} onBlur={() => setOpen(false)}>
            <div key="navbar-title" className="navbar-title">
                <button onClick={() => callback(title.location)} className="navbar-button primary">
                    {title.text}
                    {<Icon iconName="triangle" iconProps={{"className": "navbar-icon" + (open ? " rotate" : ""), "opacity": (subtitles.length > 0 ? "1" : "0")}} />}
                </button>
            </div>
            {
                subtitles.length > 0 &&
                <div key="navbar-dropdown" className="navbar-dropdown">
                    <hr className="navbar-hr"/>
                    {
                        subtitles.map((subtitle, i) => {
                            return <div key={"navbar-subtitle-"+i}>
                                <button onClick={() => callback(subtitle.location)} className="navbar-button secondary" >{subtitle.text}</button>
                            </div>
                        })
                    }
                </div>
            }
        </div>
    );
}