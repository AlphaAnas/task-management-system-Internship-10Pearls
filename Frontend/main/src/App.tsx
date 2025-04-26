
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import RouteGuard from "@/components/RouteGuard";

// Public Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

// Client Pages
import Dashboard from "@/pages/client/Dashboard";
import TaskList from "@/pages/client/TaskList";
import TaskDetail from "@/pages/client/TaskDetail";
import TaskForm from "@/pages/client/TaskForm";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserList from "@/pages/admin/UserList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes - Don't require authentication */}
            <Route element={<RouteGuard requireAuth={false} />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Login />} />
            </Route>

            {/* Client Routes - Require authentication */}
            <Route element={<RouteGuard requireAuth={true} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/tasks/edit/:id" element={<TaskForm />} />
              <Route path="/tasks/new" element={<TaskForm />} />
            </Route>

            {/* Admin Routes - Require admin role */}
            <Route element={<RouteGuard requireAuth={true} requireAdmin={true} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/tasks" element={<TaskList />} />
              <Route path="/admin/tasks/:id" element={<TaskDetail />} />
              <Route path="/admin/tasks/edit/:id" element={<TaskForm />} />
              <Route path="/admin/tasks/new" element={<TaskForm />} />
              <Route path="/admin/users" element={<UserList />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
