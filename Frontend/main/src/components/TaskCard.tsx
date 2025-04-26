
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, User } from "lucide-react";
import { Task } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleClick = () => {
    const baseUrl = isAdmin ? "/admin" : "";
    navigate(`${baseUrl}/tasks/${task.id}`);
  };

  return (
    <Card 
      className="task-card hover:border-purple-300 cursor-pointer transition-colors" 
      onClick={handleClick}
    >
      <CardContent className="pt-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-purple-900 truncate">{task.title}</h3>
          <Badge className={`${getStatusColor(task.status)}`}>
            {task.status.replace("-", " ")}
          </Badge>
        </div>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center mt-4 text-xs text-gray-500">
          <CalendarIcon size={14} className="mr-1" />
          {task.dueDate 
            ? new Date(task.dueDate).toLocaleDateString() 
            : "No due date"}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Badge variant="outline" className={`${getPriorityColor(task.priority)}`}>
          {task.priority}
        </Badge>
        
        <div className="flex items-center text-xs text-gray-500">
          <User size={14} className="mr-1" />
          {task.assignedTo || "Unassigned"}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
