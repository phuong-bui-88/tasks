# Database Migrations

This directory contains database migration scripts that are automatically executed by the Flyway migration tool when the application starts.

## How Migrations Work

1. Flyway checks the database for the migration history table (`flyway_schema_history`)
2. It compares the scripts in this directory with the executed migrations in the history table
3. Only new migration scripts (higher version numbers) are executed
4. Scripts are executed in version order

## Migration Files

| Version | Description | File |
|---------|-------------|------|
| V1      | Initial schema creation | V1__Initial_schema.sql |
| V2      | Add Start Date To Tasks | V2__Add_Start_Date_To_Tasks.sql |
| V2      | Update User Table Role Default | V2__update_user_table_role_default.sql |
| V3      | Remove assignee and reminder fields | V3__Remove_assignee_reminder_fields.sql |

## Naming Convention

Migration files must follow the naming pattern:
