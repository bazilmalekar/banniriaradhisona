import React from "react";
import AppHeadder from "../AppHeadder/AppHeadder";
import { Outlet } from "react-router";
import NavigationBar from "../NavigationBar/NavigationBar";

const Layout: React.FC = () => {
    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-transparent text-foreground">
            <AppHeadder />
            <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <Outlet />
            </main>
            <NavigationBar />
        </div>
    );
};

export default Layout;
