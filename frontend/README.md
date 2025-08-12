# Train Search Frontend

React frontend for the Train Search application.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open at [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

### Environment Variables

Create a `.env` file in the frontend directory for custom configuration:

```
REACT_APP_API_URL=http://localhost:5000
```

### Features

- Station dropdown populated from backend
- Train search functionality
- Responsive design
- Error handling
- Loading states

### API Integration

The frontend communicates with the Flask backend running on port 5000. Make sure the backend is running before starting the frontend.
