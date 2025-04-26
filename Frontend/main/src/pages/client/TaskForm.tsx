
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader, Calendar, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";
import { Task, User } from "@/types";
import { toast } from "@/components/ui/sonner";

const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.enum(["todo", "in-progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const TaskForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isEdit = !!id;
  const baseUrl = isAdmin ? "/admin" : "";

  const [loading, setLoading] = useState(isEdit);
  const [users, setUsers] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "todo",
      priority: "medium",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load users for assignment
        const userData = await userService.getUsers();
        setUsers(userData);

        // If editing, load task data
        if (isEdit && id) {
          const taskData = await taskService.getTask(id);
          if (taskData) {
            setValue("title", taskData.title);
            setValue("description", taskData.description);
            setValue("status", taskData.status);
            setValue("priority", taskData.priority);
            
            if (taskData.dueDate) {
              // Format the date to YYYY-MM-DD for input[type="date"]
              const date = new Date(taskData.dueDate);
              const formattedDate = date.toISOString().split("T")[0];
              setValue("dueDate", formattedDate);
            }
            
            if (taskData.assignedTo) {
              setValue("assignedTo", taskData.assignedTo);
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load task data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit, setValue]);

  const onSubmit = async (data: TaskFormData) => {
    if (!user) return;

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await taskService.updateTask(id, data);
        toast.success("Task updated successfully");
      } else {
        await taskService.createTask({
          ...data,
          createdBy: user.id,
        });
        toast.success("Task created successfully");
      }
      navigate(`${baseUrl}/tasks`);
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-purple-500" />
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
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Task" : "Create New Task"}</CardTitle>
          <CardDescription>
            {isEdit
              ? "Update the details of an existing task"
              : "Fill out the form to create a new task"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                placeholder="Task title"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Task description and details"
                {...register("description")}
                className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status <span className="text-red-500">*</span>
                </label>
                <Select
                  defaultValue={register("status").value}
                  onValueChange={(value) => setValue("status", value as "todo" | "in-progress" | "completed")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-xs text-destructive">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority <span className="text-red-500">*</span>
                </label>
                <Select
                  defaultValue={register("priority").value}
                  onValueChange={(value) => setValue("priority", value as "low" | "medium" | "high")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-xs text-destructive">{errors.priority.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium flex items-center">
                  <Calendar size={16} className="mr-2 text-purple-500" />
                  Due Date
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="assignedTo" className="text-sm font-medium">
                  Assign To
                </label>
                <Select
                  defaultValue={register("assignedTo").value}
                  onValueChange={(value) => setValue("assignedTo", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`${baseUrl}/tasks`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-purple-500 hover:bg-purple-600"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader size={16} className="mr-2 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEdit ? "Update Task" : "Create Task"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default TaskForm;
