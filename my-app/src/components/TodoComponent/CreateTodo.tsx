import React, { type SetStateAction } from "react";
import type { Status, Todo } from "../../page/Todo/TodoList";
import axios from "axios";

interface createTodoProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  status: Status;
  setStatus: React.Dispatch<SetStateAction<Status>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  canAdd: boolean;
  fetchTodos: () => void;
}

function CreateTodo({
  title,
  setTitle,
  content,
  setContent,
  status,
  setStatus,
  canAdd,
  setTodos,
  fetchTodos,
}: createTodoProps) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const addTodo = async () => {
    if (!canAdd) return;

    setTodos((prev) => [
      {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        status,
        created_at: new Date().toISOString(),
        updated_at: null,
      },
      ...prev,
    ]);

    try {
      const response = await axios.post(`${apiUrl}api/user/todo`, {
        title,
        content,
        status,
      });

      console.log(response.data);
      fetchTodos();
    } catch (error) {
      console.log(error);
    }

    setTitle("");
    setContent("");
    setStatus("PENDING");
  };
  return (
    <div>
      <div
        className="bg-white border rounded-4 p-3 mb-3"
        style={{ boxShadow: "0 8px 20px rgba(0,0,0,.05)" }}
      >
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <input
              className="form-control form-control-sm"
              placeholder="Title (required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Title"
              maxLength={60}
              style={{ height: 36 }}
            />
          </div>

          <div className="col-12 col-md-5">
            <input
              className="form-control form-control-sm"
              placeholder="Details (required)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              aria-label="Details"
              maxLength={150}
              style={{ height: 36 }}
            />
          </div>

          <div className="col-8 col-md-2">
            <select
              className="form-select form-select-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              aria-label="Status"
              style={{ height: 36 }}
            >
              <option value="PENDING">Pending</option>
              <option value="ON_GOING">On Going</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="col-4 col-md-1 d-grid">
            <button
              className="btn btn-dark btn-sm"
              onClick={addTodo}
              disabled={!canAdd}
              style={{ height: 36 }}
              title={!canAdd ? "Title and Details are required" : "Add task"}
            >
              Add
            </button>
          </div>
        </div>

        {!canAdd && (
          <div className="text-muted small mt-2">
            Title and details are required.
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateTodo;
