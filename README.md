# Task Management System

A full-stack task management application built with React (Frontend) and .NET Core (Backend).

## 🚀 Features

- User authentication and authorization
- Create, read, update, and delete tasks
- Task categorization and prioritization
- Task status tracking
- Modern and responsive user interface

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Material-UI
- Axios for API calls

### Backend
- .NET Core
- Entity Framework Core
- SQL Server
- RESTful API

## 📋 Prerequisites

- Node.js (v14 or higher)
- .NET Core SDK (v6.0 or higher)
- SQL Server
- Visual Studio / VS Code

## 🔧 Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend/todoBackend/TaskManager.API
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Update the connection string in `appsettings.json` to match your SQL Server instance.

4. Run database migrations:
```bash
dotnet ef database update
```

5. Start the backend server:
```bash
dotnet run
```
The API will be available at `http://localhost:5137/api/todoapi`

### Frontend Setup

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
The application will be available at `http://localhost:8080`

## 🗄️ Database Schema

The system uses SQL Server with the following main tables:
- Users
- Tasks
- TaskStatuses
- TaskPriorities
- TaskCategories
- TaskAttachments

## 🔐 API Endpoints

### Tasks
- GET `/api/todoapi` - Get all tasks
- GET `/api/todoapi/{id}` - Get task by ID
- POST `/api/todoapi` - Create new task
- PUT `/api/todoapi/{id}` - Update task
- DELETE `/api/todoapi/{id}` - Delete task

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- 10Pearls for the internship opportunity
- All contributors who have helped with the project