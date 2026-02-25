***

# Othello Core Engine

**A modular Java/Spring Boot game engine featuring pluggable AI strategies and a secure, cloud-deployed REST API.**

[![Build and Deploy to Railway](https://github.com/OsakpolorI/othello-core/actions/workflows/deploy.yml/badge.svg)](https://github.com/OsakpolorI/othello-core/actions)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://disciplined-abundance-production-271a.up.railway.app/)

---

## 🚀 Project Overview

**Othello Core** is a full-stack implementation of the classic strategy game, architected for scalability and academic integrity. By decoupling the game logic from the interface through a RESTful API, the system supports multiple interaction patterns—from human players to advanced Monte Carlo simulations.

### Key Features
- **Monte Carlo Win-Probability Estimation:** Utilizing a simulation-based evaluator to provide real-time game state analysis and AI move selection.
- **Pluggable AI Strategies:** Implements the **Strategy Pattern**, allowing for seamless hot-swapping between Random, Greedy, and Monte Carlo AI opponents.
- **Stateless REST Architecture:** A Spring Boot backend that manages session state, supporting high-level features like **Undo/Redo** and deep-copy board state persistence.
- **Academic Integrity Guard:** Employs a custom **Secret Injection** pipeline to showcase the project publicly without exposing proprietary university-provided base logic.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Java 21 + Spring Boot 3 | Core REST API & Game Engine |
| **Frontend** | JavaScript (ES6+) | Interactive DOM-based game interface |
| **Inference** | Monte Carlo Simulation | AI decision making & probability tracking |
| **CI/CD** | GitHub Actions | Automated build & secret injection pipeline |
| **Infrastructure** | Railway + Nixpacks | Cloud hosting & Infrastructure-as-Code |
| **Optimization** | JVM Tuning (`-Xmx128M`) | High-efficiency, low-memory footprint deployment |

---

## 🔐 Academic Integrity & Security (DevOps)

This repository is designed to be public-facing for recruitment while strictly adhering to university academic integrity policies.

1. **Git Forensics:** The repository history was scrubbed using `git filter-repo` to remove all traces of proprietary base logic.
2. **Secret Injection:** Proprietary core engine files are `.gitignored`. They are Base64-encoded and stored as **GitHub Secrets**.
3. **Hydration Pipeline:** During the GitHub Actions build process, the pipeline dynamically recreates the necessary `.java` files from secrets, compiles the JAR, and deploys it to **Railway**.
4. **Visibility:** Recruiters can inspect my original API architecture, Controller logic, and CI/CD scripts, while the protected school logic remains invisible to the public.

---

## 📁 Project Structure

```text
othello-core/
├── .github/workflows/
│   └── deploy.yml      # CI/CD pipeline & Secret Injection logic
├── backend/
│   ├── src/main/java/com/othello/backend/
│   │   ├── api/        # REST Controllers, DTOs, and Services
│   │   ├── engine/     # Core game logic (Injected at build-time)
│   │   └── strategy/   # AI implementations (Injected at build-time)
│   ├── resources/
│   │   └── static/     # Vanilla JS Frontend (UI/UX)
│   ├── nixpacks.toml   # Infrastructure-as-Code configuration
│   └── pom.xml         # Maven dependencies (Spring Boot 3, Lombok)
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Java 21**
- **Maven 3.9+**

### Running Locally
*Note: Because this project uses secret injection, the core engine files are missing from the initial clone.*

1. **Clone the Repository**
   ```bash
   git clone https://github.com/OsakpolorI/othello-core.git
   cd othello-core/backend
   ```
2. **Restore Core Files**
   Manually place your `Othello.java`, `OthelloBoard.java`, and Strategy files into their respective directories under `src/main/java/com/othello/backend/`.
3. **Run the Application**
   ```bash
   ./mvnw spring-boot:run
   ```
4. **Access the UI**
   Navigate to `http://localhost:8080` in your browser.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

**Author:** Osakpolor Idusuyi  
**Contact:** [LinkedIn](https://www.linkedin.com/in/osakpolor-idusuyi/) | [GitHub](https://github.com/OsakpolorI)