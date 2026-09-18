import { useState } from "react";
import { fetchPokemon } from "./api";

const EMPTY_SLOTS = ["", "", "", "", "", ""];

// Form for creating a new team or editing an existing one in full (name +
// all 6 slots). Submitting resolves every slot against PokeAPI before
// calling onSubmit, so the parent always gets fully-formed Pokemon objects.
export default function TeamForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [name, setName] = useState(initial?.name || "");
  const [slots, setSlots] = useState(
    initial?.pokemons?.map((p) => p.name) || EMPTY_SLOTS
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSlotChange = (index, value) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? value : s)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Team name is required.");
      return;
    }
    if (slots.some((s) => !s.trim())) {
      setError("All 6 Pokemon slots are required.");
      return;
    }

    setLoading(true);
    try {
      const pokemons = await Promise.all(slots.map(fetchPokemon));
      await onSubmit({ name: name.trim(), pokemons });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="team-form" onSubmit={handleSubmit}>
      <input
        className="team-name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Team name"
      />
      <div className="slots">
        {slots.map((slot, i) => (
          <input
            key={i}
            value={slot}
            onChange={(e) => handleSlotChange(i, e.target.value)}
            placeholder={`Pokemon ${i + 1} (name or id)`}
          />
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
