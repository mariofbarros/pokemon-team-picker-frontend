import { useState } from "react";
import { fetchPokemon } from "./api";

const EMPTY_SLOTS = ["", "", "", "", "", ""];

// Same form for both flows: pass `initial` to edit an existing team, or
// omit it to create a new one. Submitting resolves every slot against
// PokeAPI first, so onSubmit always receives fully-formed Pokemon objects.
export default function TeamForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [name, setName] = useState(initial?.name || "");
  // Slots hold raw text (name or dex number) while editing; only resolved
  // against PokeAPI on submit, so typos don't cost a request per keystroke.
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
      // Resolve all 6 slots in parallel; any unknown name/id rejects the
      // whole submit so we never save a team with a missing Pokemon.
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
