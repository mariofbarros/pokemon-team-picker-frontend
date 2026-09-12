import { useState } from "react";

export default function SlotEditor({ initialName, onSave, onCancel }) {
  const [value, setValue] = useState(initialName);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) {
      setError("Pokemon is required.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSave(value);
    } catch (err) {
      // On success this component unmounts, so only reset on failure.
      setError(err.message);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="slot-editor">
      <input
        autoFocus
        value={value}
        disabled={loading}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="name or id"
      />
      <div className="actions">
        <button type="button" onClick={handleSave} disabled={loading}>
          {loading ? "..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
      {error && <p className="error slot-error">{error}</p>}
    </div>
  );
}
