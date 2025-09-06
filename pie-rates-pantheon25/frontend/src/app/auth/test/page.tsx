"use client";

import { useAuth } from "@/context/AuthContext";

const AuthTest = () => {
  const { isAuthenticated, isLoading, user, login, register, logout } =
    useAuth();

  const handleLogin = async () => {
    try {
      await login("test@example.com", "password123");
      alert("Login successful!");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`Login failed: ${msg}`);
    }
  };

  const handleRegister = async () => {
    try {
      await register("Test User", "test@example.com", "password123");
      alert("Registration successful!");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`Registration failed: ${msg}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logout successful!");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`Logout failed: ${msg}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>

      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Auth State:</h2>
        <p>
          <strong>isAuthenticated:</strong> {isAuthenticated ? "Yes" : "No"}
        </p>
        <p>
          <strong>isLoading:</strong> {isLoading ? "Yes" : "No"}
        </p>
        <p>
          <strong>User:</strong> {user ? JSON.stringify(user) : "No user"}
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Test Login
        </button>

        <button
          onClick={handleRegister}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Test Register
        </button>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Test Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthTest;
