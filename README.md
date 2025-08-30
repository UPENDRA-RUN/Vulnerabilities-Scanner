🛡️ Advanced URL Vulnerability Scanner

A modern security tool to scan and analyze URLs for vulnerabilities. Built with React + Tailwind + shadcn/ui, it detects phishing indicators, malicious extensions, and insecure domains while providing detailed security insights.

✨ Features

✅ Real-time URL Security Analysis
✅ Threat Score (0–100) with Safe, Suspicious, Unsafe classification
✅ Phishing & Malware Detection (keywords, extensions, obfuscation)
✅ QR Code Upload → extract URL from image & scan instantly
✅ Scan History → view, filter, and re-scan past checks
✅ Export Results → save scans as JSON reports
✅ Beautiful UI with Tailwind + shadcn/ui

📂 Project Structure
src/
│── components/ui/       # Reusable UI components
│── hooks/use-toast.ts   # Toast notifications
│── lib/utils.ts         # Utility helpers
│── URLScanner.tsx       # Main scanner logic + UI

⚡ Installation
1️⃣ Clone the repo
git clone https:https://vulnerabilities-scanner.vercel.app/

2️⃣ Install dependencies
npm install

3️⃣ Start development server
npm run dev

4️⃣ Open in browser → http://localhost:5173

🔧 Tech Stack
⚛️ React (Vite) – UI framework
🎨 TailwindCSS – Styling
🧩 shadcn/ui – Modern UI components
🛠 TypeScript – Strong typing
🎭 Lucide Icons – For clear visual feedback

📸 Screenshots

🔍 Main Scanner
(Add screenshot here)

📊 Detailed Results
(Add screenshot here)

📜 Scan History
(Add screenshot here)

📖 Usage

Enter a URL → click Scan
Or Upload QR Code → auto extract & scan
Review Security Checks + Threat Score
Export Results to JSON
Browse your Scan History anytime

🤝 Contributing

💡 Got an idea? Fork this repo, create a branch, and submit a PR!

git checkout -b feature/your-feature
git commit -m "Add new feature"
git push origin feature/your-feature

📜 License
This project is licensed under the MIT License.
