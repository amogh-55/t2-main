"use client";

import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import LogoutButton from "@/app/_components/logout";
import { 
  ClipboardList, 
  Trash, 
  PlusCircle, 
  Edit,
  X, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

type Task = {
  id: string;
  title: string | null;
  description: string;
  status: "Pending" | "Approved" | null;
  createdAt: Date;
};

type TaskFormData = {
  title: string;
  description: string;
  status: "Pending" | "Approved";
};

export default function TaskForm() {
  const { register, handleSubmit, reset, setValue } = useForm<TaskFormData>();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "Pending" | "Approved">("all");

  // Fetch all tasks
  const { data: tasks, refetch, isLoading } = api.task.getAllTask.useQuery();

  // Create task mutation
  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      alert("Task added successfully!");
      reset();
      await refetch();
    },
  });

  // Update task mutation
  const updateTask = api.task.update.useMutation({
    onSuccess: async () => {
      alert("Task updated successfully!");
      setEditingTaskId(null);
      reset();
      await refetch();
    },
  });

  // Delete task mutation
  const deleteTask = api.task.delete.useMutation({
    onSuccess: async () => {
      alert("Task deleted successfully!");
      await refetch();
    },
  });

  // Handle form submission
  const onSubmit = (data: TaskFormData) => {
    if (editingTaskId) {
      updateTask.mutate({ id: editingTaskId, ...data });
    } else {
      createTask.mutate(data);
    }
  };

  // Handle edit click
  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setValue("title", task.title ?? "");
    setValue("description", task.description);
    setValue("status", task.status ?? "Pending");
  };
  
  // Handle delete click
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate({ id });
    }
  };

  // Filter tasks based on status
  const filteredTasks = tasks?.filter(task => 
    filter === "all" ? true : task.status === filter
  );

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "Pending":
        return <AlertCircle size={16} className="text-yellow-500" />;
      case "Approved":
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <AlertCircle size={16} className="text-yellow-500" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <LogoutButton/>
      <div className="max-w-6xl mx-auto flex gap-6">
        {/* Sidebar Filter */}
        <div className="w-56 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-gray-700 flex items-center gap-2">
            <ClipboardList size={20} />
            Status <br></br>
            

          </h2>
          
          <ul className="space-y-2">
            {["all", "Pending", "Approved"].map((status) => (
              <li key={status}>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                    filter === status 
                      ? "bg-indigo-100 text-indigo-700 font-medium" 
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setFilter(status as "all" | "Pending" | "Approved")}
                >
                  {status === "all" 
                    ? <ClipboardList size={16} className="text-gray-500" />
                    : getStatusIcon(status)}
                  <span className="capitalize">{status}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Task Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="font-bold text-xl mb-4 text-gray-700 flex items-center gap-2">
              {editingTaskId ? <Edit size={20} /> : <PlusCircle size={20} />}
              {editingTaskId ? "Edit Task" : "Add New Task"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="Enter title"
                  className="w-full border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register("description")}
                  placeholder="Enter description"
                  className="w-full border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  {...register("status")}
                  className="w-full border border-gray-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 flex-grow"
                >
                  {editingTaskId ? <CheckCircle size={18} /> : <PlusCircle size={18} />}
                  {editingTaskId ? "Update Task" : "Add Task"}
                </button>
                {editingTaskId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTaskId(null);
                      reset();
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Task List */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-bold text-xl mb-4 text-gray-700">Task List</h2>
            
            {isLoading && <p className="text-center py-10 text-gray-500">Loading tasks...</p>}
            
            {!isLoading && filteredTasks?.length === 0 && (
              <p className="text-center py-10 text-gray-500">No tasks found</p>
            )}
            
            {!isLoading && filteredTasks && filteredTasks.length > 0 && (
              <ul className="space-y-3">
                {filteredTasks.map((task) => (
                  <li key={task.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{task.title ?? "Untitled"}</h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {getStatusIcon(task.status)}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                            {task.status ?? "Pending"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                          title="Edit task"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id)} 
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                          title="Delete task"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}