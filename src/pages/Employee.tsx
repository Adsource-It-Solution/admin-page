import { useState, useEffect,type  FormEvent } from "react";
import axios from "axios";
import {
  Stack,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Employee = {
  _id?: string;
  name: string;
  email: string;
  password?: string;
};

export default function EmployeePage() {
  const [employee, setEmployee] = useState<Employee>({
    name: "",
    email: "",
    password: "",
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Employee>>({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/service/employees`,
        // "http://localhost:5000/api/service/employees"
      );
      setEmployees(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch employees");
    }
  };

  const handleAddEmployee = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/service/add-employee`,
        // "http://localhost:5000/api/service/add-employee",
         employee);
      setEmployee({ name: "", email: "", password: "" });
      fetchEmployees();
      toast.success("✅ Employee added successfully!");
    } catch (err: any) {
      toast.error("❌ " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  const handleEditClick = (emp: Employee) => {
    setEditingId(emp._id || null);
    setEditData({ name: emp.name, email: emp.email });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/service/employees/${id}`,
        // `http://localhost:5000/api/service/employees/${id}`,
         editData);
      setEditingId(null);
      setEditData({});
      fetchEmployees();
      toast.success("✏️ Employee updated");
    } catch (err) {
      toast.error("❌ Failed to update employee");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/service/employees/${id}`
        // `http://localhost:5000/api/service/employees/${id}`
      );
      fetchEmployees();
      toast.success("🗑️ Employee deleted");
    } catch (err) {
      toast.error("❌ Failed to delete employee");
    }
  };

  return (
    <Stack spacing={5} sx={{ maxWidth: 700, margin: "auto", mt: 5 }}>
      {/* Add Employee */}
      <Card>
        <h1 className="text-3xl flex justify-center font-bold">👤 Employees</h1>
        <CardContent>
          <form onSubmit={handleAddEmployee}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                variant="filled"
                value={employee.name}
                onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                variant="filled"
                type="email"
                value={employee.email}
                onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Password"
                variant="filled"
                type="password"
                value={employee.password}
                onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
                fullWidth
              />
              <Button type="submit" variant="contained" color="success">
                Add Employee
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Stack spacing={2}>
        {employees.length === 0 && (
          <p className="border border-slate-600 flex justify-center py-3">
            ❌ No employees added yet.
          </p>
        )}
        {employees.map((emp) => (
          <Card key={emp._id}>
            <CardContent>
              {editingId === emp._id ? (
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    variant="filled"
                    value={editData.name || ""}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <TextField
                    label="Email"
                    variant="filled"
                    type="email"
                    value={editData.email || ""}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                  <TextField
                    label="New Password (optional)"
                    variant="filled"
                    type="password"
                    value={editData.password || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, password: e.target.value })
                    }
                  />
                  <Stack direction="row" spacing={2}>
                    <Button
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveEdit(emp._id!)}
                    >
                      Save
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      variant="outlined"
                      color="inherit"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div>
                    <h3 className="font-bold">{emp.name}</h3>
                    <p className="text-gray-600">{emp.email}</p>
                  </div>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => handleEditClick(emp)}>
                      <EditIcon />
                    </IconButton>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => handleDelete(emp._id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Stack>
                </Stack>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
