import { useState, useEffect, type FormEvent } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Stack,
  Card,
  CardContent,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Define the client type
type Client = {
  _id?: string;
  nameclient: string;
  email: string;
  address: string;
  phoneno?: string;
  title?: string;
  details?: string;
};

function Client() {
  const [client, setClient] = useState<Client>({
    nameclient: "",
    email: "",
    address: "",
    phoneno: "",
    title: "",
    details: ""
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Client>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim() === "") {
        fetchClients();
      } else {
        searchClients(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/service/client`);
      setClients(res.data || []);
    } catch (err) {
      toast.error("❌ Failed to fetch clients");
    }
  };

  const handleAddClient = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/service/add-client`, client);
      setClient({
        nameclient: "",
        email: "",
        address: "",
        phoneno: "",
        title: "",
        details: "",
      });
      
      fetchClients();
      toast.success("✅ Client added successfully!");
    } catch (err: any) {
      toast.error("❌ " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  const handleEditClick = (cl: Client) => {
    setEditingId(cl._id || null);
    setEditData({ ...cl });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/service/clients/${id}`, editData);
      setEditingId(null);
      setEditData({});
      fetchClients();
      toast.success("✏️ Client updated successfully!");
    } catch (err) {
      toast.error("❌ Failed to update client");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/service/clients/${id}`);
      fetchClients();
      toast.success("🗑️ Client deleted");
    } catch (err) {
      toast.error("❌ Failed to delete client");
    }
  };

  const searchClients = async (query: string) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/service/search?query=${query}`);
      setClients(res.data.results || []);
    } catch (err) {
      setClients([]);
      toast.error("❌ Failed to search clients");
    }
  };

  return (
    <Stack spacing={5} sx={{ maxWidth: 700, margin: "auto", mt: 5 }}>
      {/* ➕ Add Client Form */}
      <form onSubmit={handleAddClient}>
        <Stack spacing={2}>
          <div className="flex flex-row gap-2">
            <FormControl sx={{ width: 100 }} variant="filled">
              <InputLabel id="client-title-label">Title</InputLabel>
              <Select
                labelId="client-title-label"
                value={client.title}
                onChange={(e) => setClient({ ...client, title: e.target.value })}
              >
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Mrs.">Mrs.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Client Name"
              variant="filled"
              value={client.nameclient}
              onChange={(e) => setClient({ ...client, nameclient: e.target.value })}
              fullWidth
            />
          </div>

          <TextField
            label="Client Phone"
            variant="filled"
            value={client.phoneno}
            onChange={(e) => setClient({ ...client, phoneno: e.target.value })}
          />
          <TextField
            label="Client Email"
            variant="filled"
            value={client.email}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
          />
          <TextField
            label="Client Address"
            variant="filled"
            value={client.address}
            onChange={(e) => setClient({ ...client, address: e.target.value })}
          />
          <TextField
            label="Client Details"
            variant="filled"
            value={client.details}
            onChange={(e) => setClient({ ...client, details: e.target.value })}
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

      {/* 🔍 Search */}
      <TextField
        placeholder="Search client by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        variant="outlined"
      />

      {/* 🧾 Client List */}
      <Stack spacing={2}>
        {clients.length === 0 ? (
          <p className="border border-slate-600 flex justify-center py-3">
            ❌ No Clients found.
          </p>
        ) : (
          clients.map((cl) => (
            <Card key={cl._id}>
              <CardContent>
                {editingId === cl._id ? (
                  // ✏️ Full Edit Mode
                  <Stack spacing={2}>
                    <FormControl variant="filled">
                      <InputLabel id="edit-title-label">Title</InputLabel>
                      <Select
                        labelId="edit-title-label"
                        value={editData.title || ""}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      >
                        <MenuItem value="Mr.">Mr.</MenuItem>
                        <MenuItem value="Mrs.">Mrs.</MenuItem>
                        <MenuItem value="Ms.">Ms.</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      label="Name"
                      variant="filled"
                      value={editData.nameclient || ""}
                      onChange={(e) => setEditData({ ...editData, nameclient: e.target.value })}
                    />
                    <TextField
                      label="Email"
                      variant="filled"
                      type="email"
                      value={editData.email || ""}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                    <TextField
                      label="Phone"
                      variant="filled"
                      value={editData.phoneno || ""}
                      onChange={(e) => setEditData({ ...editData, phoneno: e.target.value })}
                    />
                    <TextField
                      label="Address"
                      variant="filled"
                      value={editData.address || ""}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    />
                    <TextField
                      label="Client Details"
                      variant="filled"
                      multiline
                      minRows={3}
                      value={editData.details || ""}
                      onChange={(e) => setEditData({ ...editData, details: e.target.value })}
                    />

                    <Stack direction="row" spacing={2}>
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
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  // 📋 Display Mode
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <div>
                      <h3 className="font-bold">
                        {cl.title} {cl.nameclient}
                      </h3>
                      <p>Email: {cl.email}</p>
                      <p>Phone no: {cl.phoneno}</p>
                      <p>Address: {cl.address}</p>
                      <p>Client Details: {cl.details}</p>
                      <p className="text-blue-600 font-mono">ID: {cl._id}</p>
                    </div>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="primary" onClick={() => handleEditClick(cl)}>
                        <EditIcon />
                      </IconButton>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(cl._id)}
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

export default Client;
