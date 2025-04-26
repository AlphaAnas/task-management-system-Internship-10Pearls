
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, X, CheckCircle, Circle, User, Users, Plus } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const baseUrl = isAdmin ? "/admin" : "";

  const navigation = [
    {
      name: "Dashboard",
      path: `${baseUrl}/dashboard`,
      icon: <CheckCircle size={20} />,
    },
    {
      name: "Tasks",
      path: `${baseUrl}/tasks`,
      icon: <Circle size={20} />,
    }
  ];

  // Add admin-only navigation items
  if (isAdmin) {
    navigation.push({
      name: "Users",
      path: "/admin/users",
      icon: <Users size={20} />,
    });
  }

  return (
    <div className="flex h-screen bg-purple-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-1 bg-white shadow-md">
          <div className="flex items-center h-16 px-4 bg-purple-500 text-white">
            <Link to={`${baseUrl}/dashboard`} className="text-xl font-bold">
              TaskMaster
            </Link>
          </div>
          <div className="flex flex-col flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <hr className="my-3" />
            <Link
              to={`${baseUrl}/tasks/new`}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-md transition-colors"
            >
              <Plus size={20} className="mr-2" />
              New Task
            </Link>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Badge variant={isAdmin ? "destructive" : "secondary"} className="ml-auto">
                {user?.role}
              </Badge>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => logout()}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 flex items-center justify-between h-16 px-4 bg-purple-500 text-white">
        <Link to={`${baseUrl}/dashboard`} className="text-xl font-bold">
          TaskMaster
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex items-center justify-between h-16 px-4 bg-purple-500 text-white">
              <Link to={`${baseUrl}/dashboard`} className="text-xl font-bold">
                TaskMaster
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <hr className="my-3" />
              <Link
                to={`${baseUrl}/tasks/new`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-md transition-colors"
              >
                <Plus size={20} className="mr-2" />
                New Task
              </Link>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <Badge variant={isAdmin ? "destructive" : "secondary"} className="mt-1">
                    {user?.role}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <main className="flex-1 relative pt-16 md:pt-0">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
