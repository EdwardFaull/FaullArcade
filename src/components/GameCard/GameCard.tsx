import { CardProps } from "@/types";
import React, { ReactNode, useRef } from "react";
import "./gamecard.css";
import { onMouseLeave, onMouseMove } from "@/app/utils/cardEventHandlers";

export default function Card({header, description="", location, colour, callback} : CardProps) {

    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div onClick={() => callback(location)} className="card-container">
            <div className="card-square" ref={cardRef} style={{backgroundColor : colour}}>
                <div className="card-text-container">
                    <h3 className="text-serif header">{header}</h3>
                    <div className="card-info-container">
                        <p className="text-serif info">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    )

}