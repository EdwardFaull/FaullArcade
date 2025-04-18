import { AnimContainerProps } from "@/types";
import React from "react";
import "./AnimContainer.css"

export default function AnimContainer({order=1, children, delay=100, close=false, open=false, offset=0,} : AnimContainerProps) {

    return (
        <div 
        className={"anim-container" + (close ? " anim-container-close" : "") + (open ? " anim-container-open" : "")} 
        style={{animationDelay: (offset + (order * delay)) + "ms", order: order}}>
            {children}
        </div>
    )

}