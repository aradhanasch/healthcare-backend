# Healthcare Backend API

A RESTful healthcare backend built using **Node.js, Express.js, PostgreSQL, Sequelize ORM, and JWT authentication**. The application provides secure user authentication and APIs to manage patients, doctors, and patient-doctor assignments.

## Features

- User registration and login with JWT authentication.
- Password hashing using `bcryptjs`.
- PostgreSQL database integration using Sequelize ORM.
- Patient management with CRUD operations.
- Doctor management with CRUD operations.
- Patient-doctor mapping management.
- Request validation using Joi.
- Centralized error handling with appropriate HTTP status codes.
- Authentication and access control for protected routes.
- Security middleware using Helmet and CORS.
- Environment-based configuration using dotenv.
- Automatic database table creation through Sequelize.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| Supabase | Hosted PostgreSQL database |
| Sequelize | ORM and database relationships |
| JSON Web Token (`jsonwebtoken`) | Authentication |
| bcryptjs | Password hashing |
| Joi | Request validation |
| Helmet | HTTP security headers |
| CORS | Cross-origin request handling |
| Morgan | HTTP request logging |
| dotenv | Environment variable management |
| Nodemon | Development server auto-restart |

## Project Structure

```text
healthcare-backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── error.js
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   └── mappings.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   └── mappings.js
│   └── utils/
│       ├── AppError.js
│       └── asyncHandler.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Before running the project, install or obtain:

- Node.js and npm.
- A PostgreSQL database, such as a Supabase project.
- Postman or another API client for testing.

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd healthcare-backend
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root by copying `.env.example`.

On Windows Command Prompt:

```cmd
copy .env.example .env
```

On PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure the following variables in `.env`:

```env
PORT=5000
DATABASE_URL=YOUR_POSTGRESQL_CONNECTION_STRING
DB_SSL=true
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=1d
```

**Database configuration:**

- Use the actual PostgreSQL connection string from your Supabase project's **Connect** section.
- For this project, the Supabase Session Pooler connection is a suitable option.
- Keep `DB_SSL=true` when your connection requires SSL.
- Never commit `.env` or expose database credentials or JWT secrets publicly.

The application also supports separate database variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`) when `DATABASE_URL` is not provided.

### 4. Start the development server

```bash
npm run dev
```

To start without Nodemon:

```bash
npm start
```

When the database connection succeeds, the server logs confirmation that PostgreSQL is connected and the API is running.

By default, the API runs at:

```text
http://localhost:5000
```

A basic health-check endpoint is available at:

```http
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

The application uses `sequelize.sync()` during startup to create the required tables when they do not exist. For production deployments, use a controlled database migration strategy instead.

## API Documentation

Base URL:

```text
http://localhost:5000
```

### Authentication APIs

These endpoints do not require authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register a user |
| POST | `/api/auth/login/` | Authenticate a user and receive a JWT |

**Register a user**

Request body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@12345"
}
```

**Log in**

Request body:

```json
{
  "email": "test@example.com",
  "password": "Test@12345"
}
```

The login response contains a JWT token.

### Patient Management APIs

All patient endpoints require authentication. Patients are scoped to the user who created them.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/patients/` | Create a patient |
| GET | `/api/patients/` | List your patients |
| GET | `/api/patients/:id/` | Retrieve a patient |
| PUT | `/api/patients/:id/` | Update a patient |
| DELETE | `/api/patients/:id/` | Delete a patient |

Example create request:

```json
{
  "name": "John Doe",
  "age": 34,
  "gender": "male",
  "phone": "9999999999",
  "address": "Pune",
  "medicalHistory": "Asthma"
}
```

Supported gender values are `male`, `female`, and `other`.

### Doctor Management APIs

All doctor endpoints require authentication. Authenticated users can view all doctors, but only the creator can update or delete a doctor.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/doctors/` | Create a doctor |
| GET | `/api/doctors/` | List all doctors |
| GET | `/api/doctors/:id/` | Retrieve a doctor |
| PUT | `/api/doctors/:id/` | Update a doctor |
| DELETE | `/api/doctors/:id/` | Delete a doctor |

Example create request:

```json
{
  "name": "Dr. Rao",
  "email": "rao@clinic.com",
  "specialization": "Cardiology",
  "phone": "9999999999",
  "experienceYears": 12
}
```

### Patient-Doctor Mapping APIs

All mapping endpoints require authentication. Mappings can only be created for patients owned by the authenticated user.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/mappings/` | Assign a doctor to a patient |
| GET | `/api/mappings/` | List mappings for your patients |
| GET | `/api/mappings/:patient_id/` | Retrieve doctors assigned to a patient |
| DELETE | `/api/mappings/:id/` | Remove a mapping |

Example create request:

```json
{
  "patient": 1,
  "doctor": 2
}
```

Replace the IDs with existing database record IDs.

A unique database constraint prevents duplicate assignments of the same doctor to the same patient. Duplicate mappings return HTTP `409 Conflict`.

## Authentication

All patient, doctor, and mapping endpoints require a valid JWT.

In Postman, open **Authorization → Bearer Token** and enter the token returned by the login endpoint.

Alternatively, send this HTTP header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Requests without a valid token are rejected.

## Error Handling and Validation

The application uses Joi for request-body validation and centralized Express error handling.

Common HTTP status codes include:

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid input or malformed JSON |
| 401 | Missing, invalid, or expired authentication token |
| 403 | Operation not permitted |
| 404 | Resource or route not found |
| 409 | Duplicate record or mapping |
| 500 | Unexpected server error |

## Testing

Use Postman to verify the API endpoints.

Recommended test scenarios:

1. Register a new user and log in.
2. Access a protected endpoint without a token and verify that access is denied.
3. Create, retrieve, update, list, and delete patients.
4. Create, retrieve, update, list, and delete doctors.
5. Assign a doctor to a patient and retrieve the mapping.
6. Attempt to create the same mapping twice.
7. Verify patient ownership restrictions.
8. Verify doctor modification permissions.
9. Test invalid IDs and nonexistent records.

## Security Notes

- Passwords are stored as bcrypt hashes rather than plaintext.
- JWT authentication protects the management endpoints.
- Sensitive values are configured through environment variables.
- `.env` and `node_modules` should not be committed to GitHub.
- This project is intended as an assignment and learning project. Review production security, database migrations, logging, and deployment configuration before using it with real patient data.

