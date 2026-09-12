import { useEffect, useState } from "react";
import { getTeams, createTeam, updateTeam, deleteTeam, fetchPokemon } from "./api";
import TeamForm from "./TeamForm";
import SlotEditor from "./SlotEditor";
import "./App.css";

function App() {
  const [teams, setTeams] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null); // { teamId, index }
  const [error, setError] = useState(null);

  const loadTeams = async () => {
    try {
      setTeams(await getTeams());
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreate = async (team) => {
    await createTeam(team);
    setShowCreate(false);
    await loadTeams();
  };

  const handleUpdate = async (team) => {
    await updateTeam(editingId, team);
    setEditingId(null);
    await loadTeams();
  };

  const handleSlotSave = async (teamId, index, nameOrId) => {
    const team = teams.find((t) => t.id === teamId);
    const pokemon = await fetchPokemon(nameOrId);
    const pokemons = team.pokemons.map((p, i) => (i === index ? pokemon : p));
    await updateTeam(teamId, { name: team.name, pokemons });
    setEditingSlot(null);
    await loadTeams();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team?")) return;
    await deleteTeam(id);
    await loadTeams();
  };

  const editingTeam = teams.find((t) => t.id === editingId);

  return (
    <div className="app">
      <h1>Pokemon Team Picker</h1>
      {error && <p className="error">{error}</p>}

      {editingId ? (
        <TeamForm
          initial={editingTeam}
          onSubmit={handleUpdate}
          onCancel={() => setEditingId(null)}
          submitLabel="Update Team"
        />
      ) : showCreate ? (
        <TeamForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          submitLabel="Create Team"
        />
      ) : (
        <button onClick={() => setShowCreate(true)}>+ New Team</button>
      )}

      <ul className="teams">
        {teams.map((team) => (
          <li key={team.id} className="team-card">
            <h3>{team.name}</h3>
            <div className="pokemon-row">
              {team.pokemons.map((p, i) =>
                editingSlot?.teamId === team.id && editingSlot.index === i ? (
                  // Slots are positional, so index is the stable key here.
                  <SlotEditor
                    key={i}
                    initialName={p.name}
                    onSave={(value) => handleSlotSave(team.id, i, value)}
                    onCancel={() => setEditingSlot(null)}
                  />
                ) : (
                  <button
                    key={i}
                    type="button"
                    className="pokemon"
                    title={`Edit slot ${i + 1}`}
                    onClick={() => {
                      setEditingId(null);
                      setEditingSlot({ teamId: team.id, index: i });
                    }}
                  >
                    {p.sprite && <img src={p.sprite} alt={p.name} />}
                    <span>{p.name}</span>
                    {p.types?.length > 0 && (
                      <span className="types">
                        {p.types.map((t) => (
                          <span key={t} className={`type type-${t}`}>
                            {t}
                          </span>
                        ))}
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
            <div className="actions">
              <button
                onClick={() => {
                  setEditingSlot(null);
                  setEditingId(team.id);
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(team.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
