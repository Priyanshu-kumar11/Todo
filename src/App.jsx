import { useEffect, useState } from "react";
import TodoInput from "./Components/TodoInput";
import TodoList from "./Components/TodoList";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";

function App() {
  const [listTodo, setListTodo] = useState([]); // Firestore todos
  const [apiTodos, setApiTodos] = useState([]); // API todos
  const [currPage, setCurrPage] = useState(1);
  const [rowsPerPage] = useState(5); // Rows per page set to 5

  // Fetch API Todos
  useEffect(() => {
    axios
      .get("https://dummyjson.com/todos")
      .then((response) => {
        // Add a "source" property to differentiate API todos
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

    // Add to Firestore
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
      return; // Prevent updates on API todos
    }

    if (newText.trim() === "") {
      alert("Todo cannot be empty!");
      return;
    }

    // Update Firestore todo
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
      return; // Prevent deletion of API todos
    }

    deleteDoc(doc(db, "todo", id))
      .then(() => {
        console.log("Todo deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  // Pagination logic
  const indexOfLastItem = currPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;

  // Combine Firestore todos and API todos
  const combinedTodos = [...listTodo, ...apiTodos];

  // Slice todos based on the current page
  const currItems = combinedTodos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(combinedTodos.length / rowsPerPage);

  const goToNextPage = () => {
    if (currPage < totalPages) setCurrPage(currPage + 1);
  };

  const goToPreviousPage = () => {
    if (currPage > 1) setCurrPage(currPage - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <div className="w-full max-w-2xl px-4 sm:px-6 md:px-8 bg-white rounded-lg shadow-lg pb-6">
        <TodoInput addList={addList} />
        <TodoList
          listTodo={currItems}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
        />

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
