import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { Todo, Status } from "../../page/Todo/TodoList";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  todo: Todo | null;
  onClose: () => void;
  fetchTodos: () => void;

  // this is the selected todo setter (not the todos list)
  setTodos: React.Dispatch<React.SetStateAction<Todo | null>>;
};

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

// ✅ safety net: prevents STATUS_META crash if backend sends weird status
function getStatusMeta(status: Status) {
  return (
    STATUS_META[status as Status] ?? {
      label: String(status ?? "UNKNOWN"),
      badge: "text-bg-secondary",
    }
  );
}

export default function TodoDetailsModal({
  show,
  todo,
  onClose,
  fetchTodos,
  setTodos,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("PENDING");
  const [saving, setSaving] = useState(false);

  // reset form on open / todo change
  useEffect(() => {
    if (!show || !todo) return;
    setTitle(todo.title ?? "");
    setContent(todo.content ?? "");
    setStatus(todo.status);
  }, [show, todo]);

  // ESC closes
  useEffect(() => {
    if (!show) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [show, onClose]);

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  const hasChanges = useMemo(() => {
    if (!todo) return false;
    return (
      trimmedTitle !== (todo.title ?? "").trim() ||
      trimmedContent !== (todo.content ?? "").trim() ||
      status !== todo.status
    );
  }, [trimmedTitle, trimmedContent, status, todo]);

  const canSave =
    !!todo &&
    trimmedTitle.length > 0 &&
    trimmedContent.length > 0 &&
    hasChanges &&
    !saving;

  // keep these null-safe (computed before early return is fine)
  const created = safeDate(todo?.created_at);
  const updated = safeDate(
    todo?.updated_at ?? (todo as Todo | null)?.updated_at,
  );

  if (!show || !todo) return null;

  const meta = getStatusMeta(status); // use current selected status for pill

  const cancel = () => {
    setTitle(todo.title ?? "");
    setContent(todo.content ?? "");
    setStatus(todo.status);
  };

  const save = async () => {
    if (!canSave) return;

    try {
      setSaving(true);

      await axios.put(`http://localhost:8080/api/user/todo/${todo.id}`, {
        title: trimmedTitle,
        content: trimmedContent,
        status,
      });

      // update selected todo immediately for UI
      setTodos({
        ...todo,
        title: trimmedTitle,
        content: trimmedContent,
        status,
      });

      // sync list from server
      fetchTodos();

      toast.success("Saved", {
        position: "bottom-right",
        autoClose: 900,
        hideProgressBar: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
      });
    } catch (err) {
      console.error(err);
      toast.error("Save failed. Try again.", {
        position: "bottom-right",
        autoClose: 1400,
        hideProgressBar: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div
        className="modal fade show"
        tabIndex={-1}
        style={{ display: "block" }}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">
            {/* Compact Header */}
            <div className="modal-header py-2">
              <div className="d-flex align-items-center gap-2">
                <span className={`badge rounded-pill ${meta.badge}`}>
                  {meta.label}
                </span>
                <span className="text-muted small">#{todo.id}</span>
              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>

            {/* Compact Body */}
            <div className="modal-body pt-3">
              <div className="row g-2">
                {/* Title */}
                <div className="col-12">
                  <input
                    className={`form-control form-control-sm ${
                      trimmedTitle.length === 0 ? "is-invalid" : ""
                    }`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    maxLength={40}
                    autoFocus
                  />
                  <div className="invalid-feedback">Title is required.</div>
                </div>

                {/* Content */}
                <div className="col-12">
                  <textarea
                    className={`form-control form-control-sm ${
                      trimmedContent.length === 0 ? "is-invalid" : ""
                    }`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Details..."
                    rows={5}
                    style={{ resize: "none" }}
                    maxLength={150}
                  />
                  <div className="invalid-feedback">Details are required.</div>
                </div>

                {/* Status + Dates */}
                <div className="col-12 d-flex align-items-center justify-content-between gap-2 flex-wrap">
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select form-select-sm"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Status)}
                      style={{ width: 150 }}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ON_GOING">On Going</option>
                      <option value="COMPLETED">Completed</option>
                    </select>

                    {hasChanges && (
                      <span className="badge text-bg-warning rounded-pill">
                        Unsaved
                      </span>
                    )}
                  </div>

                  <div
                    className="text-muted small text-end"
                    style={{ lineHeight: 1.15 }}
                  >
                    <div>
                      Created {created ? created.toLocaleDateString() : "—"}
                    </div>
                    <div>
                      Updated {updated ? updated.toLocaleDateString() : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Footer: only show actions when there are changes */}
            <div className="modal-footer py-2">
              {!hasChanges ? (
                <button className="btn btn-light btn-sm" onClick={onClose}>
                  Close
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-light btn-sm"
                    onClick={cancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={save}
                    disabled={!canSave}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
