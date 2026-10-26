import React from "react";
import { Link } from "react-router";

const NotFound: React.FC = () => {
    return (
        <>
            <h1>Page Not found</h1>
            <Link to="/">Go to home</Link>
        </>
    );
}

export default NotFound;