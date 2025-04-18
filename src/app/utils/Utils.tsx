import { ReactNode } from "react";

export function getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max);
}

const daySuffixTable = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
const monthTable = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getDate() : ReactNode {
    const date = new Date();
    const day = date.getDate();
    const daySuffix = daySuffixTable[day % 10];
    const month = monthTable[date.getMonth()];
    const year = date.getFullYear();
    return (
        <><b>{day}<sup>{daySuffix}</sup> of {month}, {year}</b></>
    );
}