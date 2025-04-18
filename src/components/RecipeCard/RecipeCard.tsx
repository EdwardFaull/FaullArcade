import { CardProps } from "@/types";
import React, { ReactNode, useRef } from "react";
import "./recipecard.css";
import { onMouseLeave, onMouseMove } from "@/app/utils/cardEventHandlers";

export default function RecipeCard({header, description="", location, imagePath, imageStyle="portrait", callback} : CardProps) {

    const cardRef = useRef<HTMLDivElement>(null);
    
    return (
        <div className="recipe-card-wrapper">
            <div onMouseMove={(e) => onMouseMove(e, cardRef, 6)} onMouseLeave={() => onMouseLeave(cardRef)} onClick={() => callback(location)} className="recipe-card-container" ref={cardRef}>
                <div className="recipe-card-square" >
                    <div className="recipe-card-image-container">
                        <img className={"recipe-card-image-" + imageStyle} src={imagePath} />
                    </div>
                    <div className="recipe-card-overlay">
                        <div className="recipe-card-text-container">
                            <h3 className="recipe-card-text recipe-card-text-header">{header}</h3>
                            <div className="recipe-card-info-container">
                                <p className="recipe-card-text info">{description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )

}