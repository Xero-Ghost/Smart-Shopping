# Smart-Shop: Advanced Gamified E-Commerce Platform

Smart-Shop is a full-stack web application designed to simulate a dynamic marketplace with "Stock Market" style pricing mechanics. It features a volatility-based economy where prices fluctuate (strictly increase based on scarcity), an intelligent buying recommendation system, and a competitive leaderboard.

## 🚀 Key Features

### 1. Dynamic "Stock Market" Economy
- **Scarcity Logic**: Product prices increase automatically as stock decreases.
- **Formula**: `New Price = Current Price * (1 + (1 / Current Stock))`
- **Visuals**: Real-time Interactive Line Graphs (White Theme) showing price history for every product.

### 2. Intelligent Recommendation Engine
- **V3 Algorithm**: "Path Optimizer"
- **Function**: Uses Depth-First Search (DFS) to simulate 5 future moves.
- **Output**: Generates the exact 5-step buying sequence that maximizes **User Points** given their current budget.

### 3. Gamified Authentication & Roles
- **Player Portal**: Login via `College ID`.
    - Features: Buying, Graphs, Leaderboard, Recommendations.
    - Currency: **₹ (INR)** and **Points**.
- **Admin Portal**: Login via `Email/Password`.
    - Features: Live Inventory Monitor, Revenue tracking.

### 4. Premium UI/UX
- **Desgin**: Glassmorphism with Global Background.
- **Themes**: Toggle between Light and Dark Mode.
- **Tech**: Responsive Grid Layouts, Recharts for Data Visualization.

---

## 🛠 Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **Logic**: Custom Python algorithms for Pricing and DFS Pathfinding.

### Frontend
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (Variables, Glassmorphism).
- **Libraries**:
    - `recharts`: Trends/Graphs.
    - `lucide-react`: Iconic UI elements.

---

## ⚙️ Installation & Usage

### Prerequisites
- Python 3.8+
- Node.js & npm

### 1. Backend Setup
Navigate to the backend folder and start the server. This will automatically seed the database with initial products (iPhone, S24, Motors, etc.).

```bash
cd backend
pip install -r requirements.txt
python app.py
```
> The server runs on `http://127.0.0.1:5000`

### 2. Frontend Setup
Open a new terminal, navigate to the frontend folder, install dependencies, and run the dev server.

```bash
cd frontend
npm install
npm install recharts lucide-react  # Required for graphs/icons
npm run dev
```
> The UI runs on `http://localhost:5173` (or similar).

---

## 🧪 Testing the Sytem

1. **Login**:
    - **Player**: Enter any College ID (e.g., `B241270`) and Password. (Auto-registers new users).
    - **Admin**: `admin@smartshop.com` / `adminpassword`.

2. **Check Pricing**:
    - Buy an item (e.g., "Servo Motor").
    - Watch the **Price** increase and **Stock** decrease immediately.

3. **View Graphs**:
    - Click the **(i)** button on any product card.
    - A white graph will flip into view showing the price history.

4. **Recommendation System**:
    - Click **"Get 5-Step Strategy"**.
    - The AI will display a flowchart of the next 5 best purchases to maximize your points.

---

## 📂 Complete Project Structure

```
smartshop/
├── README.md               # Project Documentation
├── backend/
│   ├── app.py              # Main Application Entry Point & API Routes
│   ├── logic.py            # Core Business Logic (Pricing & Recommendations)
│   ├── models.py           # SQLAlchemy Database Models
│   ├── requirements.txt    # Python Dependencies List
│   └── instance/           # Generated Directory for SQLite Database
│       └── smartshop.db    # SQLite Database File (Created on run)
│
└── frontend/
    ├── index.html          # HTML Entry Point
    ├── package.json        # Frontend Dependencies & Scripts
    ├── vite.config.js      # Vite Configuration (Proxy setup)
    ├── public/             # Static Assets
    └── src/
        ├── main.jsx        # React DOM Entry Point
        ├── App.jsx         # Main Component & Theme/Routing Logic
        ├── index.css       # Global Styles & Theme Variables
        └── components/
            ├── Login.jsx             # Authentication Component
            ├── PlayerDashboard.jsx   # Main Shopping Interface
            ├── AdminDashboard.jsx    # Admin Management Interface
            └── RecommendationPanel.jsx # AI Recommendation Display
```
