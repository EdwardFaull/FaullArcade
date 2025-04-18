'use client'
import RecipeCard from "@/components/RecipeCard/RecipeCard";
import { useRouter } from "next/navigation";
import Recipes from "./recipes.json";
import "./recipespage.css"


export default function RecipesPage () {
    const router = useRouter();

    const routerCallback = (id: string) => {
        router.push(`/recipes/${id}`);
    }

    return (
        <div className="recipes-layout">
            <div className="recipes-preamble-container">
                <h1 className="recipes-page-text recipes-page-header">Recipes</h1>
                <p className="recipes-page-text">You may be asking yourself who this page is for. Me. The answer is me. 
                    I don't want to have to message myself on WhatsApp or use ugly notes apps. Instead, I want to spend an unnecessary amount of time (and hosting money) to look at the recipes I use in a fancy way. 
                    Almost all of these are stolen.</p>
                <hr />
            </div>
            <div className="recipes-cards-container">
                {
                    Recipes.recipes.map(
                        (r) => <RecipeCard 
                        key={r.id}
                        location={r.id}
                        imagePath="/img/tetris-poster.png"
                        callback={routerCallback}
                        header={r.title} 
                        description={r.cardDescription}/>        
                    )
                }
            </div>
        </div>
    );
}