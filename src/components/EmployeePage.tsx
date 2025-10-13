import { useState, useEffect, type FormEvent } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Stack,
  Card,
  CardContent,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  TextareaAutosize,
  CircularProgress,
  Typography,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";

// ✅ Base configuration
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true; // Important for cookies

// ✅ Attach access token automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Intercept responses to handle token refresh
axios.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/refresh-token`, {
          withCredentials: true,
        });
        localStorage.setItem("accessToken", res.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh failed", refreshErr);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


type employeeClient = {
  _id?: string;
  nameemployeeclient: string;
  email: string;
  address: string;
  phoneno?: string;
  title?: string;
  clienttype: string;
  aboutclient: string;
};

function EmployeePage() {
  const [employeeClient, setEmployeeClient] = useState<employeeClient>({
    nameemployeeclient: "",
    email: "",
    address: "",
    phoneno: "",
    title: "",
    clienttype: "",
    aboutclient: "",
  });

  const [employeeClients, setEmployeeClients] = useState<employeeClient[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<employeeClient>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // ✅ Fetch logged-in employee details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("👤 Fetching logged-in user...");
        const res = await axios.get(`/api/admin/me`, { withCredentials: true });
        setUser(res.data.employee);
        console.log("✅ User info loaded:", res.data.employee);
      } catch (err) {
        console.error("❌ Failed to fetch user info", err);
        toast.error("Failed to load user info");
      }
    };
    fetchUser();
  }, []);

  // ✅ Fetch or search clients
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim() === "") fetchEmployeeClients();
      else searchClients(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchEmployeeClients = async () => {
    try {
      setLoading(true);
      console.log("📦 Fetching employee clients...");
      const res = await axios.get(`/api/service/employee-client`, {
        withCredentials: true,
      });
      setEmployeeClients(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch clients", err);
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeClients();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");
      await axios.post(`/api/admin/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.warn("⚠️ Logout API failed but clearing tokens anyway");
    }
    localStorage.removeItem("accessToken");
    toast.info("👋 Logged out");
    window.location.href = "/login";
  };

  // ✅ Add new client
  const handleAddClient = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/api/service/add-employee-client`, employeeClient, {
        withCredentials: true,
      });
      setEmployeeClient({
        nameemployeeclient: "",
        email: "",
        address: "",
        phoneno: "",
        title: "",
        clienttype: "",
        aboutclient: "",
      });
      fetchEmployeeClients();
      toast.success("✅ Client added successfully!");
    } catch (err: any) {
      console.error("❌ Add client failed", err);
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  // ✅ Edit & Update
  const handleEditClick = (client: employeeClient) => {
    setEditingId(client._id!);
    setEditData(client);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await axios.put(`/api/service/employee-clients-edit/${id}`, editData, {
        withCredentials: true,
      });
      toast.success("✅ Client updated");
      fetchEmployeeClients();
      handleCancelEdit();
    } catch (err) {
      console.error("❌ Failed to update client", err);
      toast.error("Failed to update client");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // ✅ Delete client
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/service/employee-clients/${id}`, {
        withCredentials: true,
      });
      toast.success("🗑️ Client deleted");
      setEmployeeClients((prev) => prev.filter((cl) => cl._id !== id));
    } catch (err) {
      console.error("❌ Delete client failed", err);
      toast.error("Failed to delete client");
    }
  };

  const searchClients = async (query: string) => {
    try {
      const res = await axios.get(
        `/api/service/search-employee-client?query=${query}`,
        { withCredentials: true }
      );
      setEmployeeClients(res.data.results || []);
    } catch (err) {
      console.error("❌ Failed to search clients", err);
      setEmployeeClients([]);
      toast.error("Failed to search clients");
    }
  };

  return (
    <Stack spacing={5} sx={{ maxWidth: 700, margin: "auto", mt: 5 }}>
      {/* ✅ Logged-in Employee Info */}
      <Card sx={{ background: "#f3f4f6" }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {user?.name?.[0]?.toUpperCase() || "E"}
              </Avatar>
              <div>
                <Typography variant="h6">{user?.name || "Employee"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </div>
            </Stack>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* ✅ Add Client Form */}
      <form onSubmit={handleAddClient}>
        <Stack spacing={2}>
          <div className="flex flex-row gap-2">
            <FormControl sx={{ width: 100 }} variant="filled">
              <InputLabel id="client-title-label">Title</InputLabel>
              <Select
                labelId="client-title-label"
                value={employeeClient.title || ""}
                onChange={(e) =>
                  setEmployeeClient({ ...employeeClient, title: e.target.value })
                }
                displayEmpty
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Mrs.">Mrs.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Client Name"
              variant="filled"
              value={employeeClient.nameemployeeclient}
              onChange={(e) =>
                setEmployeeClient({ ...employeeClient, nameemployeeclient: e.target.value })
              }
              fullWidth
            />
          </div>

          <TextField
            label="Client Phone"
            variant="filled"
            value={employeeClient.phoneno}
            onChange={(e) =>
              setEmployeeClient({ ...employeeClient, phoneno: e.target.value })
            }
          />
          <TextField
            label="Client Email"
            variant="filled"
            value={employeeClient.email}
            onChange={(e) =>
              setEmployeeClient({ ...employeeClient, email: e.target.value })
            }
          />
          <TextField
            label="Client Address"
            variant="filled"
            value={employeeClient.address}
            onChange={(e) =>
              setEmployeeClient({ ...employeeClient, address: e.target.value })
            }
          />
          <TextField
            label="Client Type"
            variant="filled"
            value={employeeClient.clienttype}
            onChange={(e) =>
              setEmployeeClient({ ...employeeClient, clienttype: e.target.value })
            }
          />
          <TextField
            label="Client Details"
            variant="filled"
            value={employeeClient.aboutclient}
            onChange={(e) =>
              setEmployeeClient({ ...employeeClient, aboutclient: e.target.value })
            }
            multiline
            minRows={3}
            fullWidth
            InputProps={{
              inputComponent: TextareaAutosize as any,
            }}
          />

          <Button type="submit" variant="contained" color="success">
            Add Client
          </Button>
        </Stack>
      </form>

      {/* ✅ Search Input */}
      <TextField
        placeholder="Search client by name or first letter"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        variant="outlined"
      />

      {/* ✅ Client List */}
      <Stack spacing={2}>
        {loading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : employeeClients.length === 0 ? (
          <p className="border border-slate-600 flex justify-center py-3">
            ❌ No Clients found.
          </p>
        ) : (
          employeeClients.map((cl) => (
            <Card key={cl._id}>
              <CardContent>
                {editingId === cl._id ? (
                  <Stack spacing={2} sx={{ background: "#f8fafc", p: 2, borderRadius: 2 }}>
                    {/* Editable Fields */}
                    <Stack direction="row" spacing={2}>
                      <FormControl sx={{ width: 100 }} variant="filled">
                        <InputLabel id="client-title-label-edit">Title</InputLabel>
                        <Select
                          labelId="client-title-label-edit"
                          value={editData.title || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, title: e.target.value })
                          }
                        >
                          <MenuItem value="Mr.">Mr.</MenuItem>
                          <MenuItem value="Mrs.">Mrs.</MenuItem>
                          <MenuItem value="Ms.">Ms.</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Client Name"
                        variant="filled"
                        value={editData.nameemployeeclient || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            nameemployeeclient: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Stack>

                    <TextField
                      label="Phone Number"
                      variant="filled"
                      value={editData.phoneno || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, phoneno: e.target.value })
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
                      label="Address"
                      variant="filled"
                      value={editData.address || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, address: e.target.value })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Client Type"
                      variant="filled"
                      value={editData.clienttype || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, clienttype: e.target.value })
                      }
                    />
                    <TextField
                      label="About Client"
                      variant="filled"
                      value={editData.aboutclient || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, aboutclient: e.target.value })
                      }
                      multiline
                      minRows={3}
                      fullWidth
                      InputProps={{
                        inputComponent: TextareaAutosize as any,
                      }}
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        startIcon={<SaveIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => cl._id && handleSaveEdit(cl._id)}
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
                  // ✅ Normal view
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <div>
                      <h3 className="font-bold text-lg">
                        {cl.title} {cl.nameemployeeclient}
                      </h3>
                      <p className="text-gray-600">{cl.email}</p>
                      <p className="text-sm text-gray-500">📞 {cl.phoneno}</p>
                      <p className="text-sm text-gray-500">🏠 {cl.address}</p>
                      <p className="text-blue-600 font-mono">Type: {cl.clienttype}</p>
                      <p className="text-sm text-gray-500 mt-1">{cl.aboutclient}</p>
                    </div>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" onClick={() => handleEditClick(cl)}>
                        <EditIcon />
                      </IconButton>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(cl._id!)}
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

export default EmployeePage;
