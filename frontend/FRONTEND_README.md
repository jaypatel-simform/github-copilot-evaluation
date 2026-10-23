# Task Management Frontend (React)

A modern React-based frontend application for managing tasks, built with TypeScript and integrated with the Task Management API backend.

## Features

- ✅ Create, Read, Update, and Delete tasks
- ✅ Task status management (TODO, IN_PROGRESS, COMPLETED)
- ✅ Priority levels (Very high, HIGH, MID, LOW) — `Very high` and `HIGH` get a due date 7 days out when none is supplied
- ✅ Due date management
- ✅ Sort tasks by due date
- ✅ Responsive design
- ✅ Real-time error handling
- ✅ Loading states for better UX

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Backend API running on `http://localhost:3000`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API URL (optional):
   - The default API URL is `http://localhost:3000/api`
   - To change it, create or edit `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   ```

## Running the Application

1. Make sure the backend server is running on `http://localhost:3000`

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3001
```

The app will automatically reload if you make changes to the code.

### Frontend-only mode (mock API)

If you are doing the frontend-only track there is no backend: the `mock-api/` folder ships a
[json-server](https://github.com/typicode/json-server) mock of the task API backed by `mock-api/db.json`.

1. Start the mock API. Its default port is 3001, which the React dev server also uses, so give it another port:
```bash
cd mock-api
npm install
npx json-server --watch db.json --port 3002
```

2. Start the frontend pointed at the mock API (json-server serves the tasks under `/tasks` at the
   root, so there is **no** `/api` prefix):
```bash
cd frontend
REACT_APP_API_URL=http://localhost:3002 npm start
```

`mock-api/db.json` contains sample tasks covering all four priorities, including a `Very high` one,
so the new priority and its badge are visible straight away. The mock API stores whatever priority
string it is sent; the automatic 7-day due date for `Very high`/`HIGH` is a backend rule and is not
applied by json-server.

## Available Scripts

### `npm start`
Runs the app in development mode on `http://localhost:3001`.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── TaskList.tsx        # Main task list container
│   │   ├── TaskList.css
│   │   ├── TaskForm.tsx        # Create/Edit task form
│   │   ├── TaskForm.css
│   │   ├── TaskItem.tsx        # Individual task display
│   │   └── TaskItem.css
│   ├── services/
│   │   └── taskService.ts      # API integration service
│   ├── constants/
│   │   └── priority.ts         # Priority order, labels and badge classes
│   ├── types/
│   │   └── task.types.ts       # TypeScript type definitions
│   ├── App.tsx                 # Main app component
│   ├── App.css
│   └── index.tsx               # Entry point
├── public/
├── .env                        # Environment variables
├── package.json
└── README.md
```

## API Integration

The frontend connects to the backend API endpoints:

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks?sortByDueDate=true` - Get tasks sorted by due date
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Features in Detail

### Task List View
- Displays all tasks with their details
- Shows task statistics (total, todo, in progress, completed)
- Sort tasks by due date
- Quick status changes
- Edit and delete actions

### Create/Edit Task Form
- Input validation
- Required fields: Title and Description
- Optional fields: Status, Priority, Due Date
- Character limits enforced
- Cancel and save actions

### Task Item
- Color-coded by status
- Priority badges: `VERY HIGH` uses a solid dark-red badge, visually stronger than the pale `HIGH` badge, which
  is stronger than `MEDIUM` and `LOW`
- Quick status change buttons
- Edit and delete actions
- Completed tasks are immutable (edit disabled)

## Technology Stack

- **React** 19.2.5 - UI library
- **TypeScript** - Type safety
- **CSS3** - Styling with flexbox and grid
- **Fetch API** - HTTP requests

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend Connection Issues
- Ensure the backend is running on `http://localhost:3000`
- Check CORS settings in the backend
- Verify the API URL in `.env` file

### Port Already in Use
If port 3001 is already in use, you can specify a different port:
```bash
PORT=3002 npm start
```

## License

MIT
