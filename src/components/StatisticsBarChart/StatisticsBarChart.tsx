import React, { useMemo } from "react";
import "./statisticsbarchart.css";

export type StatisticsBarChartData = { bin : string, value : number }[];

export type StatisticsBarChartType = {
    title?: string,
    highlight?: string,
    highlightColour?: string,
    stats : StatisticsBarChartData;
}

export default function StatisticsBarChart( { title="", highlight="", highlightColour="", stats } : StatisticsBarChartType ) {

    const weights: number[] = useMemo(() => {
        const sum = stats.map((x) => x.value).reduce((a, b) => a+b);
        const ratios = stats.map((x) => x.value);
        const scale = sum / (1.25 * Math.max(...ratios));
        return ratios.map((x) => scale * x / sum);
    }, [stats])

    return (
        <div className="stats-barchart-container">
            <h3>{title}</h3>
            {
                stats.map((stat, i) => 
                    <div key={i} className="stats-barchart-row">
                        <div className="stats-barchart-key"><b>{stat.bin}</b></div>
                        <div className="stats-barchart-bar" 
                        style={{ ...(highlight === stat.bin ? {backgroundColor: highlightColour} : {}), width: `${100 * weights[i]}%`, animationDelay: `${i * 125}ms`}}>
                            <p className="stats-barchart-value"><b>{stat.value}</b></p>
                        </div>
                    </div>
                )
            }
        </div>
    );
}