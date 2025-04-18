'use client'
import { ExpandableProps } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import "./expandable.css"
import "../Icon/icon.css"
import Icon from "../Icon/Icon";
import { useInterval } from "@/app/utils/useInterval";

export default function Expandable({initialState=true, animate=true, height="med", heading="", children}: ExpandableProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [headingIndex, setHeadingIndex] = useState(0);
    const interval = useInterval(() => {setHeadingIndex((prevState) => prevState + 1)}, 100);

    useEffect(() => {
        if(animate){
            if(heading){
                setTimeout(() => {}, 1000);
                interval.startInterval();
            }
            else{
                setIsOpen(initialState);
            }
            return () => {
                interval.stopInterval();
            };
        }
        else{
            if(heading){
                setHeadingIndex(heading.length);
            }
            setIsOpen(initialState);
        }
        
    }, [])

    useEffect(() => {
        if(headingIndex >= heading.length){
            interval.stopInterval();
            if(initialState){
                setIsOpen(true);
            }
        }
    }, [headingIndex])

    const openCloseExpandable = () => {
        setIsOpen((prevState) => !prevState);
    }

    return (
        <div className="expandable-container">
            {
                heading ? 
                <div className="expandable-heading-container">
                    <hr className="expandable-hr hr-heading" style={{minWidth: "30px", maxWidth: "30px"}}/>
                    <span 
                        className="expandable-text text-heading" 
                        style={headingIndex >= 0 ? {} : {"padding" : "0"}}>
                        {headingIndex > 0 ? heading.substring(0, headingIndex) : "_"}
                    </span>
                    <div className="expandable-heading-hr-container">
                        <hr className="expandable-hr hr-heading"/>
                    </div>
                </div> :
                <div className="expandable-heading-container">
                    <hr className="expandable-hr hr-heading" style={{minWidth: "100%", maxWidth: "100%"}}/>
                </div>
            }
            
            <div 
                className={"expandable-content" + (isOpen ? " opened" : " closed") + " " + height} 
            >
                {children}
            </div>
            <div className="expandable-bottomedge">
                <div className="expandable-hr-container">
                    <hr className={"expandable-hr" + (isOpen ? " hr-shift" : "")}/>
                </div>
                <div className="expandable-button-container">
                    <a className="expandable-button" onClick={openCloseExpandable}>
                        <Icon iconName="triangle" iconProps={{"className": "icon" + (isOpen ? "" : " rotate")}}/>
                    </a>
                </div>
                <div className="expandable-hr-container">
                    <hr className={"expandable-hr" + (isOpen ? " hr-shift" : "")}/>
                </div>
            </div>
        </div>
    );

}