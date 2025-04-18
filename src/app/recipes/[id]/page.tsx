'use client'
import { CSSProperties, useEffect, useState } from "react";
import Recipes from "../recipes.json";
import { Recipe } from "@/types";
import "../recipespage.css"
import "./recipepage.css"
import { useParams, useRouter } from "next/navigation";

export default function RecipePage() {

    const router = useRouter();
    const params = useParams();
    const [recipe, setRecipe] = useState<Recipe>();
    const [accent, setAccent] = useState<CSSProperties>();


    useEffect(() => {
        const recipes = Recipes.recipes;
        const foundRecipe = recipes.find((x) => x.id === params.id);
        if(foundRecipe === undefined){
            router.push("/recipes");
        }
        else{
            const newRecipe = foundRecipe as Recipe;
            setRecipe(newRecipe);
            const accentColour = newRecipe.accent;
            setAccent({backgroundColor: `var(--solar${accentColour})`});
        }
    }, [])

    return (
        <div className="recipes-layout">
            <div className="recipe-container">
                <h1 className="pt-serif recipe-text">{recipe?.title}</h1>
                <p className="pt-serif recipe-text">{recipe?.description}</p>
                <img src={recipe?.cardImage}/>
                <div className="recipe-content-container pt-serif"> 
                    <div className="recipe-ingredients-container">
                        <h2 className="pt-serif recipe-text">Ingredients</h2>
                        <div className="recipe-ingredients-table">
                            {
                                recipe?.ingredients.map(
                                    (group, i) => {
                                        return (
                                            <>
                                                {recipe.ingredients.length > 1 && <div className="recipe-ingredients-row">
                                                    <div className="recipe-ingredients-cell cell-quantity recipe-text-quantity" 
                                                    style={i == 0 ? {borderTopLeftRadius: "24px", ...accent} : {...accent}} />
                                                    <div className="recipe-ingredients-cell cell-item recipe-text" 
                                                    style={i == 0 ? {borderTopRightRadius: "24px"} : {}} >
                                                        <em>For the {group.title}</em>
                                                    </div>
                                                </div>}
                                                {
                                                    group.ingredients.map(
                                                        (ingredient, j) => {
                                                            return <div className="recipe-ingredients-row" key={'row-'+j}>
                                                                <div className="recipe-ingredients-cell cell-quantity recipe-text-quantity" 
                                                                style={
                                                                    i == recipe.ingredients.length - 1 && 
                                                                    j == group.ingredients.length - 1 ? 
                                                                        {borderBottomLeftRadius: "24px", ...accent} : 
                                                                    (j == 0 && recipe.ingredients.length == 1 ? {borderTopLeftRadius: "24px", ...accent} : {...accent})}>
                                                                    <b>{ingredient.quantity} {ingredient.unit}</b>
                                                                </div>
                                                                <div className="recipe-ingredients-cell cell-item recipe-text" 
                                                                style={
                                                                    i == recipe.ingredients.length - 1 && 
                                                                    j == group.ingredients.length - 1 ? 
                                                                        {borderBottomRightRadius: "24px"} : 
                                                                    (j == 0 && recipe.ingredients.length == 1 ? {borderTopRightRadius: "24px"} : {})}>
                                                                    {ingredient.item}
                                                                </div>
                                                            </div>
                                                        }
                                                    )
                                                }
                                                
                                            </> 
                                        )
                                    }
                                )
                            }
                        </div>
                    </div>
                    <div className="recipe-vr" style={{borderColor: accent?.backgroundColor}}/>
                    <div className="recipe-steps-container">
                        <h2 className="pt-serif recipe-text">Method</h2>
                        {
                            recipe?.steps.map(
                                (group,i) => {
                                    return (
                                        <div key={'group-'+i}>
                                            {recipe.steps.length > 1 && <div className="recipe-steps-line recipe-text">
                                                <em>For the {group.title}</em>
                                            </div>}
                                            {
                                                group.steps.map((step, j) => {
                                                    return (
                                                        <div className="recipe-steps-box recipe-text" key={'row-'+j}>
                                                            <div className="recipe-steps-box-accent" style={accent}/>
                                                            <div className="recipe-steps-box-text">{j + 1}. {step}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}