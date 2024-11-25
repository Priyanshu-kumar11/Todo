import { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase"; 
import axios from "axios";

// Create the context
const TodoContext = createContext();

// Create the provider component
export const TodoProvider = ({ children }) => {
  const [listTodo, setListTodo] = useState([]); // Firestore todos
  const [apiTodos, setApiTodos] = useState([]); // API todos
  const [currPage, setCurrPage] = useState(1);
  const rowsPerPage = 5; // Rows per page set to 5

  // Fetch API Todos
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_REACT_APP_KEY; // Get the API URL from environment variable
    if (!apiUrl) {
      console.error("API URL is not defined in the environment variables!");
      return;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        const todosWithSource = response.data.todos.map((todo) => ({
          ...todo,
          id: String(todo.id), // Ensure IDs are strings
          source: "api", // Mark as API todo
        }));
        setApiTodos(todosWithSource);
      })
      .catch((error) => {
        console.error("Error fetching API todos:", error);
      });
  }, []);

  // Firestore listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todo"), (snapshot) => {
      setListTodo(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          todo: doc.data().todo,
          source: "firestore", // Mark as Firestore todo
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  // Add todo
  const addList = (inputText) => {
    if (inputText.trim() === "") {
      alert("Todo cannot be empty!");
      return;
    }
    addDoc(collection(db, "todo"), { todo: inputText.trim() })
      .then(() => {
        console.log("Todo added successfully!");
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  // Update todo
  const updateTodo = (id, newText, source) => {
    if (source === "api") {
      console.log("Cannot update API todos:", id);
      return;
    }

    if (newText.trim() === "") {
      alert("Todo cannot be empty!");
      return;
    }

    updateDoc(doc(db, "todo", id), { todo: newText.trim() })
      .then(() => {
        console.log("Todo updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };

  // Delete todo
  const deleteTodo = (id, source) => {
    if (source === "api") {
      console.log("Cannot delete API todos from Firestore:", id);
      return;
    }

    deleteDoc(doc(db, "todo", id))
      .then(() => {
        console.log("Todo deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  // Combine todos and apply pagination
  const combinedTodos = [...listTodo, ...apiTodos];
  const todosToDisplay = combinedTodos.slice(
    (currPage - 1) * rowsPerPage,
    currPage * rowsPerPage
  );

  // Handle page change
  const nextPage = () => {
    if ((currPage * rowsPerPage) < combinedTodos.length) {
      setCurrPage(currPage + 1);
    }
  };

  const prevPage = () => {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        addList,
        todosToDisplay,
        updateTodo,
        deleteTodo,
        nextPage,
        prevPage,
        currPage,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

// Create custom hook for using the context
export const useTodo = () => {
  return useContext(TodoContext);
};
