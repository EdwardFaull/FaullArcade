import { useEffect } from "react";
import { Interval } from "./hooks-types";

export function useKeyHold(interval: Interval, key: string) : void {
    useEffect(() => {
        function startInterval(e: KeyboardEvent) {
            if(e.repeat){
                return;
            }
            if(e.key === key){
                interval.startInterval();
                e.preventDefault();
            }
        }

        function stopInterval(e: KeyboardEvent) {
            if(e.key === key){
                interval.stopInterval();
                e.preventDefault();
            }
        }

        document.addEventListener("keydown", startInterval);
        document.addEventListener("keyup", stopInterval);

        return () => {
            document.removeEventListener("keydown", startInterval);
            document.removeEventListener("keyup", stopInterval);
        }
    }, [])
}