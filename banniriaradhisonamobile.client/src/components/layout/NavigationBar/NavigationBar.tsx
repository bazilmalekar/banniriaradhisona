import React from "react";
import { NavLink } from "react-router";

const NavigationBar: React.FC = () => {
    return (
        <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/songs">songs</NavLink>
            <NavLink to="/favourites">Favourites</NavLink>
            <NavLink to="/downloads">Downloads</NavLink>
            <NavLink to="/playlists">Playlists</NavLink>
        </>
    );
}

export default NavigationBar;