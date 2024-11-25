import React, { useState } from "react";
import { TodoProvider } from "./context/Contetx";
import TodoInput from "./Components/TodoInput";
import TodoList from "./Components/TodoList";
import Login from "./Components/Login";

function App() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      {isLoggedIn ? (
        // If logged in, render TodoProvider and its components
        <TodoProvider>
          <div className="w-full max-w-2xl px-4 sm:px-6 md:px-8 bg-white rounded-lg shadow-lg pb-6">
            <TodoInput />
            <TodoList />
            {/* Logout button */}
            <button
              onClick={() => setIsLoggedIn(false)} // Log out
              className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </TodoProvider>
      ) : (
        // If not logged in, show Login component
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
