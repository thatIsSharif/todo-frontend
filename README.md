# Todo App - Frontend

A simple, responsive todo application frontend built with vanilla JavaScript, HTML, and CSS. Features a clean UI with dark/light theme support.

## Features

- Create, complete, and delete todos
- Dark mode / light mode toggle with persistent preference
- Input validation and error handling
- Responsive design

## Prerequisites

- A backend API server running at `http://localhost:3000` (see [todo-backend](https://github.com/thatIsSharif/todo-backend))

## Getting Started

1. Open `index.html` in a web browser, or serve the directory with any static file server:

   ```bash
   npx serve .
   ```

2. Ensure the backend API is running for full functionality.

## API Endpoints

The frontend communicates with the backend at `http://localhost:3000/api/todos`:

| Method | Endpoint       | Description          |
|--------|---------------|----------------------|
| GET    | /api/todos    | Fetch all todos      |
| POST   | /api/todos    | Create a new todo    |
| PATCH  | /api/todos/:id| Update a todo        |
| DELETE | /api/todos/:id| Delete a todo        |

## Project Structure

```
├── index.html   # Main HTML page
├── style.css    # Styles with dark/light theme variables
├── app.js       # Application logic and API client
└── README.md    # This file
```