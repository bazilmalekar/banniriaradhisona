import React from "react";
import AppHeadder from "../AppHeadder/AppHeadder";
import { Outlet } from "react-router";
import NavigationBar from "../NavigationBar/NavigationBar";

const Layout: React.FC = () => {
    return (
        <div className="body_wrapper">
            <AppHeadder />
            <main className="app_body">
                <Outlet />
            </main>
            <NavigationBar />
        </div>
    );
}

export default Layout;