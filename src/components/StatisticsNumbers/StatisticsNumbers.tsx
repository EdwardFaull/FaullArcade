import React from "react";
import "./statisticsnumbers.css";

export type StatisticsNumbersType = {
    stats : { title : string, value : number }[];
    hr? : boolean;
}

export default function StatisticsNumbers( {stats, hr=true} : StatisticsNumbersType ) {

    return (
        <div className="stats-numbers-container">
            {hr && <hr className="stats-numbers-hr"/>}
                <div className="stats-numbers-flex">
                    {
                        stats.map((stat, i) => 
                        <div key={i} className="pt-serif stats-numbers-item">
                            <span className="stats-numbers-number">{stat.value}</span>
                            <br /> {stat.title}
                        </div>)
                    }
                </div>
            {hr && <hr className="stats-numbers-hr"/>}
        </div>
    );
}