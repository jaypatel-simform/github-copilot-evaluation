# Task Management API Documentation

## Base URL
```
http://localhost:3000/api
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `403` - Forbidden (Cannot modify completed task)
- `404` - Not Found
- `500` - Internal Server Error

## Task Status Enum
- `TODO`
- `IN_PROGRESS`
- `COMPLETED`

## Task Priority Enum
- `HIGH` - Due date automatically set to 7 days from creation
- `MID` - Default priority
- `LOW`

---

## Endpoints

### 1. Create Task

**POST** `/tasks`

Creates a new task in the system.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "title": "string (required, min: 1, max: 200)",
  "description": "string (required, max: 1000)",
  "status": "string (optional, one of: TODO, IN_PROGRESS, COMPLETED)",
  "priority": "string (optional, one of: HIGH, MID, LOW, default: MID)",
  "dueDate": "string (optional, ISO date format, auto-set for HIGH priority)"
}
```

#### Example Request
```json
{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication to the application",
  "status": "TODO",
  "priority": "HIGH"
}
```

**Note:** When `priority` is set to `HIGH` and `dueDate` is not provided, the system automatically sets the due date to 7 days from the creation date.

#### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the application",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-02-27T10:30:00.000Z",
    "createdAt": "2026-02-20T10:30:00.000Z",
    "updatedAt": "2026-02-20T10:30:00.000Z"
  }
}
```

#### Error Response (400)
```json
{
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

---

### 2. Get All Tasks

**GET** `/tasks`

Retrieves all tasks from the system. Supports sorting by due date.

#### Query Parameters
- `sortByDueDate` (optional) - Set to `true` to sort tasks by due date in ascending order

#### Request Headers
None required

#### Request Body
None

#### Example Requests
```
GET /tasks
GET /tasks?sortByDueDate=true
```

#### Success Response (200)
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Implement user authentication",
      "description": "Add JWT-based authentication to the application",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2026-02-27T10:30:00.000Z",
      "createdAt": "2026-02-20T10:30:00.000Z",
      "updatedAt": "2026-02-20T10:30:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Setup database",
      "description": "Configure PostgreSQL database",
      "status": "IN_PROGRESS",
      "priority": "MID",
      "dueDate": "2026-03-22T11:00:00.000Z",
      "createdAt": "2026-02-20T11:00:00.000Z",
      "updatedAt": "2026-02-20T11:30:00.000Z"
    }
  ]
}
```

#### Empty Response (200)
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

---

### 3. Get Task by ID

**GET** `/tasks/:id`

Retrieves a specific task by its UUID.

#### URL Parameters
- `id` (required) - UUID v4 format

#### Request Headers
None required

#### Request Body
None

#### Example Request
```
GET /tasks/550e8400-e29b-41d4-a716-446655440000
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the application",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-02-27T10:30:00.000Z",
    "createdAt": "2026-02-20T10:30:00.000Z",
    "updatedAt": "2026-02-20T10:30:00.000Z"
  }
}
```

#### Error Response (400) - Invalid UUID Format
```json
{
  "error": {
    "message": "Invalid UUID format for parameter 'id'",
    "statusCode": 400
  }
}
```

#### Error Response (404) - Task Not Found
```json
{
  "error": {
    "message": "Task with ID '550e8400-e29b-41d4-a716-446655440000' not found",
    "statusCode": 404
  }
}
```

---

### 4. Update Task

**PUT** `/tasks/:id`

Updates an existing task. At least one field must be provided.

#### URL Parameters
- `id` (required) - UUID v4 format

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "title": "string (optional, min: 1, max: 200)",
  "description": "string (optional, max: 1000)",
  "status": "string (optional, one of: TODO, IN_PROGRESS, COMPLETED)",
  "priority": "string (optional, one of: HIGH, MID, LOW)",
  "dueDate": "string (optional, ISO date format)"
}
```

#### Example Request
```json
{
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "description": "Add JWT-based authentication to the application. Working on token generation."
}
```

