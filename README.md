# Cybersecurity Awareness on Websites

A full-stack web project designed to educate users about cybersecurity threats and best practices. It includes interactive quizzes, guides, and security tips to help users stay safe online.

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  

## 📂 Project Structure
root/
├─ backend/ # Node.js server code
├─ frontend/ # HTML, CSS, JS, images, quizzes
├─ .gitignore
├─ README.md


## ⚡ Features
- Interactive quizzes: Phishing, Strong Passwords, Malware  
- Educational guides for safe online practices  
- Dashboard for progress tracking (if backend connected)  
- Multimedia support: images, videos  

## 💻 How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/hunainahseerat/Ceybersecurity-awareness-on-websites.git
cd Ceybersecurity-awareness-on-websites

2. Backend setup
bash
Copy code
cd backend
npm install
Create a .env file:

env
PORT=5000
MONGO_URI=your_mongodb_connection_string
Start backend:


npm run dev   # if using nodemon
# or
node app.js

3. Frontend setup
Open a new terminal:


cd frontend
npm install
npm start   # or open index.html in browser
4. Run both together (optional)
From root folder:


npm install concurrently --save-dev
Add scripts in root package.json:

json
"scripts": {
  "server": "nodemon backend/app.js",
  "client": "npm start --prefix frontend",
  "dev": "concurrently \"npm run server\" \"npm run client\""
}
Run everything:
npm run dev
