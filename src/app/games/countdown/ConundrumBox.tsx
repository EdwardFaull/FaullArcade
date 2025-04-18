import { ConundrumBoxProps } from "@/types";
import React from "react";
import "./conundrumbox.css"

export default function ConundrumBox({showContent, delay=1, fade=false, margin=true, children}: ConundrumBoxProps){
    const style: any = {animationDelay: (delay * 200) + "ms"};
    if(!margin){
        style['marginBottom'] = '0px';
    }
    return (
        <div className={"conundrum-row-container" + (fade ? " conundrum-box-fade" : "")} style={style}>
            <div className="conundrum-row">
                <div className="conundrum-row-wrapper">
                <div className={"conundrum-row-box" + (showContent ? "" : " conundrum-closed")} style={{transitionDelay: (delay * 200) + "ms"}}>
                    <div className="conundrum-box cell conundrum-empty"/>
                    {children}
                </div>
                </div>
            </div>
        </div>
    );
}