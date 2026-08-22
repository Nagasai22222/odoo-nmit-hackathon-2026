# Dayflow HRMS - Human Resource Management System 🚀

**Dayflow** is a modern, responsive, and robust Human Resource Management System built for the Odoo NMIT Hackathon 2026. Designed with a clean "glassmorphism" aesthetic, Dayflow simplifies employee management, attendance tracking, and payroll processing.

## 🌟 Key Features

*   **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for `ADMIN` (HR Officers) and `EMPLOYEE` users.
*   **Secure Authentication:** Powered by JWT and bcrypt for secure login and sessions.
*   **Employee Directory:** A clean grid-view directory of all employees with live presence indicators (Present, Absent, Leave).
*   **Time & Attendance:** Interactive check-in/check-out functionality with monthly summary views.
*   **Leave Management:** Comprehensive 12-month calendar interface for submitting and tracking time-off requests.
*   **Payroll Control (Admin):** Dedicated data tables for HR to manage and update salary structures.
*   **Analytics Dashboard (Admin):** High-level KPI metrics and visual charts summarizing company-wide HR health.

## 🛠️ Technology Stack

*   **Frontend:** [Next.js 14](https://nextjs.org/) (React), Tailwind CSS, Lucide Icons
*   **Backend:** Next.js Server Actions & API Routes
*   **Database:** **MySQL**
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Authentication:** Custom JWT-based stateless authentication

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
*   Node.js (v18+)
*   MySQL Server installed and running locally

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Nagasai22222/odoo-nmit-hackathon-2026.git
cd hrms
npm install
```

### 3. Database Configuration
Create a `.env` file in the root directory and add your MySQL connection string. Note: Ensure you have an empty database named `dayflow` created in your MySQL server.
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/dayflow"
JWT_SECRET="your-super-secret-jwt-key"
```

### 4. Push Schema & Seed Database
Sync the Prisma schema with your MySQL database and populate it with initial data (this will create your test users):
```bash
npx prisma db push
npx ts-node prisma/seed.ts
```

### 5. Run the Application
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 How to Log In & Test

The application has two primary testing accounts pre-configured in the database:

**Admin / HR Manager Access:**
*   **Email:** `newadmin@dayflow.com`
*   **Password:** `admin123`
*   *Access Level:* Full access to Employee Directory, Attendance overrides, Payroll, and Analytics Reports.

**Standard Employee Access:**
*   **Login ID:** `EMP-001`
*   **Password:** `password`
*   *Access Level:* Restricted to viewing their own personal profile, marking daily attendance, and submitting leave requests.

*(Tip: On the `/login` page, you can use the "Admin Login" and "Employee Login" quick-tabs at the top of the form to auto-fill these credentials for faster testing!)*

---

## 👨‍💻 New Registrations
If an employee or HR officer uses the **Sign Up** page, their account is securely hashed and immediately written to the MySQL `User` and `Employee` tables. They can log in immediately after registration.
