# Level 2 - Task 2: Online Quiz Maker

A dynamic, Single Page Application (SPA) built for the **CODSOFT Web Development Internship**. This platform allows users to mock-authenticate, create interactive quizzes dynamically, and take existing community quizzes with real-time feedback.

## 🌟 Features

- **User Authentication (Mock):** Register/Login system using `localStorage` to identify quiz creators.
- **Dynamic Quiz Builder:** A robust form that allows users to add or remove multiple-choice questions dynamically, specify the correct answer using radio buttons, and publish the quiz.
- **Quiz Taking Interface:** Users can select available quizzes, take them one question at a time, and get immediate visual feedback (green for correct, red/green for wrong).
- **Persistent Storage:** All user data and created quizzes are securely saved in the browser's `localStorage`, meaning refreshing doesn't lose the data!
- **Premium Aesthetics:** Features deep dark modes, glowing background blobs, and glassmorphism UI components to maintain a strong professional appearance.

## 🛠️ Built With

- **HTML5:** Semantic architecture set up to toggle views seamlessly.
- **CSS3:** Heavy use of modern CSS variables, CSS Grid, radial-gradients for aesthetic touches, and responsive media queries.
- **Vanilla JavaScript:** No frameworks used! Built complete SPA routing logic, state management, and real-time DOM manipulation entirely from scratch.

## 🚀 Quick Start / Run Commands

To run this project from your terminal, follow these steps to ensure paths with spaces are handled correctly:

### 1. Path Selection & Navigation

Open your terminal (PowerShell or Bash) and navigate to this folder. **Note the quotes** required for paths with spaces:

```powershell
cd "Level 2 - Task 2-Online Quiz Maker"
```

### 2. Run the Application

You can choose one of the following commands:

**Option A: Simple Open (Windows)**

```powershell
start index.html
```

**Option B: PHP Local Server**

```bash
php -S localhost:8000
```

**Option C: Node.js (Live Server)**

```bash
npx live-server
```

## 🛠️ Detailed Running Instructions

### Method 1: VS Code Live Server (Most Recommended)

1. Open the folder `Level 2 - Task 2-Online Quiz Maker` in VS Code.
2. Right-click on `index.html`.
3. Select **"Open with Live Server"**.

### Method 2: Manual Direct Open

- Navigate to the project directory in File Explorer.
- Double-click `index.html`.

### Method 3: Command Line (Windows PowerShell)

If you are at the root `CODSOFT` directory, run:

```powershell
cd "Level 2 - Task 2-Online Quiz Maker"; start index.html
```

> [!NOTE]
> This application uses `localStorage`. If you open the file directly without a server, some browser security settings might restrict storage access. Using **Method 1 or 3** with a server is recommended for the best experience.

---

_Created for CodSoft Level 2 - Task 2._