**Note:** When updating `priority` to `HIGH` from a different priority level, and no `dueDate` is provided, the system automatically recalculates the due date to 7 days from the update time.

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the application. Working on token generation.",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2026-02-27T12:00:00.000Z",
    "createdAt": "2026-02-20T10:30:00.000Z",
    "updatedAt": "2026-02-20T12:00:00.000Z"
  }
}
```

#### Error Response (400) - Validation Error
```json
{
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "details": [
      {
        "field": "status",
        "message": "Status must be one of: TODO, IN_PROGRESS, COMPLETED"
      }
    ]
  }
}
```

#### Error Response (400) - No Fields Provided
```json
{
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "details": [
      {
        "field": "",
        "message": "At least one field must be provided for update"
      }
    ]
  }
}
```

#### Error Response (400) - Invalid UUID Format
```json
{
  "error": {
    "message": "Invalid UUID format for parameter 'id'",
    "statusCode": 400
  }
}
```

#### Error Response (403) - Task Already Completed
```json
{
  "error": {
    "message": "Cannot modify a task that is already completed",
    "statusCode": 403
  }
}
```

**Note:** Once a task status is marked as `COMPLETED`, it cannot be modified. Any attempt to update a completed task will result in a 403 error.

#### Error Response (404) - Task Not Found
```json
{
  "error": {
    "message": "Task with ID '550e8400-e29b-41d4-a716-446655440000' not found",
    "statusCode": 404
  }
}
```

---

### 5. Delete Task

**DELETE** `/tasks/:id`

Deletes a task from the system.

#### URL Parameters
- `id` (required) - UUID v4 format

#### Request Headers
None required

#### Request Body
None

#### Example Request
```
DELETE /tasks/550e8400-e29b-41d4-a716-446655440000
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### Error Response (400) - Invalid UUID Format
```json
{
  "error": {
    "message": "Invalid UUID format for parameter 'id'",
    "statusCode": 400
  }
}
```

#### Error Response (404) - Task Not Found
```json
{
  "error": {
    "message": "Task with ID '550e8400-e29b-41d4-a716-446655440000' not found",
    "statusCode": 404
  }
}
```

---

## Validation Rules

### Title
- **Required** for create
- **Optional** for update
- Must be a string
- Minimum length: 1 character
- Maximum length: 200 characters
- Automatically trimmed

### Description
- **Required** for create
- **Optional** for update
- Must be a string
- Maximum length: 1000 characters
- Automatically trimmed

### Status
- **Optional** for both create and update
- Must be one of: `TODO`, `IN_PROGRESS`, `COMPLETED`
- Defaults to `TODO` if not provided during creation

### Priority
- **Optional** for both create and update
- Must be one of: `HIGH`, `MID`, `LOW`
- Defaults to `MID` if not provided during creation
- When set to `HIGH` without a specified `dueDate`, automatically sets due date to 7 days from creation/update

### Due Date
- **Optional** for both create and update
- Must be a valid ISO date format
- When `priority` is `HIGH` and `dueDate` is not provided, automatically set to 7 days from now
- For other priorities, defaults to 30 days from creation if not provided

### UUID (for :id parameter)
- Must be a valid UUID v4 format
- Example: `550e8400-e29b-41d4-a716-446655440000`

---

## Common Error Responses

### 500 - Internal Server Error
```json
{
  "error": {
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

---

## Integration Notes

1. **Base URL**: Update the base URL according to your environment
2. **Content-Type**: Always use `application/json` for POST and PUT requests
3. **UUID Format**: All task IDs are UUID v4 format
4. **Timestamps**: All timestamps are in ISO 8601 format (UTC)
5. **Error Handling**: Always check the `success` field in responses
6. **Validation**: Refer to the validation rules section for field constraints
7. **Status Updates**: When updating a task, you can change the status without providing other fields
8. **Priority Automation**: HIGH priority tasks automatically get a due date of 7 days if not specified
9. **Sorting**: Use `?sortByDueDate=true` query parameter to get tasks sorted by due date
10. **Due Date Management**: Tasks can have custom due dates, or they can be auto-calculated based on priority
11. **Completed Tasks**: Once a task is marked as `COMPLETED`, it becomes immutable and cannot be modified

---

## Example Usage (JavaScript/TypeScript)

### Create Task
```typescript
const createTask = async (taskData) => {
  const response = await fetch('http://localhost:3000/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  return response.json();
};
```

### Get All Tasks
```typescript
const getAllTasks = async (sortByDueDate = false) => {
  const url = sortByDueDate 
    ? 'http://localhost:3000/api/tasks?sortByDueDate=true'
    : 'http://localhost:3000/api/tasks';
  const response = await fetch(url);
  return response.json();
};
```

### Update Task
```typescript
const updateTask = async (taskId, updates) => {
  const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return response.json();
};
```

### Delete Task
```typescript
const deleteTask = async (taskId) => {
  const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
    method: 'DELETE',
  });
  return response.json();
};
```
