# Recycling Marketplace Project Documentation

## Project Abstract
The **Recycling Marketplace** is a holistic platform designed to transform domestic waste management into a rewarding circular economy. It addresses the lack of formal infrastructure for recycling by connecting three key stakeholders: **Recyclers (Users)**, **Delivery Partners**, and **Eco-conscious Sellers**. 
- **Problem**: Inefficient domestic waste collection and lack of incentives for households to sort recyclables.
- **Solution**: A digital marketplace where users earn "Reward Points" for recycling materials (Plastic, Paper, Metal), which can then be used as currency to purchase eco-friendly products from local sellers.
- **Impact**: Promotes environmental sustainability, formalizes the informal waste-picking sector, and supports green businesses.

---

## Technical Details

### Project Structure
The project follows a standard decoupled **Full Stack** architecture:

```text
java-project/
├── application/                # Spring Boot Backend
│   ├── src/main/java/          # Source code (Controllers, Services, Models, Repositories)
|   |   ├── Config/
|   |   ├── Controller/         # REST API Endpoints
|   |   ├── Filter/
|   |   ├── Service/            # Business Logic
|   |   ├── Model/              # JPA Entities
|   |   ├── Repository/         # Data Access Layer
|   |   ├── Security/           # JWT Authentication & Authorization
|   |   └── Scheduler/          # Scheduled Tasks (e.g., Delivery Assignment)
|   |   └── Utils/              # Utility Classes
│   ├── src/main/resources/     # Configuration (application.properties)
│   └── pom.xml                 # Maven Dependencies
└── frontend/                   # React.js Frontend
    ├── src/
    │   ├── components/         # UI Components (Dashboards, Auth, Orders)
    │   ├── context/            # State Management (AuthContext)
    │   ├── services/           # API Integration (Axios)
    │   └── App.js              # Routing and Main Entry
    ├── public/                 # Static Assets
    └── package.json            # Node.js Dependencies
```

### Tools and Technologies
- **Backend (Spring Boot)**:
  - **Java 17**: Core language.
  - **Spring Security**: JWT-based authentication using **HTTP-Only Cookies** for CSRF/XSS protection.
  - **Spring Data JPA & Hibernate**: ORM for MySQL database interaction.
  - **Spring Scheduling**: Periodic background tasks for automated delivery assignment.
  - **MySQL**: Persistent relational data storage.
- **Frontend (React.js)**:
  - **Functional Components & Hooks**: Modern React patterns (useState, useEffect, useContext).
  - **React Router**: Client-side routing with Role-Based Access Control (RBAC).
  - **Axios**: HTTP client with request/response interceptors for token management.
  - **Vanilla CSS**: Custom design system using CSS variables and modern layout techniques.

---

## How to Use

### 1. By Users (Recyclers)
- **Earn Rewards**: Navigate to the Dashboard, enter your address, and schedule a material pickup (e.g., 5kg of Plastic).
- **Track Status**: Monitor pickup requests in "Pickup History." Once complete, rewards are automatically credited.
- **Marketplace**: Browse eco-friendly products and "Buy" using accumulated points.
- **Security**: Provide the 6-digit OTP to the Delivery Boy to confirm pickup/order arrival.

### 2. By Delivery Partners
- **Manage Tasks**: access the "Delivery Tasks" dashboard to see assigned material pickups and product orders.
- **Claim Tasks**: Manually click "Claim" on pending local tasks or wait for the **Auto-Scheduler** to assign them.
- **Verification**: Visit the customer, collect/deliver the item, and enter the **OTP** provided by the customer into the dashboard to mark the task as COMPLETED.

### 3. By Sellers
- **Product Management**: Upload new eco-friendly products with descriptions, pricing in points, and stock levels.
- **Sales Tracking**: Access the "Seller Dashboard" to see who purchased your products and monitor delivery status.

---

## Key Concepts Explained

### Spring Boot Concepts
1. **Dependency Injection (DI)**: Using `@Autowired` or Constructor Injection to manage object lifecycles and increase testability.
2. **Repository Pattern**: Leveraging `JpaRepository` to abstract database queries and reduce boilerplate code.
3. **Layered Architecture**: Strict separation between **Controller** (API endpoints), **Service** (Business logic), and **Model** (Database entities).
4. **Spring Security Filter Chain**: Intercepting requests to validate JWT cookies and enforce role-based permissions before reaching the controllers.
5. **Scheduled Tasks**: Using `@Scheduled` for background polling (e.g., auto-assigning deliveries every few seconds).

### React.js Concepts
1. **Context API**: Managing global application state (like the current logged-in user) without "prop drilling."
2. **Interceptors**: Centrally handling API errors (like 401 Unauthorized) to redirect users to login or refresh tokens automatically.
3. **Higher-Order Components (HOC) / Route Guards**: Using `ProtectedRoute` or `RoleRoute` components to prevent unauthorized access to specific pages.
4. **Effect Hook (useEffect)**: Synchronizing the component state with external APIs (e.g., fetching dashboard data on mount).
5. **Role-Based Conditional Rendering**: Dynamically showing/hiding Navbar links (e.g., "Seller Dashboard") based on the user's role stored in the Auth state.
