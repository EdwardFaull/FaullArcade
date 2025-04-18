import { useEffect } from "react";

export function useKeyPress(callback: (event? : any, ...args: any[]) => void, key?: string, ignoreRepeat: boolean=false, deps: any[]=[], ...args : any[]) : void {
    useEffect(() => {
        function handler(e: KeyboardEvent) {
            if(ignoreRepeat && e.repeat){
                return;
            }
            if(key && e.key === key || !key){
                if(key){
                    e.preventDefault();
                }
                callback(e, args);
            }
        }

        document.addEventListener("keydown", handler);

        return () => {
            document.removeEventListener("keydown", handler);
        }
    }, deps)
}