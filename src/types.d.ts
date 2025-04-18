import { Cookies } from "react-cookie";
import Icon from "./components/Icon/Icon";

export type CountdownDifficulty = "easy" | "normal";

export type TetrisBoard = {
    grid: number[][];
    pieceType: string;
    pieceCoords: number[];
    pieceColour: number;
    pieceShape: number[][];
    shiftDown: number;
    score: number;
    colours: number[];
    guideBlocks: Coord[];
    level: number;
    levelScore: number;
    gameOver: boolean;
}

export type Coord = {
    x: number;
    y: number;
}

export type TetrisLevel = {
    intervalMillis: number;
    showGuide: boolean;
    scoreBoundary: number;
}

export type Link = {
    text: string;
    location: string;
}

export type DropdownProps = {
    title: Link;
    subtitles: Link[];
    callback: (x : string) => void | boolean;
}

export type NavbarProps = {
    router: NextRouter;
}

export type IconProps = {
    iconName: string;
    iconProps: {[id: string]: string};
    pathProps?: {[id: string]: string};
}

export type ExpandableProps = {
    initialState: boolean;
    animate?: boolean;
    height?: "short" | "med" | "tall" | "vtall";
    heading?: string;
    children: ReactNode;
}

export type KeyboardSquareProps = {
    children: ReactNode;
}

export type CardProps = {
    header: string;
    description? : string;
    location: string;
    colour: string;
    callback: (s: string) => void;
}

export type Conundrum = {
    answer: string;
    prompt: string;
}

export type ConundrumData = {
    conundrum: string;
    word: string;
    antiWord: string;
    flip: number;
}

export type ConundrumBoxProps = {
    showContent: boolean;
    delay?: number;
    margin?: boolean;
    fade?: boolean;
    children;
}

export type Prop = {
    cookies: Cookies;
    animate?: boolean;
}

export type Coordinate = {
    x: number;
    y: number;
}

export type MinesweeperDifficulty = 'beginner' | 'intermediate' | 'expert';

export type MinesweeperStatus = "U" | "O" | "X";

export type MinesweeperCell = {
    status: MinesweeperStatus;
    value: number;
    delay?: number = 0;
};

export type MinesweeperBoard = {
    grid: MinesweeperCell[][];
    difficulty: MinesweeperDifficulty;
    cellsUnopened: number;
    mines: Coordinate[];
    flagCount: number;
    gameOver: boolean;
}

export type MinesweeperBoardSummaryProps = {
    board: MinesweeperBoard;
}

export type MinesweeperRadioButtonProps = {
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
    children: ReactNode;
    className? : string;
    value?: any;
    selector?: any;
}

export type AnimContainerProps = {
    children: ReactNode;
    order?: number;
    delay?: number;
    offset?: number;
    open?: boolean;
    close?: boolean;
}

export type IngredientGroup = {
    title: string;
    ingredients: Ingredient[];
}

export type StepGroup = {
    title: string;
    steps: string[];
}

export type Ingredient = {
    quantity: string;
    unit: string;
    item: string;
}

export type Recipe = {
    title: string;
    id: string;
    description: string;
    cardImage: string;
    cardDescription: string;
    ingredients: IngredientGroup[];
    steps: StepGroup[];
    tags: string[];
    accent: string;
    servings: string;
}