import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 jam

function App() {
    const [user, setUser] = useState(() => {
        const savedSession = localStorage.getItem("session");

        if (!savedSession) {
            return null;
        }

        try {
            const session = JSON.parse(savedSession);

            if (
                !session ||
                !session.user ||
                !session.user.id ||
                !session.expiresAt
            ) {
                localStorage.removeItem("session");
                return null;
            }

            if (Date.now() > session.expiresAt) {
                localStorage.removeItem("session");
                return null;
            }

            return session.user;
        } catch (error) {
            console.error("Invalid session data:", error);
            localStorage.removeItem("session");
            return null;
        }
    });

    const [page, setPage] = useState("login");

    const handleLogin = (userData) => {
        const session = {
            user: userData,
            expiresAt: Date.now() + SESSION_DURATION
        };

        localStorage.setItem(
            "session",
            JSON.stringify(session)
        );

        // Hapus session lama jika masih ada
        localStorage.removeItem("user");

        setUser(userData);
        setPage("login");
    };

    const handleLogout = () => {
        localStorage.removeItem("session");
        localStorage.removeItem("user");

        setUser(null);
        setPage("login");
    };

    if (user && user.id) {
        return (
            <Dashboard
                user={user}
                onLogout={handleLogout}
            />
        );
    }

    if (page === "register") {
        return (
            <Register
                onSwitchToLogin={() => setPage("login")}
            />
        );
    }

    return (
        <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setPage("register")}
        />
    );
}

export default App;