import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import axios from "axios";

// Create the context
const TodoContext = createContext();

// Create the provider component
export const TodoProvider = ({ children }) => {
  const [listTodo, setListTodo] = useState([]); 
  const [apiTodos, setApiTodos] = useState([]); // API todos
  const [currPage, setCurrPage] = useState(1);
  const [loading, setLoading] = useState(false); 
  const rowsPerPage = 5; 

  // Fetch API Todos
  useEffect(() => {
    const fetchApiTodos = async () => {
      // Get the API URL from environment variable
      const apiUrl = import.meta.env.VITE_REACT_APP_KEY; 
      if (!apiUrl) {
        console.error("API URL is not defined in the environment variables!");
        return;
      }

      setLoading(true); // Start loading
      try {
        const response = await axios.get(apiUrl);
        const todosWithSource = response.data.todos.map((todo) => ({
          ...todo,
          id: String(todo.id), // Ensuring that the IDs are strings
          source: "api", 
        }));
        setApiTodos(todosWithSource);
      } catch (error) {
        console.error("Error fetching API todos:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchApiTodos();
  }, []);

  // Firestore listener
  useEffect(() => {
    setLoading(true); // Start loading
    const unsubscribe = onSnapshot(
      collection(db, "todo"),
      (snapshot) => {
        setListTodo(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            todo: doc.data().todo,
            source: "firestore", // Mark as Firestore todo
          }))
        );
        setLoading(false); // End loading
      },
      (error) => {
        console.error("Error fetching Firestore todos:", error);
        setLoading(false); // End loading
      }
    );
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
  const totalPages = Math.ceil(combinedTodos.length / rowsPerPage);
  const todosToDisplay = combinedTodos.slice(
    (currPage - 1) * rowsPerPage,
    currPage * rowsPerPage
  );

  return (
    <TodoContext.Provider
      value={{
        addList,
        todosToDisplay,
        updateTodo,
        deleteTodo,
        currPage,
        setCurrPage,
        totalPages,
        loading, 
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
