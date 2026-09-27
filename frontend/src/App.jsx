import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
    const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
        return null;
    }

    try {
        const parsedUser = JSON.parse(savedUser);

        if (!parsedUser || !parsedUser.id) {
            localStorage.removeItem("user");
            return null;
        }

        return parsedUser;
    } catch (error) {
        console.error("Invalid user data:", error);
        localStorage.removeItem("user");
        return null;
    }
});

    const [page, setPage] = useState("login");

    const handleLogin = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setPage("login");
    };

    const handleLogout = () => {
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