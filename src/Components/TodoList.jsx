import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const TodoList = ({ listTodo, updateTodo, deleteTodo }) => {
  const [editIndex, setEditIndex] = useState(-1);
  const [inputText, setInputText] = useState("");

  const setEdit = (index, currentText) => {
    setEditIndex(index);
    setInputText(currentText); // Set the initial text in the input box
  };

  const handleSave = (id, source) => {
    updateTodo(id, inputText, source);
    setEditIndex(-1); // Reset edit mode
    setInputText(""); // Clear the input field
  };

  return (
    <div className="mt-10 max-w-full sm:max-w-md mx-auto px-4 sm:px-6 lg:px-8">
      <ul className="space-y-4">
        {listTodo.map((todoItem, index) => (
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
                  onClick={() => handleSave(todoItem.id, todoItem.source)}
                  className="text-green-500 hover:text-green-700 transition duration-200"
                >
                  Save
                </button>
              </div>
            ) : (
              <span className="text-lg text-gray-800">{todoItem.todo}</span>
            )}

            <div className="flex space-x-2 sm:space-x-4">
              <button
                onClick={() => setEdit(index, todoItem.todo)}
                className="text-xl text-blue-500 hover:text-blue-700 transition duration-200"
              >
                <CiEdit />
              </button>
              <button
                onClick={() => deleteTodo(todoItem.id, todoItem.source)}
                className="text-xl text-red-500 hover:text-red-700 transition duration-200"
              >
                <MdDelete />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
