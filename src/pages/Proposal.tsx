import { useState, useEffect, type FormEvent } from "react";
import axios from "axios";
import {
  Stack,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

type Service = { _id: string; name: string; price: string; description: string };
type Product = { _id: string; name: string; price: string; details: string };
type Employee = { _id: string; name: string; role: string; contact: string };

type Proposal = {
  _id?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  projectDetails: string;
  budget: string;
  services: string[];
  products: string[];
  employees: string[];
};

export default function ProposalPage() {
  const [proposal, setProposal] = useState<Proposal>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientAddress: "",
    projectDetails: "",
    budget: "",
    services: [],
    products: [],
    employees: [],
  });

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchProposals();
    fetchMasterData();
  }, []);

  const fetchProposals = async () => {
    try {
      // const res = await axios.get("http://localhost:5000/api/proposal/proposals");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/proposal/proposals`)
      setProposals(res.data);
    } catch {
      toast.error("❌ Failed to fetch proposals");
    }
  };

  const fetchMasterData = async () => {
    try {
      const [srv, prod, emp] = await Promise.all([
        // axios.get("http://localhost:5000/api/service"),
        // axios.get("http://localhost:5000/api/service/products"),
        // axios.get("http://localhost:5000/api/service/employees"),
        axios.get(`${import.meta.env.VITE_API_URL}/api/service`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/service/products`)
        axios.get(`${import.meta.env.VITE_API_URL}/api/service/employees`)
      ]);
      setServices(srv.data);
      setProducts(prod.data);
      setEmployees(emp.data);
    } catch {
      toast.error("❌ Failed to fetch services/products/employees");
    }
  };

  const handleAddProposal = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !proposal.clientName ||
      !proposal.clientPhone ||
      !proposal.clientEmail ||
      !proposal.clientAddress ||
      !proposal.projectDetails ||
      !proposal.budget
    ) {
      toast.error("❌ Please fill all required client and project fields");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/proposal/add-proposal`, proposal);
        // "http://localhost:5000/api/proposal/add-proposal", proposal);
      setProposal({
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        clientAddress: "",
        projectDetails: "",
        budget: "",
        services: [],
        products: [],
        employees: [],
      });
      fetchProposals();
      toast.success("✅ Proposal added");
    } catch (err: any) {
      toast.error("❌ " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/proposal/proposals/${id}`);
        // `http://localhost:5000/api/proposal/proposals/${id}`);
      fetchProposals();
      toast.success("🗑️ Proposal deleted");
    } catch {
      toast.error("❌ Failed to delete proposal");
    }
  };

  const handleDownloadPdf = async (id?: string) => {
    if (!id) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/proposal/proposals/${id}/pdf`,
        // `http://localhost:5000/api/proposal/proposals/${id}/pdf`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `proposal_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("✅ PDF downloaded");
    } catch {
      toast.error("❌ Failed to download PDF");
    }
  };

  return (
    <Stack spacing={5} sx={{ maxWidth: 900, margin: "auto", mt: 5 }}>
      {/* Add Proposal Form */}
      <Card>
        <h1 className="text-3xl flex justify-center font-bold">📑 Add Proposal</h1>
        <CardContent>
          <form onSubmit={handleAddProposal}>
            <Stack spacing={2}>
              <TextField
                label="Client Name"
                variant="filled"
                value={proposal.clientName}
                onChange={(e) => setProposal({ ...proposal, clientName: e.target.value })}
                fullWidth
              />
              <div className="flex flex-row gap-4">

              <TextField
                label="Client Phone"
                variant="filled"
                value={proposal.clientPhone}
                onChange={(e) => setProposal({ ...proposal, clientPhone: e.target.value })}
              />
              <TextField
                label="Client Email"
                variant="filled"
                value={proposal.clientEmail}
                onChange={(e) => setProposal({ ...proposal, clientEmail: e.target.value })}
              />
                 <TextField
                label="Budget (₹)"
                variant="filled"
                value={proposal.budget}
                onChange={(e) => setProposal({ ...proposal, budget: e.target.value })}
              />
              </div>
              <TextField
                label="Client Address"
                variant="filled"
                value={proposal.clientAddress}
                onChange={(e) => setProposal({ ...proposal, clientAddress: e.target.value })}
                fullWidth
              />
              <TextField
                label="Project Details"
                variant="filled"
                multiline
                rows={3}
                value={proposal.projectDetails}
                onChange={(e) => setProposal({ ...proposal, projectDetails: e.target.value })}
                fullWidth
              />
           

              {/* Services Multi-Select */}
              <FormControl fullWidth>
                <InputLabel>Services</InputLabel>
                <Select
                  multiple
                  value={proposal.services}
                  onChange={(e) =>
                    setProposal({ ...proposal, services: e.target.value as string[] })
                  }
                  renderValue={(selected) => (
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {(selected as string[]).map((id) => {
                        const s = services.find((srv) => srv._id === id);
                        return <Chip key={id} label={s?.name || id} />;
                      })}
                    </Stack>
                  )}
                >
                  {services.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.name} — ₹{s.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Products Multi-Select */}
              <FormControl fullWidth>
                <InputLabel>Products</InputLabel>
                <Select
                  multiple
                  value={proposal.products}
                  onChange={(e) =>
                    setProposal({ ...proposal, products: e.target.value as string[] })
                  }
                  renderValue={(selected) => (
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {(selected as string[]).map((id) => {
                        const p = products.find((pr) => pr._id === id);
                        return <Chip key={id} label={p?.name || id} />;
                      })}
                    </Stack>
                  )}
                >
                  {products.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.name} — ₹{p.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Employees Multi-Select */}
              <FormControl fullWidth>
                <InputLabel>Employees</InputLabel>
                <Select
                  multiple
                  value={proposal.employees}
                  onChange={(e) =>
                    setProposal({ ...proposal, employees: e.target.value as string[] })
                  }
                  renderValue={(selected) => (
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {(selected as string[]).map((id) => {
                        const emp = employees.find((em) => em._id === id);
                        return <Chip key={id} label={emp?.name || id} />;
                      })}
                    </Stack>
                  )}
                >
                  {employees.map((em) => (
                    <MenuItem key={em._id} value={em._id}>
                      {em.name} — {em.role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button type="submit" variant="contained" color="success">
                Add Proposal
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Proposal List */}
      <Stack spacing={2}>
        {proposals.length === 0 && (
          <p className="border border-slate-600 flex justify-center py-3">
            ❌ No proposals added yet.
          </p>
        )}
        {proposals.map((p) => (
          <Card key={p._id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <div>
                  <h3 className="font-bold">{p.clientName}</h3>
                  <p>{p.clientPhone} | {p.clientEmail}</p>
                  <p>{p.clientAddress}</p>
                  <p className="text-gray-600">{p.projectDetails}</p>
                  <span className="font-semibold text-blue-700">₹ {p.budget}</span>
                  {p.services.length > 0 && (
                    <p className="text-sm text-gray-500">{p.services.length} Services selected</p>
                  )}
                  {p.products.length > 0 && (
                    <p className="text-sm text-gray-500">{p.products.length} Products selected</p>
                  )}
                  {p.employees.length > 0 && (
                    <p className="text-sm text-gray-500">{p.employees.length} Employees selected</p>
                  )}
                </div>
                <Stack direction="row" spacing={1}>
                  <IconButton color="primary" onClick={() => handleDownloadPdf(p._id)}>
                    <PictureAsPdfIcon />
                  </IconButton>
                  <Button color="error" variant="contained" onClick={() => handleDelete(p._id)}>
                    <DeleteIcon />
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

