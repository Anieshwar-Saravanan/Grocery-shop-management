import React from "react";
import { Link } from "react-router-dom";
export default function homePage(){
    return(
        <div>
        <h1>Welcome to online grocery shopping portal</h1>
        <h2><Link to = "/login">Sign in</Link></h2>
        </div>
    );
}