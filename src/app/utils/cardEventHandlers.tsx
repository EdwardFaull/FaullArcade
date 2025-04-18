
export const onMouseMove = (e: React.MouseEvent, cardRef: React.RefObject<Element | null>, rotateSize : number = 8, scale : number = 1) => {
        let fac_X = 0;
        let fac_Y = 0;
        if(cardRef.current){
            const clientRect = cardRef.current.getBoundingClientRect();
            fac_X = 2 * (e.pageX - clientRect.left) / clientRect.width - 1;
            fac_Y = 2 * (e.pageY - clientRect.top) / clientRect.height - 1;
            cardRef.current.style.transform = `rotateY(${Math.floor(fac_X * rotateSize)}deg) rotateX(${Math.floor(-fac_Y * rotateSize)}deg) scale(${scale})`;
        }   
    }

export const onMouseLeave = (cardRef: React.RefObject<Element | null>) => {
    if(cardRef.current){
        cardRef.current.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    }
}
