# SimpleShop

SimpleShop is a full-stack web application designed for managing products, user accounts, and reviews. It includes a React-based frontend and an Express.js backend.

## Features

### Frontend:

- Single Page Application (SPA) built with **React**.
- User authentication for registration and login.
- Product browsing, filtering, and detailed views.
- REST API integrations to manage products and reviews.
- Development powered by **Vite** for fast builds and server setup.

### Backend:

- Built with **Express.js** and **Sequelize ORM**.
- APIs for managing:
  - **Users** (authentication, profile updates, and removal)
  - **Products** (CRUD operations)
  - **Reviews** (CRUD operations)
- Role-based access control for administrative features.
- Integration with **MariaDB** or compatible database systems.

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Gerluk/SimpleShop.git
   cd SimpleShop
   ```

2. Setup the backend:

   - Navigate to the `Backend` folder.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create and configure the `.env` file for MariaDB database and application settings.
   - Start the backend server:
     ```bash
     npm start
     ```

3. Setup the frontend:

   - Navigate to the `Frontend` folder.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

4. Access the application:
   - Open the frontend URL (default: http://localhost:5173) in your browser.

## Development

- Requires **Node.js** and **npm**.
- You can modify the code in their respective `Frontend` and `Backend` folders.
