import { useEffect, useRef } from "react";
import { Interval } from "./hooks-types";
import { Mutex } from "async-mutex";

export function useInterval(callback: () => void, delay: number) : Interval {
    const intervalRef = useRef<NodeJS.Timeout>(undefined);
    const intervalMutex = useRef<Mutex>(new Mutex());

    return {
        startInterval: async (intervalDelay : number = delay) => {
            await intervalMutex.current.waitForUnlock();
            intervalMutex.current.runExclusive(() => {
                if(!intervalRef.current){
                    intervalRef.current = setInterval(callback, intervalDelay);
                }
            });
        },
        stopInterval: async () => {
            if(intervalRef.current){
                clearInterval(intervalRef.current)
                intervalRef.current = undefined;
            }
        }
    }
}