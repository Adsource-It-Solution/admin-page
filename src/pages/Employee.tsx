import { useState, useEffect, type FormEvent } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Stack,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export type Employee = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  designation?: string;
};

function Employee() {
  const [employee, setEmployee] = useState<Employee>({
    name: "",
    email: "",
    phone: "",
    password: "",
    designation: "",
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Employee>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim() === "") {
        fetchEmployees();
      } else {
        searchEmployees(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/service/employees`,
        // "http://localhost:5000/api/service/employees"
      );
      setEmployees(res.data || []);
    } catch (err) {
      toast.error("❌ Failed to fetch employees");
    }
  };

  const handleAddEmployee = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // console.log("Sending employee:", employee); // ✅ Debugging
  
      const payload = {
        name: employee.name,
        email: employee.email,
        password: employee.password,
        phoneno: employee.phone,      
        designation: employee.designation || "",
      };
  
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/service/add-employee`,
        // "http://localhost:5000/api/service/add-employee",
        payload
      );
  
      console.log("Response from backend:", res.data); // ✅ Debugging
  
      setEmployee({ name: "", email: "", phone: "", designation: "", password: "" });
      fetchEmployees();
      toast.success("✅ Employee added successfully!");
    } catch (err: any) {
      console.error("Error adding employee:", err);
      toast.error("❌ " + (err.response?.data?.error || "Something went wrong"));
    }
  };
  

  const handleEditClick = (emp: Employee) => {
    setEditingId(emp._id || null);
    setEditData({ ...emp });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await axios.put
      (`${import.meta.env.VITE_API_URL}/api/service/employees/${id}`, editData)
      // (`http://localhost:5000/api/service/employees/${id}`, editData);
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
      await axios.delete
      (`${import.meta.env.VITE_API_URL}/api/service/employees/${id}`)
      // (`http://localhost:5000/api/service/employees/${id}`);
      fetchEmployees();
      toast.success("🗑️ Employee deleted");
    } catch (err) {
      toast.error("❌ Failed to delete employee");
    }
  };

  const searchEmployees = async (query: string) => {
    try {
      const res = await axios.get
      (`${import.meta.env.VITE_API_URL}/api/service/search-employee?query=${query}`)
      // (`http://localhost:5000/api/service/search-employee?query=${query}`);
      setEmployees(res.data.results || []);
    } catch (err) {
      console.error(err);
      setEmployees([]);
      toast.error("❌ Failed to search employees");
    }
  };

  return (
    <Stack spacing={5} sx={{ maxWidth: 700, margin: "auto", mt: 5 }}>
      {/* Add Employee Form */}
      <form onSubmit={handleAddEmployee}>
        <Stack spacing={2}>
          <TextField
            label="Employee Name"
            variant="filled"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            variant="filled"
            value={employee.email}
            onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Phone"
            variant="filled"
            value={employee.phone}
            onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
            fullWidth
          />
          <TextField
            label="Password"
            variant="filled"
            value={employee.password}
            onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
            fullWidth
          />
          <TextField
            label="Designation"
            variant="filled"
            value={employee.designation}
            onChange={(e) => setEmployee({ ...employee, designation: e.target.value })}
            fullWidth
          />

          <Button type="submit" variant="contained" color="success">
            Add Employee
          </Button>
        </Stack>
      </form>

      {/* Search Input */}
      <TextField
        placeholder="Search employee by name or first letter"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        variant="outlined"
      />

      {/* Employee List */}
      <Stack spacing={2}>
        {employees.length === 0 ? (
          <p className="border border-slate-600 flex justify-center py-3">
            ❌ No Employees found.
          </p>
        ) : (
          employees.map((emp) => (
            <Card key={emp._id}>
              <CardContent>
                {editingId === emp._id ? (
                  <Stack spacing={2}>
                    <TextField
                      label="Name"
                      variant="filled"
                      value={editData.name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                    <TextField
                      label="Email"
                      variant="filled"
                      value={editData.email || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                    />
                    <TextField
                      label="Password"
                      variant="filled"
                      value={editData.password || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, password: e.target.value })
                      }
                    />
                    <TextField
                      label="Phone"
                      variant="filled"
                      value={editData.phone || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                    />
                    <TextField
                      label="Designation"
                      variant="filled"
                      value={editData.designation || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, designation: e.target.value })
                      }
                    />
                    <Stack direction="row" spacing={2}>
                      <Button
                        startIcon={<SaveIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => emp._id && handleSaveEdit(emp._id)}
                      >
                        Save
                      </Button>
                      <Button
                        startIcon={<CancelIcon />}
                        variant="outlined"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <div>
                      <h3 className="font-bold">{emp.name}</h3>
                      <p className="text-gray-600">{emp.email}</p>
                      <p className="text-gray-600">{emp.phone}</p>
                      <p className="text-gray-600">{emp.designation}</p>
                      <p className="text-blue-600 font-mono">
                        ID: {emp._id}
                      </p>
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
          ))
        )}
      </Stack>
    </Stack>
  );
}

export default Employee;
