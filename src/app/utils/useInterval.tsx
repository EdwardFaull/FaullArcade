import { useEffect, useRef } from "react";
import { Interval } from "./hooks-types";

export function useInterval(callback: () => void, delay: number) : Interval {
    const intervalRef = useRef<NodeJS.Timeout>(undefined);

    return {
        startInterval: (intervalDelay : number = delay) => {
            intervalRef.current = setInterval(callback, intervalDelay);
        },
        stopInterval: () => {
            if(intervalRef.current){
                clearInterval(intervalRef.current)
                intervalRef.current = undefined;
            }
        }
    }
}