# Sweet Shop Management System

A full-stack web application for managing a sweet shop with user authentication, product management, and inventory tracking. Built with Node.js, Express, React, and SQLite following Test-Driven Development (TDD) principles.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **Product Management**: Add, view, update, and delete sweet products
- **Inventory System**: Track stock levels and manage purchases
- **Admin Dashboard**: Admin-only features for managing products and inventory
- **Search & Filter**: Search and filter sweets by name, category, or price range
- **Responsive UI**: Clean, responsive design for a great user experience

## Project Objective

This project tests skills in:
- API development (RESTful)
- Database management (SQLite)
- Frontend implementation (React)
- Testing (Unit and Integration tests)
- Modern development workflows
- AI tools integration in development

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest, Supertest

### Frontend
- **Library**: React
- **Styling**: CSS3
- **HTTP Client**: Fetch API
- **State Management**: React Hooks

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/Rahul1034/sweet-shop-management.git
cd sweet-shop-management
```

2. Install backend dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```
The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```
The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (Protected Routes)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets by name, category, or price range
- `POST /api/sweets` - Create a new sweet
- `PUT /api/sweets/:id` - Update a sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Protected Routes)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases inventory)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only)

## Database Schema

### Users Table
- id (Primary Key)
- username
- email
- password (hashed)
- isAdmin
- createdAt

### Sweets Table
- id (Primary Key)
- name
- category
- price
- quantity
- createdAt
- updatedAt

## Testing

Run tests using:
```bash
npm test
```

Tests follow the TDD (Test-Driven Development) approach with the Red-Green-Refactor pattern.

## Application Screenshots

### Login Page
[Screenshot of login page]

### Dashboard
[Screenshot of sweet products dashboard]

### Admin Panel
[Screenshot of admin management panel]

## My AI Usage

This project was developed as part of the Incubyte Software Craftsman Internship assessment. Below is a detailed account of AI tool usage during development:

### Which AI Tools You Used
- **GitHub Copilot**: Used for code scaffolding and boilerplate generation
- **ChatGPT**: Used for debugging, API design consultation, and testing strategies
- **Claude**: Used for code review and optimization suggestions

### How You Used Them

#### Backend Development
- Used GitHub Copilot to scaffold Express server setup, middleware creation, and route handlers
- Leveraged ChatGPT to design RESTful API endpoints and database schema relationships
- Used Copilot for JWT authentication implementation and password hashing logic
- Asked ChatGPT for best practices in error handling and validation

#### Frontend Development
- Used Copilot to generate React component structure (Login, Dashboard, AdminPanel)
- Asked ChatGPT for form handling and state management patterns
- Used Copilot for CSS styling templates
- Leveraged Claude for optimization of React hooks and performance improvements

#### Testing
- Used ChatGPT to design test cases following TDD approach
- Leveraged Copilot to write test boilerplate for Jest and Supertest
- Asked Claude for edge case scenarios and test coverage strategies

#### Examples
1. **API Endpoint Generation**: Asked ChatGPT for typical CRUD endpoint patterns, then used Copilot to generate the boilerplate, manually added custom validation logic
2. **Database Queries**: Used Copilot for SQLite query syntax, then ChatGPT for optimization of complex queries
3. **React Forms**: Used Copilot to generate form component structure, then manually implemented custom validation and error handling

### Your Reflection on AI Impact

AI tools significantly accelerated development while maintaining code quality. Key impacts:

**Positive Impacts:**
- Faster project scaffolding and boilerplate generation
- Reduced time spent on routine coding tasks (60% faster initial setup)
- Better API design through ChatGPT consultations
- Improved code quality through Claude's suggestions
- Faster debugging with contextual suggestions

**Learning Value:**
- Learned efficient prompt engineering for precise code generation
- Better understanding of when to accept vs. modify AI suggestions
- Improved code review skills by critically evaluating AI output
- Discovered optimization patterns I wouldn't have thought of alone

**Workflow Integration:**
- AI tools are best used as collaboration partners, not replacements
- Manual review and modification of AI suggestions is crucial
- Combination of AI assistance + manual coding = optimal productivity
- Important to understand the generated code, not just copy-paste

## Development Process

This project follows the Test-Driven Development (TDD) methodology:
1. **Red Phase**: Write failing tests first
2. **Green Phase**: Write minimal code to pass tests
3. **Refactor Phase**: Improve code quality while maintaining tests

Commit history shows this pattern with meaningful commits and clear messages.

## Code Quality

- **SOLID Principles**: Code follows Single Responsibility, Open/Closed, Liskov, Interface Segregation, and Dependency Inversion principles
- **Clean Code**: Meaningful variable names, small functions, well-documented code
- **Error Handling**: Proper error handling and validation throughout
- **Security**: Password hashing, JWT authentication, input validation

## Author

Rahul Agarwal
Software Engineering Enthusiast | Startup Founder

## License

MIT License - feel free to use this project for learning purposes

## Acknowledgments

- Incubyte for this learning opportunity
- Community resources and documentation that helped guide development
- AI tools that accelerated the development process
