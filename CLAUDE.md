# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

**Full stack (Docker):**
```bash
docker-compose up --build         # Build and start all services
docker-compose up -d              # Start in background
docker-compose down               # Stop all services
```

**Individual service (Maven):**
```bash
cd <ServiceDirectory>
mvn clean package                 # Build JAR
mvn spring-boot:run               # Run locally
mvn test                          # Run tests for a service
mvn test -Dtest=ClassName         # Run a single test class
```

**Build order when running locally (not Docker):** Discovery-Service must start first, then all other services.

## Architecture

This is a Java 21 / Spring Boot microservices system. All client traffic enters through the API Gateway; services register with Eureka for load-balanced routing.

```
Client → API-GateWay (8080)
               ↓ routes via Eureka
  ┌────────────┬──────────────┬──────────────┬──────────────┐
  │User-Auth   │ Bug-Service  │Project-Service│Notification  │
  │(8081)      │ (8082)       │ (8083)        │Service (8084)│
  └────────────┴──┬───────┬──┴───────────────┴──────────────┘
                  │Feign  │Feign
           Project-Service  Notification-Service
```

**Discovery-Service (8761):** Eureka server. All other services register here. Must start first.

**API-GateWay (8080):** Spring Cloud Gateway. Routes `/users/**`, `/bugs/**`, `/projects/**`, `/notifications/**` to respective services using `lb://` (Eureka load balancing). CORS is open for `http://localhost:3000`.

**Inter-service communication:** OpenFeign clients (synchronous REST). Bug-Service calls Project-Service to validate projects and Notification-Service to dispatch notifications.

**Database:** Single MySQL 8 instance (port 3306) with 4 separate databases: `user_service`, `bug_service`, `project_service`, `notification_service`. Initialized by `docker/mysql/init.sql`. All services use `spring.jpa.hibernate.ddl-auto=update`.

**Auth model:** No JWT — identity is passed as plain HTTP headers (`userId`, `role`) from the gateway downstream. Spring Security is only enabled in User-Auth-Service.

## Service Package Structure

Each service follows this layout under `src/main/java/com/example/<Name>/`:

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

## Key Domain Concepts

**User roles:** `ADMIN`, `STAFF`, `CUSTOMER`. Stored using JPA single-table inheritance (`User` → `Admin`/`Staff`/`Customer`).

**Bug lifecycle:** Bugs have a `BugStatus` enum and `BugPriority` (HIGH/MEDIUM/LOW). When a bug is assigned or resolved, Bug-Service calls Notification-Service via Feign to create a `Notification` record (READ/UNREAD status).

**Project ownership:** Each `Project` has an `adminId`. Bug-Service verifies project existence by calling Project-Service before creating a bug.

## Configuration Notes

- Docker service hostnames match spring application names: `mysql`, `discovery-service`, `api-gateway`, `user-service`, etc.
- All services connect to Eureka at `http://discovery-service:8761/eureka/` and set `prefer-ip-address: true`.
- Default DB credentials: `root` / `1234` (dev only).
- Spring Boot versions vary across services (3.2.5 – 4.0.5); keep this in mind when adding dependencies.
