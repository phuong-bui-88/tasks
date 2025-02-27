# API Usage Examples

This document provides examples of how to interact with the Task Management API using curl commands.

## Task Operations

### Create a New Task

Use the following curl command to create a new task:

```bash
curl -X POST "http://localhost:9080/api/tasks" -H "Content-Type: application/json" -d '{"title": "New Task", "description": "Task description"}'

