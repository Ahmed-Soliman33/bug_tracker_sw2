# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

**Full stack (Docker):** The `docker-compose.yml` lives inside ` backend/` (note the leading space in the directory name).
```bash
cd " backend"
docker-compose up --build         # Build and start all services
docker-compose up -d              # Start in background
docker-compose down               # Stop all services
```

**Individual service (Maven):**
```bash
cd " backend/<ServiceDirectory>"
mvn clean package                 # Build JAR
mvn spring-boot:run               # Run locally
mvn test                          # Run all tests for a service
mvn test -Dtest=ClassName         # Run a single test class
```

**Build order when running locally (not Docker):** Discovery-Service must start first, then all other services.

## Architecture

Java 21 / Spring Boot microservices. All client traffic enters through the API Gateway; services register with Eureka for load-balanced routing.

```
Client → API-GateWay (8080)
               ↓ routes via Eureka lb://
  ┌────────────┬──────────────┬──────────────┬──────────────┐
  │User-Auth   │ Bug-Service  │Project-Service│Notification  │
  │(8081)      │ (8082)       │ (8083)        │Service (8084)│
  └────────────┴──┬───────────┴───────────────┴──────────────┘
                  │ Feign (ProjectClient via Eureka lb://)
                  │ Feign (NotificationClient via hardcoded URL)
           Project-Service  Notification-Service
```

**Discovery-Service (8761):** Eureka server. All other services register here.

**API-GateWay (8080):** Spring Cloud Gateway routing `/users/**` → `lb://USER-SERVICE`, `/bugs/**` → `lb://BUG-SERVICE`, `/projects/**` → `lb://PROJECT-SERVICE`, `/notifications/**` → `lb://NOTIFICATION-SERVICE`. CORS open for `http://localhost:3000`.

**Inter-service communication:** Bug-Service has two Feign clients:
- `ProjectClient` — uses `@FeignClient(name = "PROJECT-SERVICE")` (Eureka load-balanced).
- `NotificationClient` — uses a hardcoded URL `http://NOTIFICATION-SERVICE:8084` (not Eureka). If the Notification-Service hostname or port changes, update this client directly.

**Database:** Single MySQL 8 instance (port 3306) with 4 separate schemas: `user_service`, `bug_service`, `project_service`, `notification_service`. Created by ` backend/docker/mysql/init.sql`. All services use `spring.jpa.hibernate.ddl-auto=update`.

**Auth model:** No JWT. After login, the caller is expected to pass `userId` (Long) and `role` (enum string) as plain HTTP request headers. Controllers read these with `@RequestHeader`. Spring Security in User-Auth-Service is configured to permit all requests (CSRF disabled) — it only provides BCrypt password hashing.

## Service Package Structure

Services follow this layout under `src/main/java/com/example/<Name>/`:

```
Controller/      HTTP handlers
Service/         Business logic (interface + Impl)
Repository/      Spring Data JPA repos
Entity/          JPA entities (enums co-located)
DTO/             Request/response DTOs
Exception/       Custom exceptions + GlobalExceptionHandler
Config/          Spring @Configuration classes
Client/          Feign clients (Bug-Service only)
```

**Exception to the pattern — User-Auth-Service** uses non-standard package names: `userController/`, `userEntity/`, `userRepository/`, `userService/`, `aspect/`. It also has three AOP aspects (`LoggingAspect`, `PerformanceAspect`, `ExceptionAspect`) that intercept all `userService` method calls for logging and timing.

## Key Domain Concepts

**User roles:** `ADMIN`, `STAFF`, `CUSTOMER`. Stored via JPA single-table inheritance (`User` base → `Admin`, `Staff`, `Customer` subclasses, discriminated by `user_type` column). `Staff` has an additional `JobType` enum field.

**Bug lifecycle:** `BugStatus` values: `OPEN → ASSIGNED → SOLVED` (primary flow); also `IN_PROGRESS`, `FIXED`, `CLOSED` exist in the enum but are not currently used by service logic. `BugPriority`: `HIGH`, `MEDIUM`, `LOW`. On each state transition, Bug-Service sends a notification via `NotificationClient`.

**Notification flow triggered by Bug-Service:**
- Bug created → notifies project's admin
- Bug assigned → notifies the assigned staff
- Bug solved → notifies the customer
- Staff comment → notifies admin
- Admin message → notifies customer

**Project ownership:** Each `Project` has an `adminId` (references a User id). Bug-Service looks up a project by name via `ProjectClient.getProjectByName()` before creating a bug, then fetches the admin via `ProjectClient.getProjectAdmin()` to send the creation notification.

**Notification entity:** Records `senderId`, `receiverId`, `bugId`, `message`, `createdAt`, and a `Status` enum (`READ`/`UNREAD`).

## Configuration Notes

- The backend directory is named ` backend` (with a leading space) — always quote the path.
- Docker service hostnames match Spring application names: `mysql`, `discovery-service`, `api-gateway`, `user-service`, `bug-service`, `project-service`, `notification-service`.
- All services connect to Eureka at `http://discovery-service:8761/eureka/` with `prefer-ip-address: true`.
- Default DB credentials: `root` / `1234` (dev only).
- Spring Boot versions vary across services (3.2.5 – 4.0.5); keep this in mind when adding dependencies.
- The `frontend/` directory is currently empty (placeholder).
