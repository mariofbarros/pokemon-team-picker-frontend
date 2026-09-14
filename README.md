[![Status: Academic Project](https://img.shields.io/badge/Status-Academic_Project-orange)]()
[![Warning: Not for Production](https://img.shields.io/badge/Warning-Not_for_Production-red)]()

# Pokemon Team Picker Interface

A responsive **React** + **Vite** web interface for building and managing Pokémon teams of six. Pokémon data (sprites, types) is fetched live from [PokeAPI](https://pokeapi.co/), and teams are persisted through the [Pokemon Team Picker Backend](https://github.com/mariofbarros/pokemon-team-picker-backend).

## Architecture

![Pokemon Team Picker connections diagram](architecture.svg)

Team CRUD goes to the backend, which is the only thing that touches the database. Pokémon lookups (sprites, types) are fetched directly from PokeAPI in the browser and only reach the backend afterward, bundled into a team update.

## Features

- **Team Management**: Create, edit, and delete Pokémon teams instantly.
- **Slot Editor**: Fill each of the 6 team slots by Pokémon name or National Dex number, resolved live via PokeAPI.
- **Responsive Design**: Clean, card-based layout for desktop and mobile.
- **Error Handling**: Graceful fallbacks if the backend or PokeAPI is unreachable.
- **Fast Dev Loop**: Powered by Vite with Hot Module Replacement (HMR).

## Tech Stack

- **Core**: React 19, Vite 8
- **Language**: JavaScript (ES6+)
- **HTTP Client**: Native `fetch` API
- **External API**: [PokeAPI](https://pokeapi.co/) for Pokémon data
- **Backend Integration**: Connects to `http://localhost:8000` by default (configurable via `VITE_API_URL`)
- **Linting**: Oxlint

## Prerequisites

- **Node.js** (Version 18 or higher recommended)
- **Git**
- **Docker** (optional, for containerized runs — on Windows this means [Docker Desktop](https://www.docker.com/products/docker-desktop/) with the WSL2 backend enabled)
- A code editor (e.g., VS Code)

> **Windows users:** Install Node.js from [nodejs.org](https://nodejs.org/) (the installer adds `node` and `npm` to PATH automatically). All commands below work the same in Command Prompt, PowerShell, or Git Bash.

## Setup Guide

In order to see this application in full potential, please follow the setup instructions in the [Pokemon Team Picker Backend](https://github.com/mariofbarros/pokemon-team-picker-backend) repository first, so the API is running on http://localhost:8000.

Once the backend is up:

1. Navigate to the frontend folder:

```
cd pokemon-team-picker-frontend
```

2. Install dependencies:

```
npm install
```

3. Start the dev server:

```
npm run dev
```

Open the URL printed in the terminal (typically http://localhost:5173) and start building teams.

### Run with Docker

Alternatively, build and serve the production bundle in a container:

```
docker build -t pokemon-team-picker-frontend .
docker run -p 8080:80 pokemon-team-picker-frontend
```

App available at http://localhost:8080.

## ⚠️ Disclaimer

> **Academic Project Notice**
>
> This repository contains a **university project** developed for educational purposes and as a **Proof of Concept (PoC)**. It is **not** intended for production use, commercial deployment, or handling sensitive data.
>
> **Key Limitations:**
> - **Security:** The application lacks robust security measures (e.g., authentication, authorization, input sanitization beyond basics, and secure data encryption) required for real-world environments.
> - **Scalability:** The architecture is designed for a single-user/local environment and does not support high traffic, concurrent users, or distributed systems.
> - **Features:** Several features are incomplete or simplified to focus on core learning objectives.
>
> **Future Roadmap:**
> This project is a work in progress. I intend to continue developing it to address these limitations, implement security best practices, and explore scalability solutions as part of my ongoing learning journey.
>
> **Usage:**
> Feel free to review the code for educational insights, but please do not deploy this in a live environment without significant refactoring and security auditing.
