# Bug Tracker — Backend

A microservices-based bug tracking system built with Java 21 and Spring Boot. Customers report bugs, admins manage and assign them to staff, and everyone gets notified along the way.

---

## Architecture

```
Client (React :3000)
        │
        ▼
  API Gateway :8080
        │
  ┌─────┼──────────────────┐
  ▼     ▼                  ▼
User  Bug-Service    Project-Service
Auth  :8082          :8083
:8081    │
         ├──► Project-Service (verify project exists)
         └──► Notification-Service :8084

All services register with:
  Discovery-Service (Eureka) :8761
All services share:
  MySQL 8 :3306  (4 separate databases)
```

| Service | Port | Database |
|---|---|---|
| API Gateway | 8080 | — |
| User-Auth-Service | 8081 | `user_service` |
| Bug-Service | 8082 | `bug_service` |
| Project-Service | 8083 | `project_service` |
| Notification-Service | 8084 | `notification_service` |
| Discovery-Service (Eureka) | 8761 | — |

---

## Tech Stack

- **Java 21** + **Spring Boot 3.x**
- **Spring Cloud Gateway** — API gateway & routing
- **Netflix Eureka** — service discovery
- **OpenFeign** — inter-service REST calls
- **Spring Data JPA / Hibernate** — ORM
- **MySQL 8** — persistence
- **Spring Security + BCrypt** — password hashing
- **Docker & Docker Compose** — containerization
- **Maven** — build tool

---

## Running the Project

### With Docker (recommended)

```bash
cd " backend"

# Build and start everything
docker-compose up --build

# Watch services register at:
# http://localhost:8761

# Stop
docker-compose down

# Stop and wipe the database
docker-compose down -v
```

Wait until all 5 services appear on the Eureka dashboard before making API calls.

### Without Docker (local dev)

Start services **in this order** — Discovery-Service must be first:

```bash
# 1. Discovery-Service
cd Discovery-Service && mvn spring-boot:run

# 2. Any order after that
cd User-Auth-Service && mvn spring-boot:run
cd Bug-Service       && mvn spring-boot:run
cd Project-Service   && mvn spring-boot:run
cd Notification-Service && mvn spring-boot:run
cd API-GateWay       && mvn spring-boot:run
```

### Run tests

```bash
cd <ServiceDirectory>
mvn test                          # all tests in the service
mvn test -Dtest=ClassName         # single test class
```

---

## Authentication Model

There is **no JWT**. After login, the frontend stores the user's `id` and `role` and passes them as plain HTTP headers on every request:

```
userId: 1
role: ADMIN
```

Roles: `ADMIN` `STAFF` `CUSTOMER`

---

## API Reference

**Base URL:** `http://localhost:8080`

All requests go through the gateway. Headers are passed straight through to each service.

---

### Auth

#### Register
```http
POST /users/accounts/register
Content-Type: application/json
```
```json
{
  "fullName": "Ahmed Soliman",
  "phoneNumber": "01012345678",
  "age": 25,
  "email": "ahmed@example.com",
  "password": "secret123",
  "role": "ADMIN"
}
```
> Role values: `ADMIN` `STAFF` `CUSTOMER`
> Staff only — add `"job"` field: `FRONTEND` `BACKEND` `FULLSTACK` `QA` `DEVOPS` `MOBILE`

Response:
```json
{
  "success": true,
  "message": "User Registered Successfully",
  "data": { "id": 1, "fullName": "Ahmed Soliman", "role": "ADMIN", ... }
}
```

#### Login
```http
POST /users/accounts/login
Content-Type: application/json
```
```json
{
  "email": "ahmed@example.com",
  "password": "secret123"
}
```
> Store the returned `id` and `role` in your frontend session — every subsequent call needs them as headers.

---

### Users

| Method | Endpoint | Required Headers | Access |
|---|---|---|---|
| `GET` | `/users` | `role` | ADMIN only |
| `GET` | `/users/{id}` | `userId`, `role` | ADMIN = any user; STAFF/CUSTOMER = own profile only |
| `PUT` | `/users/{id}` | `userId`, `role` | ADMIN = any user; STAFF/CUSTOMER = own profile only |
| `DELETE` | `/users/{id}` | `role` | ADMIN only |

PUT body — same shape as register.

---

### Projects

#### Create Project
```http
POST /projects/insert
role: ADMIN
Content-Type: application/json
```
```json
{
  "projectName": "My App",
  "description": "A web application project",
  "adminId": 1
}
```

