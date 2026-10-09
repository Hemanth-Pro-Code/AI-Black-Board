# 🎓 BlackBoard AI

An intelligent, interactive AI-powered blackboard built with **Next.js 16**, **React 19**, **TypeScript**, and **Groq AI**. Designed for students, educators, and creators with handwritten OCR recognition, step-by-step problem solving, chalk drawing tools, and PWA capabilities.

---

## 🚀 Features

- 🖍️ **Interactive Chalkboard Canvas**: Realistic chalk drawing, eraser, color picker, and undo/redo history.
- 🤖 **AI-Powered Solver**: Integrated with Groq (`gpt-oss-120b`) for step-by-step math, coding, and science solutions formatted as classroom notes.
- 🔍 **OCR Handwriting Recognition**: Optical Character Recognition via Tesseract.js to read handwritten notes and queries from the board.
- 📱 **Progressive Web App (PWA)**: Installable on desktop and mobile devices with offline support.
- 📄 **Export & Share**: Save your blackboard as images or export to PDF.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Frontend**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **AI Backend**: [Groq Cloud API](https://console.groq.com/) via OpenAI SDK compatibility layer
- **OCR Engine**: [Tesseract.js](https://tesseract.projectnaptha.com/)
- **Language**: TypeScript

---

## 🔑 Environment Variables

The application requires a Groq API Key to enable the AI solver:

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | Your Groq Cloud API Key (starts with `gsk_...`) | **Yes** |

Get a free API key at [Groq Console](https://console.groq.com/keys).

---

## 🚀 Deployment

### Option 1: Deploy on Vercel (Recommended - Zero Configuration)

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
3. Click **"Add New..."** > **"Project"**.
4. Import the **`AI-Black-Board`** repository.
5. In the **Environment Variables** section:
   - Key: `GROQ_API_KEY`
   - Value: `your_groq_api_key`
6. Click **Deploy**.
7. Vercel automatically builds and deploys your Next.js application in under a minute!

---

### Option 2: Deploy on Render

#### A. Via Render Blueprint (1-Click Setup)
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **"New +"** > **"Blueprint"**.
3. Connect your **`AI-Black-Board`** GitHub repository.
4. Render will automatically detect [`render.yaml`](render.yaml) and configure:
   - **Runtime**: Node.js 20+
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Under Environment Variables, enter your `GROQ_API_KEY`.
6. Click **Apply**.

#### B. Via Render Web Service (Manual Setup)
1. Go to [Render Dashboard](https://dashboard.render.com/) > **"New +"** > **"Web Service"**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `blackboard-ai`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. In **Environment Variables**:
   - `NODE_VERSION` = `20.18.0`
   - `HOSTNAME` = `0.0.0.0`
   - `GROQ_API_KEY` = `your_groq_api_key`
5. Click **Deploy Web Service**.

---

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Hemanth-Pro-Code/AI-Black-Board.git
   cd AI-Black-Board
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   Add your Groq API key:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

---

## 📄 License

MIT License.
