# 🚀 Chrome UX Report App 
A full-stack web application that fetches and displays real-world performance metrics from the Chrome UX (CrUX) API based on user-entered URLs.
Built with React, Material-UI, Node.js, and Express.

## 📦 Tech Stack
Frontend: React, Vite, Material UI
Backend: Node.js, Axios
API: Chrome UX Report API

## 📦 Key NPM Dependencies
Backend
Node, axios, dotenv
Frontend: react, @mui/material, @mui/icons-material, axios, vite

## ⚙️ Setup Instructions (Run Locally)
**1. Clone the Repository**
git clone https://github.com/Vaibhav-giriman-gour/crux-report-app
cd cruxAPI-report

**2. Setup and Run Backend**
cd backend
npm install

Create a .env file inside backend/:
PORT=5000
API_CRED_KEY= your_google_crux_api_key

npm start

**3. Setup and Run Frontend**
cd ..
npm install
npm run dev

## 🛠️ Functionalities Implemented — Step-by-Step
**Step	Functionality**
### 1	URL Input: 
User can input one or multiple website URLs.


### 2	Search Button:
Clicking Search triggers a POST request to the backend.


### 3	Backend Processing:
Backend server reads the API key from .env, queries the Chrome UX API, and sends results back.


### 4	Display Results:
Frontend receives metrics and displays them in a Material-UI Data Table.


### 5	Sorting: 
Each column in the table can be sorted (ascending/descending).


### 6	Filtering: 
Users can apply filters, e.g., show URLs with LCP > 2.5s or CLS > 0.1.


### 7	Multi-URL Summary: 
When giving multiple URLs, each URL should be in per line


### 8	Loading State:
A smooth loader animation while fetching the data.


### 9	Error Handling:
Displays proper messages if URL is invalid or API call fails.

## 🎥 Demo Preview

![Demo](demo/crux-report-app.gif)
## 📹 Demo Walkthrough

### -->        **Landing Page:** 
Simple input form asking for one or multiple URLs.


###-->        **User Input:** Example:
           https://developer.intuit.com, https://quickbooks.intuit.com


###-->        **Click Search:**
Backend fetches real-user metrics for the URLs.


### -->        **Results Table:**

###-->        **Columns like:** 
URL, FCP, LCP, CLS, INP Values are neatly populated. 
Sorting icons available at each column header.


### -->        **Filtering Options:**
Filter by thresholds (e.g., show URLs where INP < 200ms).


### -->        **Summary Row:**
Average LCP, Average CLS, etc., are shown at the bottom.


### -->        **Loading Animation:** 
Shows a loader while data is fetched.


### -->        **Error Messages:**
If something goes wrong, clear error displayed.

## 🔗 Project Link
[👉 GitHub Repository](https://github.com/Vaibhav-giriman-gour/crux-report-app)


