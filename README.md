# Million Dollar Funnel Assessment

A web application for conducting assessments with a React frontend and Express backend. This project includes a questionnaire system that collects user responses and stores them in Google Sheets.

## Project Structure

The project is divided into two main parts:

- **Frontend**: A React application built with TypeScript, Vite, and TailwindCSS
- **Backend**: An Express.js server that handles API requests and integrates with Google Sheets

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Platform account (for Google Sheets integration)

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Make sure you have a valid `credentials.json` file for Google API authentication

4. Start the development server:
   ```
   npm run dev
   ```

The backend server will run on http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. For production build:
   ```
   npm run build
   ```

The frontend development server will run on http://localhost:5173

## Features

- Multi-step assessment questionnaire
- Form validation using React Hook Form and Zod
- Data submission to Google Sheets via backend API
- Responsive design with TailwindCSS

## Technologies Used

### Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Hook Form
- Zod (for validation)
- Axios

### Backend

- Express.js
- Google APIs (Sheets, Drive)
- CORS
- Body-parser

## License

This project is proprietary and confidential.
