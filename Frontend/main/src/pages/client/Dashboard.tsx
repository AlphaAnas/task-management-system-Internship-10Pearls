
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { taskService } from "@/services/taskService";
import { Task } from "@/types";
import TaskCard from "@/components/TaskCard";
import { Loader } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const taskData = await taskService.getTasks();
        setTasks(taskData);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const getTodaysTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      return dueDate.getTime() === today.getTime();
    });
  };
  
  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      return dueDate.getTime() > today.getTime();
    }).sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  const getTaskCountByPriority = (priority: Task["priority"]) => {
    return tasks.filter((task) => task.priority === priority).length;
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
        <h1 className="text-3xl font-bold text-purple-800">Welcome, {user?.name}!</h1>
        <p className="text-purple-600 mt-1">Here's your task overview for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-lg">Tasks</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{tasks.length}</div>
            <p className="text-sm text-muted-foreground">Total tasks</p>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div>To Do: {getTasksByStatus("todo").length}</div>
            <div>In Progress: {getTasksByStatus("in-progress").length}</div>
            <div>Completed: {getTasksByStatus("completed").length}</div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-yellow-500 text-black rounded-t-lg">
            <CardTitle className="text-lg">Due Today</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{getTodaysTasks().length}</div>
            <p className="text-sm text-muted-foreground">Tasks due today</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/tasks")}>
              View Today's Tasks
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-purple-300 text-purple-900 rounded-t-lg">
            <CardTitle className="text-lg">Priority</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{getTaskCountByPriority("high")}</div>
                <p className="text-xs text-muted-foreground">High</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{getTaskCountByPriority("medium")}</div>
                <p className="text-xs text-muted-foreground">Medium</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{getTaskCountByPriority("low")}</div>
                <p className="text-xs text-muted-foreground">Low</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-500 hover:bg-purple-600"
              onClick={() => navigate("/tasks/new")}
            >
              Create New Task
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="upcoming">Upcoming Tasks</TabsTrigger>
          <TabsTrigger value="recent">Recent Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-bold text-purple-700">Upcoming Tasks</h2>
            {getUpcomingTasks().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getUpcomingTasks().slice(0, 6).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming tasks. Enjoy your free time!</p>
            )}
          </div>
          {getUpcomingTasks().length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate("/tasks")}>
                View All Tasks
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="recent">
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-bold text-purple-700">Recently Updated Tasks</h2>
            {tasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...tasks]
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 6)
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No tasks found. Start by creating a new task!</p>
            )}
          </div>
          {tasks.length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate("/tasks")}>
                View All Tasks
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
