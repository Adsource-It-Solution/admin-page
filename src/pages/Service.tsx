import { useState, useEffect } from "react";
import type { FormEvent} from "react"
import axios from "axios";
import {
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";

type Service = {
  _id?: string;
  name: string;
  price: string;
  description: string;
};

export default function ServiceManager() {
  const [service, setService] = useState<Service>({
    name: "",
    price: "",
    description: "",
  });
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Service>>({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // const res = await axios.get("http://localhost:5000/api/service");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/service`);
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const handleAddService = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // await axios.post("http://localhost:5000/api/service", service);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/service`, service)
      setService({ name: "", price: "", description: "" });
      fetchServices();
      // alert("✅ Service added!");
      toast.success("✅ Service added!")
    } catch (err: any) {
      alert("❌ " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  const handleEditClick = (s: Service) => {
    setEditingId(s._id || null);
    setEditData({ name: s.name, price: s.price, description: s.description });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async (id: string) => {
    try {
      // await axios.put(`http://localhost:5000/api/service/${id}`, editData);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/service/${id}`, editData)
      setEditingId(null);
      setEditData({});
      fetchServices();
      // alert("✅ Service updated successfully!");
      toast.success("✅ Service updated successfully!")
    } catch (err: any) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      alert("Failed to update service");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      // await axios.delete(`http://localhost:5000/api/service/${id}`);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/service/${id}`)
      fetchServices();
      // alert("Service deleted!");
      toast.success("Service deleted!")
    } catch (err) {
      console.error(err);
      alert("Failed to delete service");
    }
  };

  return (
    <Stack spacing={5} sx={{ maxWidth: 700, margin: "auto", mt: 5 }}>
      {/* Add Service */}
      <Card>
      <h1 className="text-3xl flex justify-center font-bold font7">➕ Services</h1>
        <CardContent>
          <form onSubmit={handleAddService}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                variant="filled"
                value={service.name}
                onChange={(e) => setService({ ...service, name: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth variant="filled">
                <InputLabel htmlFor="filled-adornment-amount">Price</InputLabel>
                <FilledInput
                  id="filled-adornment-amount"
                  startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                  value={service.price}
                  onChange={(e) => setService({ ...service, price: e.target.value })}
                />
              </FormControl>
              <TextField
                label="Description"
                variant="filled"
                value={service.description}
                onChange={(e) => setService({ ...service, description: e.target.value })}
                fullWidth
              />
              <Button type="submit" variant="contained" color="success">
                Add Service
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Services List */}
      <Stack spacing={2}>
        {services.length === 0 && <p className="border border-slate-600 flex justify-center py-3 ">No services added yet.</p>}
        {services.map((s) => (
          <Card key={s._id}>
            <CardContent>
              {editingId === s._id ? (
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    variant="filled"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Price</InputLabel>
                    <FilledInput
                      startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    />
                  </FormControl>
                  <TextField
                    label="Description"
                    variant="filled"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    fullWidth
                  />
                  <Stack direction="row" spacing={2}>
                    <Button
                      startIcon={<SaveIcon />}
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveEdit(s._id!)}
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
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <div>
                    <h3 className="font-bold">{s.name}</h3>
                    <p className="text-gray-600">{s.description}</p>
                    <span className="font-semibold text-blue-700">₹ {s.price}</span>
                  </div>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => handleEditClick(s)}>
                     <EditIcon/>
                    </IconButton>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => handleDelete(s._id)}
                    >
                      <DeleteIcon/>
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
