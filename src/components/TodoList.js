import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";

const API_URL = "https://647254996a9370d5a41b438c.mockapi.io/todos/";

function TodoList() {
  const [todos, setTodos] = useState([]);

  const fetchData = async () => {
    try {
      await fetch(API_URL)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setTodos(data.reverse());
        });
    } catch (error) {
      console.error("Помилка отримання даних:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  const addTodo = async (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    setTodos((prev) => [todo, ...prev]);
  };

  const updateTodo = async (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    await fetch(`${API_URL}${todoId}`, {
      method: "PUT", // або 'PATCH', в залежності від вашого випадку
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newValue),
    });

    setTodos((prev) => prev.map((item) => (item.id === todoId ? newValue : item)));
  };

  const removeTodo = async (todoId) => {
    await fetch(`${API_URL}${todoId}`, {
      method: "DELETE",
    });
    const removedArr = [...todos].filter((todo) => todo.id !== todoId);

    setTodos(removedArr);
  };

  return (
    <>
      <h1>TODO list</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo todos={todos} removeTodo={removeTodo} updateTodo={updateTodo} />
    </>
  );
}

export default TodoList;
