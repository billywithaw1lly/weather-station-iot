# 🌦️ Weather Station IoT

A real-time IoT weather station dashboard built with React and Node.js. Sensor data (temperature, humidity, etc.) is streamed live from an IoT device to a web dashboard using **WebSockets**, stored in **MongoDB**, and visualised with animated **Recharts** graphs.

---

## 🖥️ How It Works

```
IoT Device (ESP32 / Arduino)
        │
        │  HTTP POST / Serial
        ▼
  Express Backend  ──── MongoDB (stores readings)
        │
        │  Socket.io (real-time broadcast)
        ▼
  React Dashboard  ──── Live charts + animated UI
```

1. The IoT device sends sensor readings to the Express backend
2. The backend saves each reading to MongoDB and broadcasts it via Socket.io
3. The React frontend receives the live data and updates charts in real time

---

## ✨ Features

- 📡 Real-time sensor data via WebSockets (Socket.io)
- 📊 Live charts for temperature, humidity, and other metrics (Recharts)
- 💾 Persistent data storage in MongoDB
- 🎨 Smooth animations with Framer Motion
- 💅 Clean, responsive UI with Tailwind CSS
- 🔒 Environment-based configuration with dotenv

---

## 📁 Project Structure

```
weather-station-iot/
├── backend/
│   ├── index.js / server.js   # Express server + Socket.io + MongoDB
│   ├── package.json
│   └── .env                   # Never commit this
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/        # Dashboard, charts, sensor cards
│   ├── package.json
│   └── index.html
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm
- MongoDB Atlas account (or local MongoDB)
- An IoT device sending weather data (ESP32, ESP8266, Arduino, or a simulator)

---

### 1. Clone the repo

```bash
git clone https://github.com/billywithaw1lly/weather-station-iot.git
cd weather-station-iot
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGODB_URL=your_mongodb_connection_string
PORT=3000
```

Start the backend:

```bash
node index.js
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

### Backend
| Package | Purpose |
|---|---|
| Express | HTTP server & REST API |
| Mongoose | MongoDB ODM |
| Socket.io | Real-time WebSocket communication |
| cors | Cross-origin request handling |
| dotenv | Environment variable management |

### Frontend
| Package | Purpose |
|---|---|
| React + Vite | UI framework & build tool |
| Tailwind CSS | Utility-first styling |
| Recharts | Live data charts & graphs |
| Socket.io-client | Connects to backend WebSocket |
| Framer Motion (`motion`) | UI animations |
| Lucide React | Icons |

---

## 🔌 IoT Device Setup

The backend expects sensor data as a JSON payload via HTTP POST or a WebSocket event. Example payload:

```json
{
  "temperature": 28.4,
  "humidity": 65.2,
  "pressure": 1012.3,
  "timestamp": "2026-04-12T10:30:00Z"
}
```

Compatible with **ESP32**, **ESP8266**, **Arduino + WiFi shield**, or any device that can make HTTP requests.

---

## 🗺️ Planned / TODO

- [ ] Support for multiple sensor nodes
- [ ] Historical data view with date filtering
- [ ] Alerts / threshold notifications
- [ ] Mobile-responsive improvements
- [ ] Deployment (frontend on Vercel, backend on Render)

---

## 👨‍💻 Author

**Priyanshu Pratik** — [billywithaw1lly](https://github.com/billywithaw1lly)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
