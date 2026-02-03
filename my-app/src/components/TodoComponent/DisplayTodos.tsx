import React from "react";
import { X } from "lucide-react";
import type { Status, Todo } from "../../page/Todo/TodoList";
import axios from "axios";
import { toast } from "react-toastify";

interface DisplayTodosProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onOpen: (todo: Todo) => void;
}

const STATUS_META: Record<Status, { label: string; badge: string }> = {
  PENDING: { label: "PENDING", badge: "bg-light text-muted border" },
  ON_GOING: { label: "ON GOING", badge: "text-bg-primary" },
  COMPLETED: { label: "COMPLETED", badge: "text-bg-success" },
};

function safeDate(value?: string | null) {
  if (!value) return null;
  const fixed = value.replace(/(\.\d{3})\d+/, "$1");
  const d = new Date(fixed);
  return isNaN(d.getTime()) ? null : d;
}

function DisplayTodos({ todos, setTodos, onOpen }: DisplayTodosProps) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const removeTodo = async (id: number) => {
    try {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      const response = await axios.delete(`${apiUrl}api/user/todo/${id}`);
      toast.success("Deleted", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
      });

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = (id: number, s: Status) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: s } : t)),
    );
  };

  function getSortTime(t: Todo) {
    const updated = safeDate(t.updated_at)?.getTime() ?? 0;
    const created = safeDate(t.created_at)?.getTime() ?? 0;
    return Math.max(updated, created); // newest activity wins
  }
  const sortedTodos = [...todos].sort(
    (a, b) => getSortTime(b) - getSortTime(a),
  );

  return (
    <div className="row g-3">
      {sortedTodos.map((t) => {
        const created = safeDate(t.created_at);
        const updated = safeDate(t.updated_at);
        const isUpdated =
          !!updated && (!created || updated.getTime() > created.getTime());

        return (
          <React.Fragment key={t.id}>
            <div className="col-12 col-sm-6 col-lg-4">
              <div
                className="todo-card bg-white border rounded-4 p-3 h-100"
                style={{
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
                  boxShadow: "0 10px 22px rgba(0,0,0,.08)",
                  transition: "transform 150ms ease, box-shadow 150ms ease",
                  cursor: "pointer",
                }}
                onClick={() => onOpen(t)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 30px rgba(0,0,0,.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 22px rgba(0,0,0,.08)";
                }}
              >
                {/* Top row */}
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <span
                    className={`badge rounded-pill ${STATUS_META[t.status].badge}`}
                  >
                    {STATUS_META[t.status].label}
                  </span>

                  {/* Icon-only delete */}
                  <button
                    className="btn btn-sm btn-light border-0 text-muted"
                    onClick={() => removeTodo(t.id)}
                    aria-label="Delete"
                    title="Delete"
                    style={{
                      width: 28,
                      height: 28,
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={14} strokeWidth={2.2} />
                  </button>
                </div>

                {/* Content */}
                <div className="fw-semibold" style={{ lineHeight: 1.2 }}>
                  {t.title}
                </div>

                <div
                  className="text-muted small mt-2"
                  style={{ whiteSpace: "pre-wrap", lineHeight: 1.25 }}
                >
                  {t.content}
                </div>

                {/* Bottom row */}
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <select
                    className="form-select form-select-sm"
                    value={t.status}
                    onChange={(e) =>
                      updateStatus(t.id, e.target.value as Status)
                    }
                    style={{ height: 32, maxWidth: 150 }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ON_GOING">On Going</option>
                    <option value="COMPLETED">Completed</option>
                  </select>

                  {/* Dates */}
                  <div
                    className="text-muted small text-end"
                    style={{ lineHeight: 1.15 }}
                  >
                    <div>
                      Created {created ? created.toLocaleDateString() : "—"}
                    </div>
                    {updated && (
                      <div className={isUpdated ? "fw-semibold" : ""}>
                        Updated {updated.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default DisplayTodos;