Response:
```json
{
  "success": true,
  "message": "Project Created Successfully",
  "data": { "projectId": 1, "projectName": "My App", ... }
}
```

#### Get All Projects
```http
GET /projects
```

#### Get Project by ID
```http
GET /projects/{projectId}
```

#### Update Project
```http
PUT /projects/{id}
Content-Type: application/json
```
```json
{
  "projectName": "Updated Name",
  "description": "Updated description",
  "adminId": 1
}
```

#### Delete Project
```http
DELETE /projects/{id}
Content-Type: application/json

"ADMIN"
```
> Role is sent as a raw JSON string in the body.

---

### Bugs

#### Create Bug — CUSTOMER
```http
POST /bugs/insert
userId: 3
Content-Type: application/json
```
```json
{
  "title": "Login page crashes on submit",
  "description": "App crashes when clicking the login button",
  "priority": "HIGH",
  "ProjectId": 1
}
```
> Priority values: `LOW` `MEDIUM` `HIGH` `CRITICAL`
> Note the capital `P` in `ProjectId`.

Response:
```json
{
  "success": true,
  "message": "Bug created Successfully",
  "data": { "id": 5, "title": "...", "status": "OPEN", ... }
}
```

#### Assign Bug to Staff — ADMIN
```http
PUT /bugs/assign
userId: 1
Content-Type: application/json
```
```json
{
  "bugId": 5,
  "staffId": 2
}
```

#### Mark Bug as Solved — STAFF
```http
PUT /bugs/solve
userId: 2
Content-Type: application/json
```
```json
{
  "bugId": 5,
  "customerId": 3
}
```

#### Staff Comment (notifies admin)
```http
POST /bugs/comment
userId: 2
Content-Type: application/json
```
```json
{
  "bugId": 5,
  "adminId": 1,
  "comment": "I'm looking into it, seems related to session handling"
}
```

#### Admin Message to Customer
```http
POST /bugs/admin-message
userId: 1
Content-Type: application/json
```
```json
{
  "bugId": 5,
  "customerId": 3,
  "message": "We've assigned a staff member to your issue"
}
```

#### Get All Bugs
```http
GET /bugs
```

#### Get Bug by ID
```http
GET /bugs/{bugId}
userId: 1
role: ADMIN
```
> Access rules: ADMIN = any bug; STAFF = only bugs assigned to them; CUSTOMER = only their own bugs.

#### Update Bug
```http
PUT /bugs/{id}
userId: 1
role: ADMIN
Content-Type: application/json
```
```json
{
  "title": "Updated title",
  "description": "More detail added",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS"
}
```
> Status values: `OPEN` `ASSIGNED` `IN_PROGRESS` `FIXED` `SOLVED` `CLOSED`

#### Delete Bug
```http
DELETE /bugs/{id}
userId: 1
role: ADMIN
```

---

### Notifications

Notifications are created automatically by Bug-Service. The frontend only needs to read and mark them.

#### Get My Notifications
```http
GET /notifications/my-notifications
userId: 3
```

Response:
```json
[
  {
    "id": 12,
    "senderId": 1,
    "receiverId": 3,
    "message": "We've assigned a staff member",
    "bugId": 5,
    "status": "UNREAD",
    "createdAt": "2026-05-09T14:30:00"
  }
]
```

#### Mark Notification as Read
```http
PUT /notifications/read/{notificationId}
```

---

## Typical User Flow

```
1. Register users (choose role during registration — no role change after)
2. Login → save { id, role } in frontend localStorage
3. ADMIN  → Create a project
4. CUSTOMER → Report a bug on that project
             └─ Admin gets notified automatically
5. ADMIN  → Assign bug to a staff member
             └─ Staff gets notified automatically
6. STAFF  → Solve the bug
             └─ Customer gets notified automatically
7. Anyone → Poll GET /notifications/my-notifications for inbox
8. Anyone → PUT /notifications/read/{id} to dismiss
```

---

## Bug Lifecycle

```
OPEN → ASSIGNED → IN_PROGRESS → FIXED → CLOSED
                              ↘ SOLVED
```

---

## Known Issues

| Issue | Detail |
|---|---|
| Login password check | `encoder.encode()` is used instead of `encoder.matches()` — login will always fail. Fix: `encoder.matches(rawPassword, storedHash)` |
| Login returns no body | Controller return type is `void` — frontend gets no user data on login |
| Conflicting GET routes | `/projects/{projectName}` and `/projects/{projectId}` share the same path pattern — use `GET /projects` and filter client-side |
| No token/session system | No JWT or session — userId and role must be sent as headers on every request |
