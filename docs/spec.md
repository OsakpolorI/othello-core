# Othello Game Application – Technical Specification

## Overview
This specification outlines the design and implementation of a simple **Othello (Reversi)** game application.

- **Frontend:** Vanilla HTML, CSS, and JavaScript (no frameworks)
- **Backend:** Java with Spring Boot
- **Architecture:** RESTful API with in-memory game state
- **Gameplay:** Single-player against AI opponents

The goal of this project is educational: to demonstrate full-stack development fundamentals, clean architecture, and common design patterns without overengineering.

---

## Key Principles

- **Simplicity**
    - Focus on core concepts: API design, separation of concerns, and design patterns.
- **Privacy-Friendly**
    - Anonymous user sessions via `localStorage`
    - No cookies, authentication, or server-side user accounts
- **Full-Stack Demonstration**
    - Client–server interaction
    - Asynchronous communication
    - Modular backend design
- **Design Patterns (Backend)**
    - **Strategy Pattern:** Pluggable AI strategies (Random, Greedy, Monte Carlo)
    - **Command Pattern:** Undo/redo support via move commands
    - **Singleton / Factory Pattern:** Central game manager
    - **Open–Closed Principle:** Extend AI strategies without modifying core logic
- **No Overengineering**
    - No multiplayer
    - No persistent database
    - No advanced UI frameworks

---

## Features

### User Session Management
- On first visit, generate an anonymous user ID using `crypto.randomUUID()`
- Store the ID in `localStorage`
- Send the ID with every API request via `X-User-ID` header
- Persist across reloads; removable via browser tools

---

### Start a New Game
- Initialize an 8×8 Othello board with standard starting positions:
    - Black: `(3,3)`, `(4,4)`
    - White: `(3,4)`, `(4,3)`
- Human player: **Black**
- AI player: **White**
- Select AI strategy:
    - `RANDOM` (default)
    - `GREEDY`
    - `MONTE_CARLO`
- Display:
    - Board
    - Current turn
    - Win probability (initially 50%)

---

### Make a Move
- Human clicks a valid square
- Backend validates legality and applies flips
- AI automatically plays when applicable
- UI updates:
    - Board state
    - Current turn
    - Win probability

---

### Undo / Redo
- Undo the most recent move (human or AI)
- Optional redo support
- Stack-based (e.g., up to 10 moves)
- Scoped to the current game session

---

### Win Probability Display
- Progress bar showing estimated human win chance
- Calculated on the backend
- Monte Carlo simulation used when selected

---

### Game Over Detection
- Detect when neither player has valid moves
- Determine winner by piece count
- Display result or draw
- Option to start a new game

---

### AI Strategy Selection
- Selectable before starting a game
- Strategies:
    - **Random:** Chooses a random valid move
    - **Greedy:** Maximizes immediate flips
    - **Monte Carlo:** Simulates N games (e.g., 100–1000) to choose a move

---

### Basic UI Elements
- **Board:** 8×8 grid with black/white pieces
- **Controls:** New Game, Undo, Redo, Pass
- **Status:** Turn indicator, piece counts, win probability bar
- No animations; functionality-first UI

---

## Non-Features (Out of Scope)
- Multiplayer
- User accounts or leaderboards
- Advanced AI
- Mobile-first or responsive design
- Persistent game saves beyond session

---

## Architecture

- **Frontend**
    - Static HTML/CSS/JS
    - Served via Spring Boot or separately
    - Uses Fetch API for async communication
- **Backend**
    - Spring Boot REST application
    - In-memory game storage (`Map<UserId, Game>`)
- **Communication**
    - JSON over HTTP
    - `X-User-ID` header required
- **Deployment**
    - Single JAR
    - Frontend assets in `src/main/resources/static`

---

## Java Design Recommendations

### Core Classes
- **Board**
    - 8×8 grid (`int[][]`)
    - `0 = empty`, `1 = black`, `2 = white`
    - Methods for validation, flipping, and move generation

- **Game**
    - Holds board state, current turn, move history
    - Uses Command pattern for undo/redo

- **MoveCommand**
    - Implements `Command`
    - `execute()` applies move
    - `undo()` reverts move

- **Player**
    - Interface with `getMove(Board)` method

---

### AI & Strategy
- **Strategy Interface**
    - `getBestMove(Board, Player)`
- **Implementations**
    - `RandomStrategy`
    - `GreedyStrategy`
    - `MonteCarloStrategy`

---

### Game Management
- **GameManager**
    - Singleton
    - Maps user IDs to active games
- **MonteCarloStrategy**
    - Simulates random playouts
    - Uses small N (100–1000) for performance

---

### Error Handling
- Centralized with `@ExceptionHandler`
- Consistent JSON error responses

---

## REST API

Base path: `/api/v1/games`  
All endpoints require the `X-User-ID` header.

### Endpoints

| Endpoint | Method | Description |
|--------|--------|------------|
| `/new` | POST | Start a new game |
| `/state` | GET | Get current game state |
| `/move` | POST | Make a move |
| `/undo` | POST | Undo last move |
| `/redo` | POST | Redo last undone move |
| `/pass` | POST | Pass turn |
| `/win-probability` | GET | Get current win probability |

---

### `/new` – Start Game
**Request**
```json
{
  "aiStrategy": "RANDOM | GREEDY | MONTE_CARLO"
}
```
**Response**
```json
{
"gameId": "uuid",
"board": [[0,1,2]],
"currentTurn": "BLACK",
"winProbability": 0.5,
"status": "IN_PROGRESS"
}
```

### Status Codes

- `201 Created`

- `400 Bad Request`

### `/state` – Game State
**Response**

```json
{
"board": [[0,1,2]],
"currentTurn": "BLACK",
"pieceCounts": {
"black": 10,
"white": 8
},
"validMoves": [["row", "col"]]
}
```
### Status Codes

- `200 OK`

- `404 Not Found`

### `/move` – Make Move
**Request**

```json
{
"row": 0,
"col": 0
}
```
### Status Codes

- `200 OK`

- `400 Invalid Move`

- `409 Game Over`

### Other Endpoints
- `/undo, /redo, /pass`

- `Standard state response`

- `Error handling via JSON`

### JSON Schemas
- **Board** 
  - Type: `int[8][8]`
  - Values: 
    - `0` = empty
    - `1` = black (human)
    - `2` = white (AI)

  - Win Probability:
    - Float between `0` and `1`

  - Error Response
```json
{
"error": "message"
}
```
### Frontend Implementation Notes
- HTML
    - Single   `index.html`
    - Elements:
      - `#board`
      - `#status`
      - Buttons: New Game, Undo, Redo, Pass 
      - AI selector

- CSS
  - Grid-based board:

```css
.board {
display: grid;
grid-template-columns: repeat(8, 1fr);
}
```
- Simple circle styling for pieces

- JavaScript
  - Generate and persist user ID 
  - Fetch wrappers with X-User-ID header 
  - Board rendering via DOM updates 
  - Async updates after each move 
  - Win probability rendered as progress bar
