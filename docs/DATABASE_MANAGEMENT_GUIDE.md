# PostgreSQL Database & Mock Data Management Guide

This guide explains how to start, seed, query, and manage the **PostgreSQL database** for the enterprise identity management architecture.

---

## 1. Connection Parameters & Credentials

| Property | Default Local Value | Docker Compose Service | Kubernetes Service |
| :--- | :--- | :--- | :--- |
| **Host** | `localhost` | `postgres` | `postgres-service.enterprise-identity` |
| **Port** | `5432` | `5432` | `5432` |
| **Database** | `usermanagement` | `usermanagement` | `usermanagement` |
| **Username** | `postgres` | `postgres` | `postgres` |
| **Password** | `postgres` | `postgres` | Injected via `identity-service-secrets` |
| **JDBC URL** | `jdbc:postgresql://localhost:5432/usermanagement` | `jdbc:postgresql://postgres:5432/usermanagement` | `jdbc:postgresql://postgres-service:5432/usermanagement` |

---

## 2. Starting the PostgreSQL Database

### Option A: Using Docker Compose (Recommended)
You can start just PostgreSQL and the Web-based Database Manager:

```bash
# Start PostgreSQL and Adminer DB Manager in background
docker-compose up -d postgres db-manager
```

Or start the entire system (DB + DB Manager + Backend + Frontend):
```bash
docker-compose up --build
```

### Option B: Local Native PostgreSQL
If you have PostgreSQL installed on your machine:
```bash
createdb -U postgres usermanagement
psql -U postgres -d usermanagement -f scripts/init-db/01-schema.sql
psql -U postgres -d usermanagement -f scripts/init-db/02-seed-data.sql
```

---

## 3. Database Management Tools

### 1. Web-Based Manager (Adminer)
A lightweight web interface is included in `docker-compose.yml`:
1. Open your browser at **`http://localhost:8081`**
2. Login with:
   - **System**: `PostgreSQL`
   - **Server**: `postgres` (or `localhost` if connecting from outside docker)
   - **Username**: `postgres`
   - **Password**: `postgres`
   - **Database**: `usermanagement`
3. You can visually browse tables, run custom SQL queries, export data, and inspect rows.

### 2. Desktop GUI Clients (DBeaver / TablePlus / IntelliJ / VS Code)
Configure a new PostgreSQL connection:
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `usermanagement`
- **User**: `postgres`
- **Password**: `postgres`

### 3. Command Line Interface (`psql`)
Connect directly via Docker:
```bash
docker exec -it enterprise-postgres psql -U postgres -d usermanagement
```

---

## 4. Pre-Loaded Enterprise Mock Data

The database comes pre-seeded with 7 realistic enterprise personas representing diverse states and departments:

| ID | Name | Email | Status | Department | Migration Scenario |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `usr-1001` | Alex Morgan | alex.morgan@enterprise.com | `ACTIVE` | Security & Identity | Primary demo user (Linked to new IdP) |
| `usr-1002` | Sarah Connor | sarah.connor@enterprise.com | `ACTIVE` | DevOps & Cloud | Technical administrator |
| `usr-1003` | Marcus Chen | marcus.chen@enterprise.com | `PENDING_ACTIVATION` | Financial Technology | Staged user awaiting first-login MFA setup |
| `usr-1004` | Elena Rostova | elena.rostova@enterprise.com | `ACTIVE` | AI / Machine Learning | Active corporate user |
| `usr-1005` | David Kim | david.kim@enterprise.com | `SUSPENDED` | HR Operations | Compliance lock / suspension flow |
| `usr-1006` | Priya Patel | priya.patel@enterprise.com | `PENDING_ACTIVATION` | Enterprise Architecture | Greenfield registration stage |
| `usr-1007` | James Wilson | james.wilson@enterprise.com | `ACTIVE` | Legal & Compliance | Migrated legacy IdP user |

---

## 5. Common Management Queries

Run these queries in `psql` or Adminer:

### A. List All Tables & Schema
```sql
-- List tables
\dt

-- Inspect enterprise_users columns and types
\d enterprise_users
```

### B. Inspect User Status Breakdown
```sql
SELECT status, count(*) AS total_users 
FROM enterprise_users 
GROUP BY status;
```

### C. View Pending Activation Users (First-Login Stage)
```sql
SELECT id, username, email, department, created_at 
FROM enterprise_users 
WHERE status = 'PENDING_ACTIVATION';
```

### D. View Users by Department
```sql
SELECT department, count(*) AS head_count 
FROM enterprise_users 
GROUP BY department 
ORDER BY head_count DESC;
```

### E. Manually Insert a New User
```sql
INSERT INTO enterprise_users (
    id, external_identity_id, username, email, first_name, last_name,
    date_of_birth, phone_number, status, department, employee_id, preferred_language
) VALUES (
    'usr-1008',
    '00u8ghij890KLMN123',
    'jordan.lee@enterprise.com',
    'jordan.lee@enterprise.com',
    'Jordan',
    'Lee',
    '1994-08-12',
    '+1 (555) 073-1940',
    'ACTIVE',
    'Product Management',
    'EMP-29103',
    'en'
);
```

### F. Unlock or Suspend an Account
```sql
-- Suspend a user
UPDATE enterprise_users 
SET status = 'SUSPENDED', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'usr-1003';

-- Re-activate a user
UPDATE enterprise_users 
SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'usr-1005';
```

---

## 6. Running the Spring Boot Backend with PostgreSQL

To run the Spring Boot service locally connected to PostgreSQL:

```bash
cd user-management-service

# Run using the postgres profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

Or pass custom connection overrides:
```bash
DB_HOST=localhost DB_PORT=5432 DB_NAME=usermanagement DB_USER=postgres DB_PASSWORD=postgres ./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

---

## 7. Backup and Restore

### Create a Database Backup (`pg_dump`)
```bash
docker exec -t enterprise-postgres pg_dump -U postgres usermanagement > backup_$(date +%Y%m%d).sql
```

### Restore from a Backup File
```bash
docker exec -i enterprise-postgres psql -U postgres -d usermanagement < backup_20260917.sql
```
