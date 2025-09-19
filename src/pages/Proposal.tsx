import { useState, useEffect, useRef, type FormEvent } from "react";
import html2canvas from "html2canvas";
import axios from "axios";
import {
  Stack,
  Card,
  CardContent,
  TextField,
  TextareaAutosize,
  Button,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Box,
  Collapse,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { toWords } from 'number-to-words';
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { CircularProgress } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UploadIcon from "@mui/icons-material/Upload";
import ClearIcon from '@mui/icons-material/Clear';



interface Service {
  _id: string;
  name: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}
type Employee = { _id: string; name: string; role: string; contact: string };

type Proposal = {
  _id?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  // projectDetails: string;
  customerType: string;
  projectsize: string;
  consumption: string;
  electricity: string;
  generation: string;
  Wattpeak: string;
  proposalWattpeak: string;
  warranty: string;
  Invertorwarranty: string;
  InvertorSize: string;
  performancewarranty: string;
  quantity: string;
  invertorquantitiy: string;
  invertortype: string;
  proposalStructure: string;
  structureDes: string;
  systemwarranty: string;
  balanceOfSystem: string;
  ourScope: string;
  customerScope: string;
  stage1: string;
  stage2: string;
  stage3: string;
  stage4: string;
  yearlyconsumption: string;
  yearlysolargeneration: string;
  decrementgeneration: string;
  plotgraph: string;
  priceincrement: string;
  directionType: string;
  // graphType: string;
  services: string[];
  products: string[];
  employees: string[];

  // Index signature for dynamically accessed fields
  [key: string]: string | string[] | undefined;  // Allow 'undefined' for dynamically added properties
};


type CustomerType = "Industrial" | "Commercial" | "Government" | "Residential" | "others";
type PanelType = "Mono" | "Mono-Perv" | "Poly" | "BIVP" | "Mono-Prev Half Cut" | "Mono BiFacial" | "TopCon MonoFacial" | "TopCon BiFacial";
type InvertorSize = "5KW- 3P" | "6KW- 3P" | "8KW- 3P" | "10KW- 3P" | "12KW- 3P" | "15KW- 3P" | "20KW- 3P" | "25KW- 3P" | "30KW- 3P" | "50KW- 3P" | "100KW- 3P";
type InvertorPhase = "Single Phase" | "Three Phase";
type Invertortype = "String Invertor" | "Micro Invertor";
type ProposalStructure = "Elevated" | "Standard" | "Metal Shed";
type StrucrtureDes = "Hot Dip Galvanised" | "Pre Galvanised" | "Slotted Channel" | "Ms Channel & Gi Channel"
// type  GraphType= "Mono" | "Mono-Perv" | "Poly" | "BIVP" | "Mono-Prev Half Cut" | "Mono BiFacial" | "TopCon MonoFacial" | "TopCon BiFacial";
type DirectionType = "Left to Right" | "Right to left";
type RowType = {
  description: string;
  price: number;
  quantity: number;
  note: string;
};
interface GraphDatum {
  month: string;
  increment: number;
  decrement: number;
}

export default function ProposalPage() {
  const [proposal, setProposal] = useState<Proposal>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientAddress: "",
    // projectDetails: "",
    customerType: "",
    projectsize: "",
    consumption: "",
    electricity: "",
    generation: "",
    Wattpeak: "",
    proposalWattpeak: "",
    warranty: "",
    Invertorwarranty: "",
    InvertorSize: "",
    performancewarranty: "",
    quantity: "",
    invertorquantitiy: "",
    invertortype: "",
    proposalStructure: "",
    structureDes: "",
    systemwarranty: "",
    stage1: "",
    stage2: "",
    stage3: "",
    stage4: "",
    yearlyconsumption: "",
    yearlysolargeneration: "",
    priceunitelectricity: "",
    decrementgeneration: "",
    plotgraph: "",
    priceincrement: "",
    directionType: "",
    // graphType: "",
    services: [],
    products: [],
    employees: [],
    balanceOfSystem: `Net & Solar Meter: Genus / Secure
    DC Cables & Conduits: Reputed Make
    AC Cables: Reputed Make
    DCDB: Reputed Make
    ACDB: Reputed Make
    Termination Accessories: Reputed Make
    Earthing (Pits, Strips and Cables): Reputed Make - 3 Nos.
    Lightning Arrestor: Reputed Make - 1 Nos.`,

    ourScope: `1. Preparation of Engineering Drawing, Design for Solar structure and solar power plant as per Relevant IS standard.
    2. Supply of Solar Modules, Inverter, Structure, Cables, and balance of Plant.
    3. Installation of structure, solar modules, inverter, AC-DC cable, LT panel etc for solar power plant. 
    4. Installation of monitoring and controlling system for solar plant .
    5. Commissioning of Solar Power Plant and supply of Power to LT panel of SGD.
    6. Zero Export Device installation.`,

    customerScope: `1. Providing safe storage place for material during installation & commissioning period.
    2. Provide space to evacuate the solar power.
    3. Design/Drawing approval within 7 days.`,

  });

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [, setServices] = useState<Service[]>([]);
  const [, setProducts] = useState<Product[]>([]);
  const [loadingPdf, setLoadingPdf] = useState<string | null>(null);

  // State for editing proposal and employee details
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Employee>>({});

  // Customer and proposal-related states
  // const [customerType, setCustomerType] = useState<CustomerType>();
  const [openPanel, setOpenPanel] = useState(false);
  const [openInvertor, setOpenInvertor] = useState(false);
  const [openProposal, setOpenPropsal] = useState(false);

  // Panel, invertor, and proposal structure states
  // const [paneltype, setPanelType] = useState<PanelType | "">("");
  // const [invertorSize, setInverotorSize] = useState<InvertorSize | "">("");
  // const [proposalStructure, setProposalStructure] = useState<ProposalStructure | "">("");
  // const [invertortype, setInvertortype] = useState<Invertortype | "">("");
  // const [invertorPhase, setInvertorPhase] = useState<InvertorPhase | "">("");

  // Invertor and cable brands
  const [invertorBrands, setInvertorBrands] = useState<string[]>([]);
  const [brands, setBrands] = useState<{ name: string; logo?: string }[]>([
    { name: "Luminous", logo: "/office.svg" },
    { name: "Tata Power Solar", logo: "/office.svg" },
    { name: "Microtek", logo: "/office.svg" },
    { name: "Su-Kam", logo: "/office.svg" },
    { name: "Delta", logo: "/office.svg" },
    { name: "ABB", logo: "/office.svg" },
    { name: "Schneider Electric", logo: "/office.svg" },
    { name: "Huawei", logo: "/office.svg" }
  ]);

  // Cable brands
  const [cableBrandList, setCableBrandList] = useState<string[]>([
    "Polycab", "Havells", "Finolex", "KEI", "RR Kabel", "Syska", "V-Guard", "Anchor"
  ]);
  const [cableBrands, setCableBrands] = useState<string[]>([]);

  // Dialog and other UI related states
  const [openDialog, setOpenDialog] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newLogo, setNewLogo] = useState<string | null>(null);
  const [openGraph, setOpenGraph] = useState(false);
  // const [graphType, setGraphType] = useState<GraphType | "">("");
  // const [directionType, setDirectionType] = useState<DirectionType | "">("");

  // Structure description
  // const [structureDes, setStructureDes] = useState<string>("");
  const [newCable, setNewCable] = useState<string>(" ");
  const [openCableDialog, setOpenCableDialog] = useState(false);

  const [graphData, setGraphData] = useState<GraphDatum[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const yearlyConsumption = parseFloat(proposal.yearlyconsumption || "0");
    const yearlyGeneration = parseFloat(proposal.yearlysolargeneration || "0");
    const priceIncrement = parseFloat(proposal.priceincrement || "0");
    const generationDecrement = parseFloat(proposal.decrementgeneration || "0");
    const yearsToPlot = parseInt(proposal.plotgraph || "0", 10);

    const newData: { month: string; increment: number; decrement: number }[] = [];

    for (let year = 1; year <= yearsToPlot; year++) {
      const adjustedGeneration =
        yearlyGeneration *
        Math.pow(1 - generationDecrement / 100, year - 1);

      const adjustedPrice =
        yearlyConsumption *
        Math.pow(1 + priceIncrement / 100, year - 1);

      newData.push({
        month: `${year}`,
        increment: adjustedPrice,
        decrement: adjustedGeneration
      });
    }

    // 🔹 reverse if direction is "Right to Left"
    const finalData =
      proposal.directionType === "Right to Left" ? [...newData].reverse() : newData;

    setGraphData(finalData);
  }, [
    proposal.yearlyconsumption,
    proposal.yearlysolargeneration,
    proposal.priceincrement,
    proposal.decrementgeneration,
    proposal.plotgraph,
    proposal.directionType
  ]);

  const handleSaveImage = async () => {
    if (!chartRef.current) return;

    // Take screenshot
    const canvas = await html2canvas(chartRef.current, {
      scale: 2
    });
    const dataUrl = canvas.toDataURL("image/png");

    await fetch(
      // "http://localhost:5000/upload/uploadGraph"
      `${import.meta.env.VITE_API_URL}/upload/uploadGraph`
      , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl })
      });
  };


  // Function to fetch master data (services, products, employees)
  const fetchMasterData = async () => {
    try {
      const [srv, prod] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/service`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/service/products`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/service/employees`)
      ]);
      // const [srv, prod] = await Promise.all([
      //   axios.get(`http://localhost:5000/api/service`),
      //   axios.get(`http://localhost:5000/api/service/products`),
      //   axios.get(`http://localhost:5000/api/service/employees`)
      // ]);
      setServices(srv.data);
      setProducts(prod.data);
    } catch (error) {
      toast.error("❌ Failed to fetch services/products/employees");
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchMasterData();
  }, []);

  const [rows, setRows] = useState<RowType[]>([
    { description: "", price: 0, quantity: 0, note: "" },
  ]);
  const [gst, setGst] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleRowChange = <K extends keyof RowType>(
    index: number,
    field: K,
    value: RowType[K]
  ) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleAddRow = () => {
    setRows([...rows, { description: "", price: 0, quantity: 0, note: "" }]);
  };

  const handleDeleteRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };


  // Calculate subtotal, GST, and total
  useEffect(() => {
    const newSubtotal = rows.reduce((acc, row) => acc + row.price * row.quantity, 0);
    setSubtotal(newSubtotal);
    const newGstAmount = (newSubtotal * gst) / 100;
    setGstAmount(newGstAmount);
    setTotal(newSubtotal + newGstAmount);
  }, [rows, gst]);

  // Function to convert number to words (can be customized as needed)
  const numberToWords = (num: number) => {
    let words = toWords(num);
    return words.replace(/(^|\s)([a-z])/g, (match: any) => match.toUpperCase()) + " Rupees";
  };

  // Fetch proposals along with master data
  useEffect(() => {
    fetchProposals();
    fetchMasterData();
  }, []);

  const handleCapture = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current);
    const dataUrl = canvas.toDataURL("image/png");

    // Send to backend
    await fetch(
      // "http://localhost:5000/api/upload-table-image",
      `${import.meta.env.VITE_API_URL}/api/upload-table-image`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

    alert("Table image sent!");
  };

  const fetchProposals = async () => {
    try {
      // const res = await axios.get("http://localhost:5000/api/proposal/proposals");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/proposal/proposals`);
      setProposals(res.data);
    } catch {
      toast.error("❌ Failed to fetch proposals");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/proposal/${id}`);
        // `http://localhost:5000/api/proposal/${id}`);
      fetchProposals();
      toast.success("🗑️ Proposal deleted");
    } catch {
      toast.error("❌ Failed to delete proposal");
    }
  };

  const handleAddOrUpdateProposal = async (e: FormEvent) => {
    e.preventDefault();
  
    // 1️⃣ Capture chart image if present
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const dataUrl = canvas.toDataURL("image/png");
      // store base64 into the proposal state before validation
      setProposal(prev => ({ ...prev, plotgraph: dataUrl }));
    }
  
    // Small delay to ensure state update above is committed
    await new Promise(r => setTimeout(r, 0));
  
    // 2️⃣ Required fields check
    const requiredFields = [
      "clientName",
      "clientPhone",
      "clientEmail",
      "clientAddress",
      "customerType",
      "projectsize",
      "consumption",
      "electricity",
      "generation",
      "warranty",
      "proposalWattpeak",
      "Invertorwarranty",
      "performancewarranty",
      "quantity",
      "InvertorSize",
      "invertorquantitiy",
      "proposalStructure",
      "structureDes",
      "systemwarranty",
      "stage1",
      "stage2",
      "stage3",
      "stage4",
      "yearlyconsumption",
      "yearlysolargeneration",
      "decrementgeneration",
      "plotgraph",
      "directionType",
      "priceincrement",
    ];
  
    console.log("Current proposal:", proposal);
  
    const missingFields = requiredFields.filter(field => !proposal[field]);
    if (missingFields.length > 0) {
      console.error("❌ Missing fields:", missingFields);
      toast.error(`❌ Please fill all required client and project fields: ${missingFields.join(", ")}`);
      return;
    }
  
    // 3️⃣ Send to backend
    try {
      if (editingId) {
        // Update existing proposal
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/proposal/${editingId}`,
          proposal
        );
        toast.success("✅ Proposal updated");
      } else {
        // Add new proposal
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/proposal/add-proposal`,
          proposal
        );
        toast.success("✅ Proposal added");
      }
  
      // 4️⃣ Reset state
      setProposal({
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        clientAddress: "",
        customerType: "",
        projectsize: "",
        consumption: "",
        electricity: "",
        generation: "",
        Wattpeak: "",
        proposalWattpeak: "",
        warranty: "",
        performancewarranty: "",
        Invertorwarranty: "",
        InvertorSize: "",
        quantity: "",
        invertorquantitiy: "",
        invertortype: "",
        proposalStructure: "",
        structureDes: "",
        systemwarranty: "",
        stage1: "",
        stage2: "",
        stage3: "",
        stage4: "",
        yearlyconsumption: "",
        yearlysolargeneration: "",
        decrementgeneration: "",
        plotgraph: "",
        directionType: "",
        priceincrement: "",
        services: [],
        products: [],
        employees: [],
        balanceOfSystem: `Net & Solar Meter: Genus / Secure
  DC Cables & Conduits: Reputed Make
  AC Cables: Reputed Make
  DCDB: Reputed Make
  ACDB: Reputed Make
  Termination Accessories: Reputed Make
  Earthing (Pits, Strips and Cables): Reputed Make - 3 Nos.
  Lightning Arrestor: Reputed Make - 1 Nos.`,
        ourScope: `1. Preparation of Engineering Drawing, Design for Solar structure and solar power plant as per Relevant IS standard.
  2. Supply of Solar Modules, Inverter, Structure, Cables, and balance of Plant.
  3. Installation of structure, solar modules, inverter, AC-DC cable, LT panel etc for solar power plant. 
  4. Installation of monitoring and controlling system for solar plant .
  5. Commissioning of Solar Power Plant and supply of Power to LT panel of SGD.
  6. Zero Export Device installation.`,
        customerScope: `1. Providing safe storage place for material during installation & commissioning period.
  2. Provide space to evacuate the solar power.
  3. Design/Drawing approval within 7 days.`,
      });
      setEditingId(null);
  
      // Refresh proposal list
      fetchProposals();
    } catch (err: any) {
      toast.error("❌ " + (err.response?.data?.error || "Something went wrong"));
    }
  };
  



  const handleEditClick = (p: Proposal) => {
    setEditData(editData);
    setProposal(p);
    setEditingId(p._id || null);
  };

  const handleDownloadPdf = async (id?: string) => {
    if (!id) return;
    try {
      setLoadingPdf(id);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/proposal/${id}/pdf`,
        // `http://localhost:5000/api/proposal/${id}/pdf`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Open in new tab (optional)
      const newWindow = window.open(url, "_blank");
      if (!newWindow) {
        // Fallback: force download
        const link = document.createElement("a");
        link.href = url;
        link.download = `proposal_${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      // Delay revoking URL to allow download
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      toast.success("✅ PDF ready");
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("❌ Failed to download PDF");
    } finally {
      setLoadingPdf(null);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLogo(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddBrand = () => {
    if (newBrand.trim() && !brands.some((b) => b.name === newBrand)) {
      setBrands([...brands, { name: newBrand, logo: newLogo || undefined }]);
      setInvertorBrands((prev) => [...prev, newBrand]); // auto-select
    }
    setNewBrand("");
    setNewLogo(null);
    setOpenDialog(false);
  };
  const handleDeleteBrand = (brandName: string) => {
    setBrands(brands.filter((b) => b.name !== brandName));
    setInvertorBrands(invertorBrands.filter((b) => b !== brandName));
  };

  const handleDeleteCableBrand = (brandToDelete: string) => {
    setCableBrands((prev) => prev.filter((b) => b !== brandToDelete));
  };
  const handleAddCable = () => {
    if (newCable.trim() && !cableBrandList.includes(newCable)) {
      setCableBrandList((prev) => [...prev, newCable]);
      setCableBrands((prev) => [...prev, newCable]);
    }
    setNewCable("");
    setOpenCableDialog(false);
  };



  return (
    <Stack spacing={5} sx={{ maxWidth: 900, margin: "auto", mt: 5 }}>
      {/* Add Proposal Form */}
      <Card>
        <h1 className="text-3xl flex justify-center font-bold">📑 Add Proposal</h1>
        <CardContent>
          <form onSubmit={handleAddOrUpdateProposal}>
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
                  placeholder="0987654321"
                  variant="filled"
                  value={proposal.clientPhone}
                  onChange={(e) => setProposal({ ...proposal, clientPhone: e.target.value })}
                />
                <TextField
                  label="Client Email"
                  placeholder="coustome@gail.com"
                  variant="filled"
                  value={proposal.clientEmail}
                  onChange={(e) => setProposal({ ...proposal, clientEmail: e.target.value })}
                />
                <FormControl fullWidth variant="filled">
                  <InputLabel id="customer-type-label">Customer Type</InputLabel>
                  <Select
                    labelId="customer-type-label"
                    value={proposal.customerType}
                    onChange={(e) =>
                      setProposal({ ...proposal, customerType: e.target.value as CustomerType })
                    }
                  >
                    <MenuItem value="Residential">Residential</MenuItem>
                    <MenuItem value="Commercial">Commercial</MenuItem>
                    <MenuItem value="Government">Government</MenuItem>
                    <MenuItem value="Industrial">Industrial</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>

              </div>
              <div className="flex flex-row gap-4">

                <TextField
                  label="Client Address"
                  variant="filled"
                  value={proposal.clientAddress}
                  onChange={(e) => setProposal({ ...proposal, clientAddress: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Project Size"
                  placeholder="e.g: 5"
                  variant="filled"
                  value={proposal.projectsize}
                  onChange={(e) => setProposal({ ...proposal, projectsize: e.target.value })}
                  fullWidth
                />
              </div>
              <div className="flex flex-col gap-4">
                <TextField
                  label="Yearly consumption (Units)"
                  placeholder="e.g: 2400 KWh"
                  variant="filled"
                  value={proposal.consumption}
                  onChange={(e) => setProposal({ ...proposal, consumption: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Yearly generation of 1KWh"
                  placeholder="e.g: 1400 KWh"
                  variant="filled"
                  value={proposal.generation}
                  onChange={(e) => setProposal({ ...proposal, generation: e.target.value })}
                  fullWidth
                />
              </div>
              <TextField
                label="Price per unit of electricity"
                placeholder="e.g: 2 "
                variant="filled"
                value={proposal.electricity}
                onChange={(e) => setProposal({ ...proposal, electricity: e.target.value })}
                fullWidth
              />
              {/* panel details  */}
              <Stack spacing={2}>
                {/* Button to toggle panel section */}
                <button
                  type="button"
                  className="rounded-2xl p-5 bg-blue-200"
                  onClick={() => setOpenPanel(!openPanel)}
                >
                  <div className="flex text-right justify-between">
                    <span className="font-semibold text-lg">
                      🔆 Panel Details
                    </span>
                    <span className="bg-blue-600 p-2 rounded-full">
                      {openPanel ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    </span>
                  </div>
                </button>

                {/* Collapsible Panel Section */}
                <Collapse in={openPanel}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      p: 2,
                      bgcolor: "#f9f9f9",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      🔆 Panel Details
                    </Typography>

                    <Stack spacing={2}>
                      <TextField
                        label="Watt Peak (WP)"
                        placeholder="e.g: 590"
                        variant="filled"
                        value={proposal.Wattpeak || ""}
                        onChange={(e) =>
                          setProposal({ ...proposal, Wattpeak: e.target.value })
                        }
                        fullWidth
                      />

                      <FormControl fullWidth variant="filled">
                        <InputLabel id="panel-type-label">Panel Type</InputLabel>
                        <Select
                          labelId="panel-type-label"
                          value={proposal.paneltype || ""}  // add this field to Proposal interface if missing
                          onChange={(e) =>
                            setProposal({ ...proposal, paneltype: e.target.value as PanelType })
                          }
                        >
                          <MenuItem value="Mono">Mono</MenuItem>
                          <MenuItem value="Mono-Perv">Mono-Perv</MenuItem>
                          <MenuItem value="Poly">Poly</MenuItem>
                          <MenuItem value="BIVP">BIVP</MenuItem>
                          <MenuItem value="Mono-Prev Half Cut">Mono-Prev Half Cut</MenuItem>
                          <MenuItem value="Mono BiFacial">Mono BiFacial</MenuItem>
                          <MenuItem value="TopCon MonoFacial">TopCon MonoFacial</MenuItem>
                          <MenuItem value="TopCon BiFacial">TopCon BiFacial</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Panel Warranty in years"
                        placeholder="e.g: 12"
                        variant="filled"
                        value={proposal.warranty || ""}
                        onChange={(e) =>
                          setProposal({ ...proposal, warranty: e.target.value })
                        }
                        fullWidth
                      />

                      <TextField
                        label="Panel Performance Warranty"
                        placeholder="e.g: 20"
                        variant="filled"
                        value={proposal.performancewarranty || ""}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            performancewarranty: e.target.value,
                          })
                        }
                        fullWidth
                      />

                      <TextField
                        label="Panel Quantity (Nos)"
                        placeholder="e.g: 12"
                        variant="filled"
                        value={proposal.quantity || ""}
                        onChange={(e) =>
                          setProposal({ ...proposal, quantity: e.target.value })
                        }
                        fullWidth
                      />
                    </Stack>
                  </Box>
                </Collapse>
              </Stack>

              {/* invertor details  */}
              <Stack spacing={2}>
                {/* Button to toggle invertor section */}
                <button
                  type="button"
                  className="rounded-2xl p-5 bg-blue-200"
                  onClick={() => setOpenInvertor(!openInvertor)}
                >
                  <div className="flex text-right justify-between">
                    <span className="font-semibold text-lg">
                      Invertor Details
                    </span>
                    <span className="bg-blue-600 p-2 rounded-full">
                      {openInvertor ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    </span>
                  </div>
                </button>

                {/* Collapsible Inverotr Section */}
                <Collapse in={openInvertor}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      p: 2,
                      bgcolor: "#f9f9f9",
                    }}
                  >
                    <Stack spacing={2}>
                      {/* Multi Select */}
                      {/* ✅ Inverter Brands (multiple select) */}
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="invertor-brand-label">Select Inverter Brands</InputLabel>
                        <Select
                          labelId="invertor-brand-label"
                          multiple
                          value={proposal.invertorBrands || []}
                          onChange={(e) =>
                            setProposal({ ...proposal, invertorBrands: e.target.value as string[] })
                          }
                          renderValue={(selected) => (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {(selected as string[]).map((value) => {
                                const brand = brands.find((b) => b.name === value);
                                return (
                                  <Chip
                                    key={value}
                                    label={value}
                                    avatar={brand?.logo ? <Avatar src={brand.logo} /> : undefined}
                                  />
                                );
                              })}
                            </Stack>
                          )}
                        >
                          {brands.map((brand, index) => (
                            <MenuItem key={index} value={brand.name}>
                              {brand.logo && (
                                <Avatar
                                  src={brand.logo}
                                  alt={brand.name}
                                  sx={{ width: 24, height: 24, marginRight: 1 }}
                                />
                              )}
                              {brand.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Button to open dialog */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(true)}
                        sx={{
                          mt: 2,
                          width: "auto",
                          alignSelf: "flex-start",
                        }}
                      >
                        ➕ Add Inverter Brand
                      </Button>

                      {/* Show selected brands in separate box */}
                      <Box sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
                        <h3>Selected Brands:</h3>
                        <Stack direction="column" spacing={2}>
                          {invertorBrands.map((brandName) => {
                            const brand = brands.find((b) => b.name === brandName);
                            return (
                              <Stack
                                key={brandName}
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={2}
                                sx={{
                                  p: 1.5,
                                  border: "1px solid #ddd",
                                  borderRadius: 2,
                                  bgcolor: "#fafafa",
                                }}
                              >
                                {/* Left side: logo + name */}
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Avatar src={brand?.logo} alt={brandName} variant="square" sx={{ width: 100, height: 40, borderRadius: 1 }} />
                                  <span style={{ fontWeight: 500 }}>{brandName}</span>
                                </Stack>
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteBrand(brandName)}
                                >
                                  <ClearIcon />
                                </IconButton>

                              </Stack>
                            );
                          })}
                        </Stack>
                      </Box>

                      {/* Dialog for adding new brand */}
                      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Add Inverter Brand</DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Brand Name"
                            fullWidth
                            value={newBrand}
                            onChange={(e) => setNewBrand(e.target.value)}
                          />
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                            <input
                              accept="image/*"
                              id="upload-logo"
                              type="file"
                              style={{ display: "none" }}
                              onChange={handleLogoUpload}
                            />
                            <label htmlFor="upload-logo">
                              <Button
                                variant="contained"
                                component="span"
                                startIcon={<UploadIcon />}
                              >
                                Upload Logo
                              </Button>
                            </label>
                            {newLogo && (
                              <Avatar
                                src={newLogo}
                                alt="preview"
                                sx={{ width: 50, height: 50, border: "2px solid #1976d2" }}
                              />
                            )}
                          </Stack>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                          <Button onClick={handleAddBrand} variant="contained" color="success">
                            Add
                          </Button>
                        </DialogActions>
                      </Dialog>

                      <TextField
                        label="Invertor Warranty in years"
                        placeholder="e.g: 12"
                        variant="filled"
                        value={proposal.Invertorwarranty || ""}
                        onChange={(e) =>
                          setProposal({ ...proposal, Invertorwarranty: e.target.value })
                        }
                        fullWidth
                      />
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="invertor-size">Invertor Size</InputLabel>
                        <Select
                          labelId="invertor-size"
                          value={proposal.InvertorSize}
                          onChange={(e) =>
                            setProposal({ ...proposal, InvertorSize: e.target.value as InvertorSize })
                          }
                        >
                          <MenuItem value="5KW- 3P">5KW- 3P</MenuItem>
                          <MenuItem value="6KW- 3P">6KW- 3P</MenuItem>
                          <MenuItem value="8KW- 3P">8KW- 3P</MenuItem>
                          <MenuItem value="10KW- 3P">10KW- 3P</MenuItem>
                          <MenuItem value="12KW- 3P">12KW- 3P</MenuItem>
                          <MenuItem value="15KW- 3P">15KW- 3P</MenuItem>
                          <MenuItem value="20KW- 3P">20KW- 3P</MenuItem>
                          <MenuItem value="25KW- 3P">25KW- 3P</MenuItem>
                          <MenuItem value="30KW- 3P">30KW- 3P</MenuItem>
                          <MenuItem value="50KW- 3P">50KW- 3P</MenuItem>
                          <MenuItem value="100KW- 3P">100KW- 3P</MenuItem>
                        </Select>
                      </FormControl>

                      {/* ✅ Inverter Type */}
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="invertor-type">Invertor Type</InputLabel>
                        <Select
                          labelId="invertor-type"
                          value={proposal.invertortype || ""}
                          onChange={(e) =>
                            setProposal({ ...proposal, invertortype: e.target.value as Invertortype })
                          }
                        >
                          <MenuItem value="String Invertor">String Invertor</MenuItem>
                          <MenuItem value="Micro Invertor">Micro Invertor</MenuItem>
                        </Select>
                      </FormControl>

                      {/* ✅ Inverter Phase */}
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="invertor-phase">Invertor Phase</InputLabel>
                        <Select
                          labelId="invertor-phase"
                          value={proposal.invertorPhase || ""}
                          onChange={(e) =>
                            setProposal({ ...proposal, invertorPhase: e.target.value as InvertorPhase })
                          }
                        >
                          <MenuItem value="Single Phase">Single Phase</MenuItem>
                          <MenuItem value="Three Phase">Three Phase</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="No. of Invertor"
                        placeholder="e.g: 12"
                        variant="filled"
                        value={proposal.invertorquantitiy || ""}
                        onChange={(e) =>
                          setProposal({ ...proposal, invertorquantitiy: e.target.value })
                        }
                        fullWidth
                      />
                    </Stack>
                  </Box>
                </Collapse>
              </Stack>

              {/* Proposal detils here  */}
              <Stack spacing={2}>
                {/* Button to toggle panel section */}
                <button
                  type="button"
                  className="rounded-2xl p-5 bg-blue-200"
                  onClick={() => setOpenPropsal(!openProposal)}
                >
                  <div className="flex text-right justify-between">
                    <span className="font-semibold text-lg">
                      Proposal Details
                    </span>
                    <span className="bg-blue-600 p-2 rounded-full">
                      {openProposal ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    </span>
                  </div>
                </button>

                {/* Collapsible Panel Section */}
                <Collapse in={openProposal}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      p: 2,
                      bgcolor: "#f9f9f9",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Proposal Details
                    </Typography>

                    <Stack spacing={2}>
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="structure-label">Structure</InputLabel>
                        <Select
                          labelId="structure-label"
                          value={proposal.proposalStructure}
                          onChange={(e) =>
                            setProposal({ ...proposal, proposalStructure: e.target.value as ProposalStructure })
                          }
                        >
                          <MenuItem value="Elevated">Elevated</MenuItem>
                          <MenuItem value="Standard">Standard</MenuItem>
                          <MenuItem value="Metal Shed">Metal Shed</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Watt Peak (WP)"
                        placeholder="e.g: 590"
                        variant="filled"
                        value={proposal.proposalWattpeak || ""}
                        onChange={(e) =>
                          setProposal({ ...proposal, proposalWattpeak: e.target.value })
                        }
                        fullWidth
                      />

                      {/* Multi Select */}
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="cable-brand-label">Select Cable Brands</InputLabel>
                        <Select
                          labelId="cable-brand-label"
                          multiple
                          value={proposal.cableBrands || []}
                          onChange={(e) =>
                            setProposal({ ...proposal, cableBrands: e.target.value as string[] })
                          }
                          renderValue={(selected) => (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {(selected as string[]).map((value) => (
                                <Chip key={value} label={value} />
                              ))}
                            </Stack>
                          )}>
                          {cableBrandList.map((brand, index) => (
                            <MenuItem key={index} value={brand}>
                              {brand}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Button to open dialog */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenCableDialog(true)}
                        sx={{
                          mt: 2,
                          width: "auto",
                          alignSelf: "flex-start",
                        }}
                      >
                        ➕ Add Cable Brand
                      </Button>

                      {/* Dialog for adding new brand */}
                      <Dialog open={openCableDialog} onClose={() => setOpenCableDialog(false)}>
                        <DialogTitle>Add Cable Brand</DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Brand Name"
                            fullWidth
                            value={newCable}
                            onChange={(e) => setNewCable(e.target.value)}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpenCableDialog(false)}>Cancel</Button>
                          <Button onClick={handleAddCable} variant="contained" color="success">
                            Add
                          </Button>
                        </DialogActions>
                      </Dialog>
                      {/* Show selected brands in separate boxes with delete */}
                      <Box sx={{ mt: 3 }}>
                        <h3>Selected Cable Brands:</h3>
                        <Stack direction="column" spacing={2}>
                          {cableBrands.map((brand) => (
                            <Stack
                              key={brand}
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              spacing={2}
                              sx={{
                                p: 1.5,
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                bgcolor: "#fafafa",
                              }}
                            >
                              {/* Brand name */}
                              <span style={{ fontWeight: 500 }}>{brand}</span>

                              {/* Delete button */}
                              <IconButton color="error" onClick={() => handleDeleteCableBrand(brand)}>
                                <ClearIcon />
                              </IconButton>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>


                      <FormControl fullWidth variant="filled">
                        <InputLabel id="structure-description-label">Structure Description</InputLabel>
                        <Select
                          labelId="structure-description-label"
                          value={proposal.structureDes}
                          onChange={(e) =>
                            setProposal({ ...proposal, structureDes: e.target.value as StrucrtureDes })
                          }
                        >
                          <MenuItem value="Hot Dip Galvanised">Hot Dip Galvanised</MenuItem>
                          <MenuItem value="Pre Galvanised">Pre Galvanised</MenuItem>
                          <MenuItem value="Slotted Channel">Slotted Channel</MenuItem>
                          <MenuItem value="Ms Channel & Gi Channel">Ms Channel & Gi Channel</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="System Warranty"
                        placeholder="e.g: 5"
                        variant="filled"
                        value={proposal.systemwarranty || ""}
                        onChange={(e) =>
                          setProposal({ ...proposal, systemwarranty: e.target.value })
                        }
                        fullWidth
                      />
                      <span>Balance of System</span>
                      <TextareaAutosize
                        maxRows={10}
                        aria-label="Balance of System"
                        value={proposal.balanceOfSystem}
                        onChange={(e) =>
                          setProposal({ ...proposal, balanceOfSystem: e.target.value })
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          fontSize: "16px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          resize: "vertical",
                          lineHeight: "1.5",
                        }}
                      />

                      <span>Our Scope</span>
                      <TextareaAutosize
                        maxRows={10}
                        aria-label="Our Scope"
                        value={proposal.ourScope}
                        onChange={(e) =>
                          setProposal({ ...proposal, ourScope: e.target.value })
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          fontSize: "16px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          resize: "vertical",
                          lineHeight: "1.5",
                        }}
                      />

                      <span>Customer Scope</span>
                      <TextareaAutosize
                        maxRows={10}
                        aria-label="Customer Scope"
                        value={proposal.customerScope}
                        onChange={(e) =>
                          setProposal({ ...proposal, customerScope: e.target.value })
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          fontSize: "16px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          resize: "vertical",
                          lineHeight: "1.5",
                        }}
                      />

                      <TextField
                        label="Stage 1"
                        placeholder="e.g: 5 Days"
                        variant="filled"
                        value={proposal.stage1}
                        onChange={(e) => setProposal({ ...proposal, stage1: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Stage 2"
                        placeholder="e.g: 10 Days"
                        variant="filled"
                        value={proposal.stage2}
                        onChange={(e) => setProposal({ ...proposal, stage2: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Stage 3"
                        placeholder="e.g: 15 Days"
                        variant="filled"
                        value={proposal.stage3}
                        onChange={(e) => setProposal({ ...proposal, stage3: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Stage 4"
                        placeholder="e.g: 20 Days"
                        variant="filled"
                        value={proposal.stage4}
                        onChange={(e) => setProposal({ ...proposal, stage4: e.target.value })}
                        fullWidth
                      />
                    </Stack>
                  </Box>
                </Collapse>
              </Stack>

              {/* graph creation  */}

              <Stack spacing={2}>

                {/* Button to toggle graph section */}
                <button
                  type="button"
                  className="rounded-2xl p-5 bg-blue-200"
                  onClick={() => setOpenGraph(!openGraph)}
                >
                  <div className="flex text-right justify-between">
                    <span className="font-semibold text-lg">📊 Graph details</span>
                    <span className="bg-blue-600 p-2 rounded-full text-white">
                      {openGraph ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    </span>
                  </div>
                </button>

                {/* Collapsible Panel Section */}
                <Collapse in={openGraph}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      p: 2,
                      bgcolor: "#f9f9f9",
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography variant="h6" gutterBottom>
                        📊 Edit Graph
                      </Typography>

                      {/* Graph type */}
                      {/* <FormControl fullWidth variant="filled">
                        <InputLabel id="graph-type-label">Graph Type</InputLabel>
                        <Select
                          labelId="graph-type-label"
                          value={proposal.graphType}
                          onChange={(e) =>
                            setProposal({ ...proposal, graphType: e.target.value as GraphType })
                          }
                        >
                          <MenuItem value="Mono">Mono</MenuItem>
                          <MenuItem value="Mono-Perv">Mono-Perv</MenuItem>
                          <MenuItem value="Poly">Poly</MenuItem>
                          <MenuItem value="BIVP">BIVP</MenuItem>
                          <MenuItem value="Mono-Prev Half Cut">Mono-Prev Half Cut</MenuItem>
                          <MenuItem value="Mono BiFacial">Mono BiFacial</MenuItem>
                          <MenuItem value="TopCon MonoFacial">TopCon MonoFacial</MenuItem>
                          <MenuItem value="TopCon BiFacial">TopCon BiFacial</MenuItem>
                        </Select>
                      </FormControl> */}

                      <span>Data:</span>

                      <TextField
                        label="Yearly consumption kWH"
                        placeholder="e.g: 15000"
                        variant="filled"
                        value={proposal.yearlyconsumption}
                        onChange={(e) =>
                          setProposal({ ...proposal, yearlyconsumption: e.target.value })
                        }
                        fullWidth
                      />

                      <TextField
                        label="Yearly Solar Generation kWH"
                        placeholder="e.g: 1460"
                        variant="filled"
                        value={proposal.yearlysolargeneration}
                        onChange={(e) =>
                          setProposal({ ...proposal, yearlysolargeneration: e.target.value })
                        }
                        fullWidth
                      />

                      <TextField
                        label="Yearly % increment in price"
                        placeholder="e.g: 2"
                        variant="filled"
                        value={proposal.priceincrement}
                        onChange={(e) =>
                          setProposal({ ...proposal, priceincrement: e.target.value })
                        }
                        fullWidth
                      />

                      <TextField
                        label="Yearly % decrement in generation "
                        placeholder="e.g: 0.4"
                        variant="filled"
                        value={proposal.decrementgeneration}
                        onChange={(e) =>
                          setProposal({ ...proposal, decrementgeneration: e.target.value })
                        }
                        fullWidth
                      />

                      <TextField
                        label="Years for which to plot the graph"
                        placeholder="e.g: 8"
                        variant="filled"
                        value={proposal.plotgraph}
                        onChange={(e) =>
                          setProposal({ ...proposal, plotgraph: e.target.value })
                        }
                        fullWidth
                      />

                      <FormControl fullWidth variant="filled">
                        <InputLabel id="direction-type-label">Direction</InputLabel>
                        <Select
                          labelId="direction-type-label"
                          value={proposal.directionType}
                          onChange={(e) =>
                            setProposal({ ...proposal, directionType: e.target.value as DirectionType })
                          }
                        >
                          <MenuItem value="Left to Right">Left to Right</MenuItem>
                          <MenuItem value="Right to Left">Right to Left</MenuItem>
                        </Select>
                      </FormControl>

                      {/* Chart */}
                      <span>Graph preview: </span>
                      <Box
                        sx={{
                          width: "100%",
                          height: 450,
                          mt: 3,
                          border: "1px solid #ccc",
                          borderRadius: 2,
                          p: 2,
                          bgcolor: "#fff",
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          📊 Monthly Generation Values (per kWp)
                        </Typography>

                        <div>
                          <div ref={chartRef} style={{ width: "100%", height: "400px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis label={{ value: "Amount (kWh)", angle: -90, position: "insideLeft" }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="increment" name="Increment" fill="#1f3c88" barSize={20} />
                                <Bar dataKey="decrement" name="Decrement" fill="#ff6b6b" barSize={20} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex justify-center">
                            <Button
                              type="button"
                              onClick={handleSaveImage}
                              variant="contained"
                              sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: "9999px",
                                boxShadow: "inset 5px 1px 17px 9px rgba(0,0,0,0.35)",
                                textTransform: "none",
                                fontWeight: "600",
                                marginBottom: 6,
                                backgroundColor: "#1f3c88",
                                "&:hover": {
                                  backgroundColor: "#162b63",
                                },
                              }}
                            >
                              Click to Save Graph
                            </Button>

                          </div>

                        </div>

                      </Box>
                      <span>Monthly Generation Value (per kWp)</span>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {graphData.map((m) => (
                          <Box
                            key={m.month}
                            sx={{
                              padding: 2,
                              border: "1px solid #ccc",
                              borderRadius: 2,
                              textAlign: "center",
                              minWidth: 50,
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "#f0f0f0",
                              },
                            }}
                          >
                            {m.month}
                          </Box>
                        ))}
                      </Box>
                    </Stack>
                  </Box>
                </Collapse>
              </Stack>


              <Box sx={{ width: '100%', mt: 3 }}>
                <div>
                  <div ref={tableRef}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#003366" }}>
                          <TableCell sx={{ color: "white" }}>Description</TableCell>
                          <TableCell sx={{ color: "white" }}>Price</TableCell>
                          <TableCell sx={{ color: "white" }}>Quantity</TableCell>
                          <TableCell sx={{ color: "white" }}>Subtotal</TableCell>
                          <TableCell sx={{ color: "white" }}></TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rows.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              backgroundColor: index % 2 === 0 ? "lightblue" : "white",
                            }}
                          >
                            {/* Description */}
                            <TableCell>
                              <TextField
                                variant="standard"
                                placeholder="Give Description"
                                fullWidth
                                value={row.description}
                                onChange={(e) => handleRowChange(index, "description", e.target.value)}
                                InputProps={{ disableUnderline: true }}
                              />
                            </TableCell>

                            {/* Price */}
                            <TableCell>
                              <TextField
                                type="number"
                                variant="standard"
                                placeholder="0"
                                fullWidth
                                value={row.price === 0 ? "" : row.price}
                                onChange={(e) =>
                                  handleRowChange(index, "price", e.target.value === "" ? 0 : Number(e.target.value))
                                }
                                InputProps={{
                                  disableUnderline: true,
                                  startAdornment: <span style={{ marginRight: 4 }}>₹</span>,
                                }}
                                sx={{
                                  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                    { WebkitAppearance: "none", margin: 0 },
                                  "& input[type=number]": { MozAppearance: "textfield" },
                                }}
                              />
                            </TableCell>

                            {/* Quantity */}
                            <TableCell>
                              <TextField
                                type="number"
                                variant="standard"
                                placeholder="0"
                                fullWidth
                                value={row.quantity === 0 ? "" : row.quantity}
                                onChange={(e) =>
                                  handleRowChange(index, "quantity", e.target.value === "" ? 0 : Number(e.target.value))
                                }
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                    { WebkitAppearance: "none", margin: 0 },
                                  "& input[type=number]": { MozAppearance: "textfield" },
                                }}
                              />
                            </TableCell>

                            {/* Subtotal */}
                            <TableCell>
                              {/* subtotal */}
                              <div>₹ {(Number(row.price) * Number(row.quantity)).toLocaleString("en-IN")}</div>

                              {/* small note field */}
                              <TextField
                                variant="standard"
                                placeholder="Add note"
                                fullWidth
                                value={row.note}
                                onChange={(e) => handleRowChange(index, "note", e.target.value)}
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                  fontSize: "0.8rem",
                                  mt: 0.5,
                                  "& input": {
                                    fontSize: "0.8rem",
                                    color: "gray",
                                  },
                                }}
                              />
                            </TableCell>


                            {/* Delete */}
                            <TableCell>
                              <IconButton onClick={() => handleDeleteRow(index)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* Add Row */}
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Button startIcon={<AddIcon />} onClick={handleAddRow}>
                              Add Row
                            </Button>
                          </TableCell>
                        </TableRow>

                        {/* Subtotal */}
                        <TableRow
                          sx={{
                            backgroundColor:
                              (rows.length + 1) % 2 === 0 ? "lightblue" : "white",
                          }}
                        >
                          <TableCell colSpan={3}>Subtotal</TableCell>
                          <TableCell colSpan={2}>₹ {subtotal.toLocaleString("en-IN")}</TableCell>

                        </TableRow>

                        {/* GST */}
                        <TableRow
                          sx={{
                            backgroundColor:
                              (rows.length + 2) % 2 === 0 ? "lightblue" : "white",
                          }}
                        >
                          <TableCell>GST %</TableCell>
                          <TextField
                            type="number"
                            variant="standard"
                            value={gst === 0 ? "" : gst}
                            onChange={(e) => {

                              const val = e.target.value === "" ? 0 : Number(e.target.value);
                              setGst(val);
                            }}
                            InputProps={{ disableUnderline: true }}
                            sx={{
                              "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                { WebkitAppearance: "none", margin: 0 },
                              "& input[type=number]": { MozAppearance: "textfield" },
                            }}
                            placeholder="0"
                          />

                          <TableCell colSpan={3}>₹ {gstAmount.toLocaleString("en-IN")}</TableCell>
                        </TableRow>

                        {/* Total */}
                        <TableRow
                          sx={{
                            backgroundColor:
                              (rows.length + 3) % 2 === 0 ? "lightblue" : "white",
                          }}
                        >
                          <TableCell colSpan={3}>
                            <strong>Total Cost</strong>
                          </TableCell>
                          <TableCell colSpan={2}>
                            <strong>₹ {total.toLocaleString("en-IN")}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <Button
                    onClick={handleCapture}
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: "9999px",
                      boxShadow: "inset 5px 1px 17px 9px rgba(0,0,0,0.35)",
                      textTransform: "none",
                      fontWeight: "600",
                      marginBottom: 6,
                      backgroundColor: "#1f3c88",
                      "&:hover": {
                        backgroundColor: "#162b63",
                      },
                    }}
                  >
                    Save image as table
                  </Button>
                </div>

                {/* Amount in Words Section */}
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#003366', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Amount in Words:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'semibold', fontSize: 15 }}>
                    {numberToWords(total)}
                  </Typography>
                </Box>
              </Box>

              <div className="flex justify-center">
                <Button type="submit" variant="contained" color="success">
                  Add Proposal
                </Button>

              </div>
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
                <div className="font7">
                  <h3 className="font-bold text-lg">{p.clientName}</h3>
                  <p>Phone no. : <span className="text-base font-semibold">{p.clientPhone}</span></p>
                  <p>Email : <span className="text-base font-semibold">{p.clientEmail}</span></p>
                  <p>Address : <span className="text-base font-semibold">{p.clientAddress}</span></p>
                  <p className="text-lg font8">✅ Proposal Created!</p>
                </div>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    color="primary"
                    onClick={() => handleDownloadPdf(p._id)}
                    disabled={loadingPdf === p._id}
                  >
                    {loadingPdf === p._id ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <PictureAsPdfIcon />
                    )}
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(p)}
                  >
                    <EditIcon />
                  </IconButton>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => handleDelete(p._id)}
                    disabled={loadingPdf === p._id}
                  >
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

