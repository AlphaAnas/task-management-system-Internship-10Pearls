
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";
import { Task, User } from "@/types";
import TaskCard from "@/components/TaskCard";
import { Loader, Users, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [taskData, userData] = await Promise.all([
          taskService.getTasks(),
          userService.getUsers(),
        ]);
        setTasks(taskData);
        setUsers(userData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const getTaskCountByPriority = (priority: Task["priority"]) => {
    return tasks.filter((task) => task.priority === priority).length;
  };

  const getClientCount = () => {
    return users.filter(user => user.role === "client").length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-purple-800">Admin Dashboard</h1>
        <p className="text-purple-600 mt-1">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="bg-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-lg">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{tasks.length}</div>
            <p className="text-sm text-muted-foreground">Across all users</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/admin/tasks")}>
              View All Tasks
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-yellow-500 text-black rounded-t-lg">
            <CardTitle className="text-lg">Users</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-sm text-muted-foreground">Total users</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/admin/users")}>
              <Users size={16} className="mr-2" />
              Manage Users
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-green-500 text-white rounded-t-lg">
            <CardTitle className="text-lg">Clients</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{getClientCount()}</div>
            <p className="text-sm text-muted-foreground">Client users</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/users")}
            >
              View Clients
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-purple-300 text-purple-900 rounded-t-lg">
            <CardTitle className="text-lg">Task Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{getTasksByStatus("todo").length}</div>
                <p className="text-xs text-muted-foreground">To Do</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{getTasksByStatus("in-progress").length}</div>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{getTasksByStatus("completed").length}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-500 hover:bg-purple-600"
              onClick={() => navigate("/admin/tasks/new")}
            >
              Create Task
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Recently created or updated tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {[...tasks]
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/admin/tasks/${task.id}`)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-3 ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(task.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.status === "todo"
                            ? "bg-blue-100 text-blue-800"
                            : task.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.status}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No tasks found</div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/tasks")}
            >
              View All Tasks
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Analytics</CardTitle>
            <CardDescription>Overview of task priorities and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Task Priority</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{
                          width: `${tasks.length ? (getTaskCountByPriority("high") / tasks.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium">High ({getTaskCountByPriority("high")})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-500 h-2.5 rounded-full"
                        style={{
                          width: `${tasks.length ? (getTaskCountByPriority("medium") / tasks.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium">Medium ({getTaskCountByPriority("medium")})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{
                          width: `${tasks.length ? (getTaskCountByPriority("low") / tasks.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium">Low ({getTaskCountByPriority("low")})</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Task Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-md">
                    <div className="text-blue-500 text-2xl font-bold">{getTasksByStatus("todo").length}</div>
                    <div className="text-xs">To Do</div>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-yellow-50 p-4 rounded-md">
                    <div className="text-yellow-500 text-2xl font-bold">{getTasksByStatus("in-progress").length}</div>
                    <div className="text-xs">In Progress</div>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-green-50 p-4 rounded-md">
                    <div className="text-green-500 text-2xl font-bold">{getTasksByStatus("completed").length}</div>
                    <div className="text-xs">Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-500 hover:bg-purple-600"
              onClick={() => navigate("/admin/tasks/new")}
            >
              <CheckCircle size={16} className="mr-2" />
              Create New Task
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
