// Talks to two APIs: our own backend (team CRUD) and the public PokeAPI
// (Pokemon lookup by name/id, used when building/editing a team).
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const POKEAPI_URL = "https://pokeapi.co/api/v2";

// Thin fetch wrapper for our backend: JSON-decodes and raises on non-2xx.
async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    // FastAPI puts validation/HTTP errors under "detail"; fall back to the
    // status code if the body isn't JSON (e.g. a network/proxy error page).
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ? JSON.stringify(body.detail) : `Request failed (${res.status})`);
  }
  // DELETE returns 204 with no body, so there's nothing to parse.
  return res.status === 204 ? null : res.json();
}

export function getTeams() {
  return request("/teams");
}

export function createTeam(team) {
  return request("/teams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(team),
  });
}

export function updateTeam(id, team) {
  return request(`/teams/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(team),
  });
}

export function deleteTeam(id) {
  return request(`/teams/${id}`, { method: "DELETE" });
}

// Resolves a Pokemon by name or Pokedex number directly against PokeAPI and
// reshapes it into the flat {id, name, sprite, types} our backend stores.
export async function fetchPokemon(nameOrId) {
  const key = nameOrId.toLowerCase().trim();
  const res = await fetch(`${POKEAPI_URL}/pokemon/${key}`);
  if (!res.ok) {
    throw new Error(`Pokemon "${nameOrId}" not found`);
  }
  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites?.front_default || null,
    types: (data.types || []).map((t) => t.type.name),
  };
}
