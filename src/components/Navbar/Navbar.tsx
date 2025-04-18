import React, { useMemo } from "react";
import "./navbar.css";
import { DropdownProps, Link, NavbarProps } from "@/types";
import NavbarDropdown from "./NavbarDropdown";
import { usePathname } from "next/navigation";
import { isMobile } from "react-device-detect";

export default function Navbar({router} : NavbarProps) {

    const pathName = usePathname();

    const showNavbar = useMemo(() => !pathName.includes("/games/") || pathName.includes("/tetris"), [pathName, isMobile]);

    const navigate = (destination: string) : void => {
        router.push(destination);
    }

    const dropdowns: DropdownProps[] = [
        {title: {text: "Games", location: "/games"}, subtitles: [
            {text: "Tetris", location: "/games/tetris"},
            {text: "Minesweeper", location: "/games/minesweeper"},
            {text: "Conundrum", location: "/games/countdown"},
        ], callback: navigate},
        {title: {text: "Films", location: "/gallery"}, subtitles: [], callback: navigate},
        {title: {text: "Recipes", location:"/recipes"}, subtitles: [], callback: navigate},
        {title: {text: "Ramblings", location:"/blog"}, subtitles: [], callback: navigate}
    ]

    return showNavbar ? (
        <nav className="navbar-container">
            <div key='navlogo' className="navbar-links">
                <div key="navlogo" className="navbar-logo">
                    <button className="navbar-button heading" onClick={() => navigate("/")}>Faull's Arcade.</button>
                </div>
                <div key='navlinks' className="navbar-titles">
                    {
                        dropdowns.map((dropdown, i) => <NavbarDropdown key={"navlink"+i} {...dropdown}/>)
                    }
                </div>
            </div>
        </nav>
    ) : (<></>);
}