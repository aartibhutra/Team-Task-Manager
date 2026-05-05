# Team Task Manager

Welcome to the **Team Task Manager**, a full-stack MERN (MongoDB, Express, React, Node.js) web application designed to help teams efficiently organize projects and track tasks in real-time.

## Features

### Role-Based Access Control
The application supports two distinct user roles, ensuring secure and organized team management:
- **Admin:** Admins have full control over the workspace. They can create new projects, build teams, and assign tasks to specific team members.
- **Member:** Members have a focused view of their responsibilities. They can only see the projects they are involved in and can update the status of the specific tasks assigned to them.

### Interactive Kanban Boards
Every project features a dynamic Kanban board. Tasks are visually organized into four columns:
- **Todo:** New tasks waiting to be started.
- **In Progress:** Tasks currently being worked on.
- **Review:** Tasks completed by members but awaiting final approval.
- **Done:** Fully completed tasks.

### Dashboard & Task Tracking
- Users get a personalized dashboard summarizing their active and completed tasks.
- Members receive a streamlined view of their deadlines and priorities.
- Admins can monitor overall project progress at a glance.

### Real-Time Notifications
Integrated with `react-toastify`, the application provides beautiful, real-time popup notifications for successful logins, account creations, and error handling (like invalid passwords).

### Secure Authentication
User data is secured using JSON Web Tokens (JWT) and encrypted passwords. Protected routes ensure that only authenticated users can access the application's internal pages.

## Technology Stack

- **Frontend:** React.js, React Router, Vite, Vanilla CSS (Custom Design System).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Atlas).
- **Authentication:** JWT (JSON Web Tokens), bcryptjs.

## How to Run Locally

1. **Clone the repository.**
2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```
3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```
4. **Set up Environment Variables:**
   Create a `.env` file in the `backend` folder and add your MongoDB URI and JWT Secret:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
5. **Run the Application:**
   Open two terminals.
   In the first terminal, run the backend:
   ```bash
   cd backend
   node server.js
   ```
   In the second terminal, run the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

Enjoy managing your tasks efficiently!
