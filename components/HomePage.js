import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ color: "#2c3e50", fontSize: "2.5rem" }}>
                Welcome to Online Grocery Shopping Portal
            </h1>
            <h2>
                <Link
                    to="/login"
                    style={{
                        textDecoration: "none",
                        color: "white",
                        backgroundColor: "#3498db",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        fontSize: "1.2rem",
                    }}
                >
                    Sign In
                </Link>
            </h2>
        </div>
    );
}
