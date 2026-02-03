import { useEffect, useMemo, useState } from "react";
import CreateTodo from "../../components/TodoComponent/CreateTodo";
import NavigationBar from "../../components/NavigationBar";
import DisplayTodos from "../../components/TodoComponent/DisplayTodos";
import axios from "axios";
import TodoDetailsModal from "../../components/TodoComponent/TodoDetailsModal";

export type Status = "PENDING" | "ON_GOING" | "COMPLETED";

export interface Todo {
  id: number;
  title: string;
  content: string;
  status: Status;
  created_at: string;
  updated_at: string | null;
}

export default function TodoNotes() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("PENDING");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showModal, setShowModal] = useState(false);

  const canAdd = title.trim().length > 0 && content.trim().length > 0;

  const counts = useMemo(() => {
    const c = { PENDING: 0, ON_GOING: 0, COMPLETED: 0 };
    for (const t of todos) c[t.status]++;
    return c;
  }, [todos]);
  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/todo");
      const data = response.data;
      setTodos(Array.isArray(data) ? data : (data.content ?? []));
    } catch (err) {
      console.error(err);
    }
  };
  const openTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTodo(null);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
  }, []);
  console.log(todos);
  return (
    <>
      <div className="container">
        <NavigationBar />
      </div>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <div className="fw-semibold">My Tasks</div>
                <div className="text-muted small">
                  Notes-style cards with status.
                </div>
              </div>

              <div className="d-flex gap-2 flex-wrap justify-content-end">
                <span className="badge rounded-pill text-bg-light border text-muted">
                  Pending {counts.PENDING}
                </span>
                <span className="badge rounded-pill text-bg-light border text-muted">
                  On Going {counts.ON_GOING}
                </span>
                <span className="badge rounded-pill text-bg-light border text-muted">
                  Completed {counts.COMPLETED}
                </span>
              </div>
            </div>

            {/* Add (compact, required details) */}
            <CreateTodo
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              status={status}
              setStatus={setStatus}
              canAdd={canAdd}
              setTodos={setTodos}
              fetchTodos={fetchTodos}
            />
            {/* Cards Grid (notes-style) */}

            {todos.length === 0 ? (
              <div className="text-center text-muted small py-5">
                No tasks yet — add a title + details above.
              </div>
            ) : (
              <DisplayTodos
                todos={todos}
                setTodos={setTodos}
                onOpen={openTodo}
              />
            )}
          </div>
        </div>
      </div>

      <TodoDetailsModal
        show={showModal}
        todo={selectedTodo}
        onClose={closeModal}
        setTodos={setSelectedTodo}
        fetchTodos={fetchTodos}
      />
    </>
  );
}
