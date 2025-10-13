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
    CircularProgress
} from "@mui/material";
import { toast } from "react-toastify";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// ✅ Base API setup
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true; // 👈 allow cookies (for refreshToken)

// ✅ Request interceptor: attach access token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor: auto-refresh expired tokens
axios.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-access-token"];
    if (newToken) localStorage.setItem("accessToken", newToken);
    return response;
  },
  async (error) => {
    // handle refresh logic
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/refresh-token`, {
          withCredentials: true,
        });
        localStorage.setItem("accessToken", res.data.accessToken);
        error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axios(error.config);
      } catch (refreshErr) {
        console.error("Refresh failed", refreshErr);
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // or redirect to login
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
}

function employeePage() {
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



    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchQuery.trim() === "") {
                fetchEmployeeClients();
            } else {
                searchClients(searchQuery);
            }
        }, 300); // debounce 300ms

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const fetchEmployeeClients = async () => {
        try {
            setLoading(true);
            const res = await axios.get
                (`${import.meta.env.VITE_API_URL}/api/service/employee-client`)
            // ("http://localhost:5000/api/service/employee-client");
            setEmployeeClients(res.data || []);
        } catch (err) {
            toast.error("❌ Failed to fetch clients");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchEmployeeClients();
    }, []);


    const handleAddClient = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.post
                (`${import.meta.env.VITE_API_URL}/api/service/add-employee-client`, employeeClient,)
            // ("http://localhost:5000/api/service/add-employee-client", employeeClient);
            setEmployeeClient({ nameemployeeclient: "", email: "", address: "", phoneno: "", title: "", clienttype: "", aboutclient: "" });
            fetchEmployeeClients();
            toast.success("✅ Client added successfully!");
        } catch (err: any) {
            toast.error("❌ " + (err.response?.data?.error || "Something went wrong"));
        }
    };

    const handleEditClick = (client: employeeClient) => {
        setEditingId(client._id!);
        setEditData(client);
    };

    const handleSaveEdit = async (id: string) => {
        try {
            await axios.put
                (`${import.meta.env.VITE_API_URL}/api/service/employee-clients-edit/${id}`, editData)
            // (`http://localhost:5000/api/service/employee-clients-edit/${id}`, editData);
            toast.success("✅ Client updated");
            fetchEmployeeClients();
            handleCancelEdit();
        } catch (err) {
            toast.error("❌ Failed to update client");
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };
    const handleDelete = async (id: string) => {
        try {
            await axios.delete
                (`${import.meta.env.VITE_API_URL}/api/service/employee-clients/${id}`)
            //   (`http://localhost:5000/api/service/employee-clients/${id}`);
            toast.success("🗑️ Client deleted");
            setEmployeeClients((prev) => prev.filter((cl) => cl._id !== id));
        } catch (err) {
            toast.error("❌ Failed to delete client");
        }
    };

    const searchClients = async (query: string) => {
        try {
            const res = await axios.get
                (`${import.meta.env.VITE_API_URL}/api/service/search-employee-client?query=${query}`)
            // (`http://localhost:5000/api/service/search-employee-client?query=${query}`);
            setEmployeeClients(res.data.results || []);
        } catch (err) {
            console.error(err);
            setEmployeeClients([]);
            toast.error("❌ Failed to search clients");
        }
    };

    return (
        <Stack spacing={5} sx={{ maxWidth: 700, margin: "auto", mt: 5 }}>
            {/* Add Client Form */}
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
                                <MenuItem value="">
                                </MenuItem>
                                <MenuItem value="Mr.">Mr.</MenuItem>
                                <MenuItem value="Mrs.">Mrs.</MenuItem>
                                <MenuItem value="Ms.">Ms.</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Client Name"
                            variant="filled"
                            value={employeeClient.nameemployeeclient}
                            onChange={(e) => setEmployeeClient({ ...employeeClient, nameemployeeclient: e.target.value })}
                            fullWidth
                        />
                    </div>

                    <TextField
                        label="Client Phone"
                        variant="filled"
                        value={employeeClient.phoneno}
                        onChange={(e) => setEmployeeClient({ ...employeeClient, phoneno: e.target.value })}
                    />
                    <TextField
                        label="Client Email"
                        variant="filled"
                        value={employeeClient.email}
                        onChange={(e) => setEmployeeClient({ ...employeeClient, email: e.target.value })}
                    />
                    <TextField
                        label="Client Address"
                        variant="filled"
                        value={employeeClient.address}
                        onChange={(e) => setEmployeeClient({ ...employeeClient, address: e.target.value })}
                    />
                    <TextField
                        label="Client Type"
                        variant="filled"
                        value={employeeClient.clienttype}
                        onChange={(e) => setEmployeeClient({ ...employeeClient, clienttype: e.target.value })}
                    />
                    <TextField
                        label="Client Details"
                        variant="filled"
                        value={employeeClient.aboutclient}
                        onChange={(e) => setEmployeeClient({ ...employeeClient, aboutclient: e.target.value })}
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

            {/* Search Input */}
            <TextField
                placeholder="Search client by name or first letter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                variant="outlined"
            />

            {/* Client List */}
            {/* Client List */}
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
                                    // ✅ Full edit box for ALL fields
                                    <Stack spacing={2} sx={{ background: "#f8fafc", p: 2, borderRadius: 2 }}>
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
                                    // ✅ Normal view mode
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <div>
                                            <h3 className="font-bold text-lg">{cl.title} {cl.nameemployeeclient}</h3>
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
    )
}

export default employeePage;
