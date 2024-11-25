import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useTodo } from "../context/Contetx";

const TodoList = () => {
  const {
    todosToDisplay = [],
    updateTodo,
    deleteTodo,
    currPage,
    setCurrPage,
    totalPages,
    loading, // Use loading state
  } = useTodo();

  const [editIndex, setEditIndex] = useState(-1);
  const [inputText, setInputText] = useState("");

  const setEdit = (index, currentText) => {
    setEditIndex(index);
    setInputText(currentText);
  };

  const handleSave = (id, source) => {
    if (inputText.trim() === "") {
      alert("Todo cannot be empty!");
      return;
    }
    updateTodo(id, inputText, source);
    setEditIndex(-1);
    setInputText("");
  };

  const handleDelete = (id, source) => {
    deleteTodo(id, source);
    setEditIndex(-1);
    setInputText("");
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrPage(i)}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currPage === i ? "bg-blue-700 text-white" : "bg-gray-200"
          } hover:bg-blue-900 hover:text-white transition duration-200`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="mt-10 max-w-full sm:max-w-md mx-auto px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {todosToDisplay.length > 0 ? (
              todosToDisplay.map((todoItem, index) => (
                <li
                  key={todoItem.id}
                  className="flex justify-between items-center p-4 border rounded-lg shadow-md hover:bg-gray-100"
                >
                  {editIndex === index ? (
                    <div className="flex space-x-2 w-full">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="border-2 border-blue-500 rounded-md px-3 py-2 w-full"
                      />
                      <button
                        onClick={() =>
                          handleSave(todoItem.id, todoItem.source)
                        }
                        className="text-green-500 hover:text-green-700 transition duration-200"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span className="text-lg text-gray-800">
                      {todoItem.todo}
                    </span>
                  )}
                  <div className="flex space-x-2 sm:space-x-4">
                    <button
                      onClick={() => setEdit(index, todoItem.todo)}
                      className="text-xl text-blue-500 hover:text-blue-700 transition duration-200"
                    >
                      <CiEdit />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(todoItem.id, todoItem.source)
                      }
                      className="text-xl text-red-500 hover:text-red-700 transition duration-200"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No Todos available</p>
            )}
          </ul>
          <div className="flex justify-center mt-4 flex-wrap space-x-2">
            {renderPageNumbers()}
          </div>
        </>
      )}
    </div>
  );
};

export default TodoList;
