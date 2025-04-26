
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";
import { Task, User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  Loader,
  User as UserIcon,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
} from "lucide-react";

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const baseUrl = isAdmin ? "/admin" : "";

  const [task, setTask] = useState<Task | null>(null);
  const [assignedUser, setAssignedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      try {
        if (!id) return;
        
        const taskData = await taskService.getTask(id);
        if (!taskData) {
          toast.error("Task not found");
          navigate(`${baseUrl}/tasks`);
          return;
        }
        
        setTask(taskData);
        
        if (taskData.assignedTo) {
          const userData = await userService.getUser(taskData.assignedTo);
          setAssignedUser(userData || null);
        }
      } catch (error) {
        console.error("Error loading task:", error);
        toast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };
    
    loadTask();
  }, [id, navigate, baseUrl]);

  const handleDelete = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      await taskService.deleteTask(id);
      toast.success("Task deleted successfully");
      navigate(`${baseUrl}/tasks`);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">To Do</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Priority</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Priority</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low Priority</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-purple-500" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
        <h2 className="mt-4 text-lg font-semibold">Task not found</h2>
        <p className="mt-2 text-gray-500">The task you're looking for does not exist or was deleted.</p>
        <Button 
          className="mt-6"
          onClick={() => navigate(`${baseUrl}/tasks`)}
        >
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6 text-purple-600 hover:text-purple-800 hover:bg-purple-50"
        onClick={() => navigate(`${baseUrl}/tasks`)}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Tasks
      </Button>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-purple-900">{task.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(task.status)}
                {getPriorityBadge(task.priority)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-purple-600 border-purple-200"
                onClick={() => navigate(`${baseUrl}/tasks/edit/${task.id}`)}
              >
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the task.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {deleting ? (
                        <>
                          <Loader size={16} className="mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Details</h3>
                <dl className="space-y-2">
                  <div className="flex items-center">
                    <dt className="flex items-center text-sm text-gray-500 w-28">
                      <Calendar size={16} className="mr-2" />
                      Due Date:
                    </dt>
                    <dd className="text-sm font-medium">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                    </dd>
                  </div>
                  <div className="flex items-center">
                    <dt className="flex items-center text-sm text-gray-500 w-28">
                      <CheckCircle size={16} className="mr-2" />
                      Status:
                    </dt>
                    <dd>{getStatusBadge(task.status)}</dd>
                  </div>
                  <div className="flex items-center">
                    <dt className="flex items-center text-sm text-gray-500 w-28">
                      <AlertCircle size={16} className="mr-2" />
                      Priority:
                    </dt>
                    <dd>{getPriorityBadge(task.priority)}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Assignment</h3>
                <dl className="space-y-2">
                  <div className="flex items-center">
                    <dt className="flex items-center text-sm text-gray-500 w-28">
                      <UserIcon size={16} className="mr-2" />
                      Assigned to:
                    </dt>
                    <dd className="text-sm font-medium">
                      {assignedUser ? assignedUser.name : "Unassigned"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="py-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              Created: {new Date(task.createdAt).toLocaleString()}
            </div>
            <div className="flex items-center">
              <ClockIcon size={14} className="mr-1" />
              Last updated: {new Date(task.updatedAt).toLocaleString()}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaskDetail;
