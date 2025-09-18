import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
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

type Product = {
  _id?: string;
  name: string;
  price: string;
  description: string;
  specification: string;
  quantitiy: string;
};

export default function Product() {
  const [product, setProduct] = useState<Product>({
    name: "",
    price: "",
    description: "",
    specification: "",
    quantitiy: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        // `${import.meta.env.VITE_API_URL}/api/service/products`,
        "http://localhost:5000/api/service/products"
      );
      console.log("Fetched products:", res.data);
      setProducts(res.data);
    } catch (error) {
      console.error("❌ Product unable to fetch", error);
    }
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        // `${import.meta.env.VITE_API_URL}/api/service/add-product`,
        "http://localhost:5000/api/service/add-product",
         product);
      setProduct({ name: "", price: "", description: "", specification: "", quantitiy: "" });
      fetchProducts();
      toast.success("✅ Product added");
    } catch (error: any) {
      toast.error("❌ " + (error.response?.data?.error || "Something went wrong"));
    }
  };

  const handleEditClick = (p: Product) => {
    setEditingId(p._id || null);
    setEditData({ name: p.name, price: p.price, description: p.description });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await axios.put(
        // `${import.meta.env.VITE_API_URL}/api/service/products/${id}`,
        `http://localhost:5000/api/service/products/${id}`,
         editData);
      setEditingId(null);
      setEditData({});
      fetchProducts();
      toast.success("✅ Service updated successfully!");
    } catch (err: any) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      toast.error("Failed to update service");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(
        // `${import.meta.env.VITE_API_URL}/api/service/products/${id}`,
        `http://localhost:5000/api/service/products/${id}`
      );
      fetchProducts();
      toast.success("🗑️ Service deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service");
    }
  };

  return (
    <Stack spacing={5} sx={{ maxWidth: 700, margin: "auto", mt: 5 }}>
      {/* Add Service */}
      <Card>
        <h1 className="text-3xl flex justify-center font-bold font7">➕ Products</h1>
        <CardContent>
          <form onSubmit={handleAddProduct}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                variant="filled"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth variant="filled">
                <InputLabel htmlFor="filled-adornment-amount">Price</InputLabel>
                <FilledInput
                  id="filled-adornment-amount"
                  startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                />
              </FormControl>
              <TextField
                label="Description"
                variant="filled"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                fullWidth
              />
               <TextField
                label="Specification"
                variant="filled"
                value={product.specification}
                onChange={(e) => setProduct({ ...product, specification: e.target.value })}
                fullWidth
              />
               <TextField
                label="Quantity"
                variant="filled"
                value={product.quantitiy}
                onChange={(e) => setProduct({ ...product, quantitiy: e.target.value })}
                fullWidth
              />
              
             
              <Button type="submit" variant="contained" color="success">
                Add Products
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Services List */}
      <Stack spacing={2}>
        {products.length === 0 && <p className="border border-slate-600 flex justify-center py-3 ">❌ No products added yet.</p>}
        {products.map((s) => (
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
                      <EditIcon />
                    </IconButton>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => handleDelete(s._id)}
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
  )
}


