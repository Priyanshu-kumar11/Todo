import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";

const TodoInput = ({ addList }) => {
  const [inputText, setInputText] = useState("");

  const handleAddClick = () => {
    if (inputText.trim() !== "") {  
      addList(inputText);
      setInputText("");  
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Enter your todo"
          className="border-2 border-blue-500 hover:border-blue-700 focus:border-blue-700 focus:ring-2 focus:ring-blue-300 rounded-full px-4 py-2 w-full sm:w-80 outline-none"
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
        />

        <div className="flex space-x-4 sm:space-x-2 w-full sm:w-auto mt-4 sm:mt-0">
          <button
            onClick={handleAddClick}  
            className="flex items-center justify-center w-12 h-12 rounded-full text-blue-500 text-2xl hover:bg-blue-700 shadow-md"
          >
            <CiCirclePlus />
          </button>

          <button className="flex items-center justify-center w-12 h-12 rounded-full text-blue-500 text-2xl hover:bg-blue-700 shadow-md">
            <IoIosSearch />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoInput;
