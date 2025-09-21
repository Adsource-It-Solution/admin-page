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
  Menu,
  Divider,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UploadIcon from "@mui/icons-material/Upload";
import ClearIcon from '@mui/icons-material/Clear';
// import generateSolarQuoteHTML from "./utils/generateSolarHtml";

interface Service {
  _id: string;
  name: string;
  price: number;
}

export type Product = {
  name: string;
  qty: number;
  price: number;
};

type BatteryType = "Li-Ion" | "Lead-Acid";
type LeadAcidSubtype = "40Ah" | "75Ah" | "100Ah" | "150Ah" | "200Ah";

export type Proposal = {
  _id?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  clienttitle: string;
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
  invertorPhase: string;
  batteryBrands: string;
  batterytype: BatteryType | "";
  leadAcidSubtype?: LeadAcidSubtype | "";
  cableBrands: string;
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
  // graphType: string;
  services: string[];
  products: string[];
  employees: string[];

  tableImage?: string;
  graphimage?: string;
  // Index signature for dynamically accessed fields
  [key: string]: string | string[] | undefined;  // Allow 'undefined' for dynamically added properties
};

type ClientPrefix = "Mr." | "Mrs." | "Ms.";
type CustomerType = "Industrial" | "Commercial" | "Government" | "Residential" | "others";
type PanelType = "Mono" | "Mono-Perv" | "Poly" | "BIVP" | "Mono-Prev Half Cut" | "Mono BiFacial" | "TopCon MonoFacial" | "TopCon BiFacial";
type InvertorSize = "2kw-1ph" | "3kw-1ph" | "5kw-1ph" | "5KW- 3P" | "6KW- 3P" | "8KW- 3P" | "10KW- 3P" | "12KW- 3P" | "15KW- 3P" | "20KW- 3P" | "25KW- 3P" | "30KW- 3P" | "50KW- 3P" | "100KW- 3P";
type InvertorPhase = "Single Phase" | "Three Phase";
type Invertortype = "String Invertor" | "Micro Invertor" | "Off Grid Inverter" | "Hybrid Inverter";
type ProposalStructure = "Elevated" | "Standard" | "Metal Shed";
type StrucrtureDes = "Hot Dip Galvanised" | "Pre Galvanised" | "Slotted Channel" | "Ms Channel & Gi Channel"
// type DirectionType = "Left to Right" | "Right to left";

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
    clienttitle: "",
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
    invertorPhase: "",
    performancewarranty: "",
    quantity: "",
    invertorquantitiy: "",
    invertortype: "",
    batteryBrands: "",
    batterytype: "",
    proposalStructure: "",
    cableBrands: "",
    structureDes: "",
    systemwarranty: "",
    stage1: "",
    stage2: "",
    stage3: "",
    stage4: "",
    priceunitelectricity: "",
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

  const [, setProposals] = useState<Proposal[]>([]);
  const [, setServices] = useState<Service[]>([]);
  const [, setProducts] = useState<Product[]>([]);

  // State for editing proposal and employee details
  const [editingId, setEditingId] = useState<string | null>(null);

  // Customer and proposal-related states
  // const [customerType, setCustomerType] = useState<CustomerType>();
  const [openPanel, setOpenPanel] = useState(false);
  const [openProposal, setOpenPropsal] = useState(false);
  const [openBattery, setOpenBattery] = useState(false);
  const [, setBatteryBrand] = useState<string>('');
  const [batteryBrandList, setBatteryBrandList] = useState<{ name: string; logo?: string }[]>([
    { name: "Luminous", logo: "/office.svg" },
    { name: "Exide", logo: "/office.svg" },
    { name: "Amaron", logo: "/office.svg" },
    { name: "Okaya", logo: "/office.svg" },
    { name: "LG", logo: "/office.svg" },
    { name: "Samsung", logo: "/office.svg" },
    { name: "Panasonic", logo: "/office.svg" },
    { name: "CATL", logo: "/office.svg" },
  ]);
  const [newBattery, setNewBattery] = useState("");
  const [newBatteryLogo, setNewBatteryLogo] = useState<string | null>(null);
  const [openBatteryDialog, setOpenBatteryDialog] = useState(false);
  const LeadAcidSubtype: LeadAcidSubtype[] = ["40Ah", "75Ah", "100Ah", "150Ah", "200Ah"];


  // Invertor and cable brands
  const [openInvertor, setOpenInvertor] = useState(false);
  const [, setInvertorBrands] = useState<string[]>([]);
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
  const [openDialog, setOpenDialog] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newLogo, setNewLogo] = useState<string | null>(null);

  // Cable brands
  const [cableBrandList, setCableBrandList] = useState<string[]>([
    "Polycab", "Havells", "Finolex", "KEI", "RR Kabel", "Syska", "V-Guard", "Anchor"
  ]);
  const [, setCableBrands] = useState<string[]>([]);

  const [panelBrand,] = useState<string[]>([
    "Waaree Energies", "Tata Power Solar", "Adani Solar", "Vikram Solar", " Goldi Solar", "Rayzon Solar"
  ]);
  // const [, setPanelBrands] = useState<string[]>([]);
  // const [newPanel, setNewPanel] = useState<string>("")
  // const [, setOpenPanelDialog] = useState(false)

  // Dialog and other UI related states

  // const [openGraph, setOpenGraph] = useState(false);
  const [newCable, setNewCable] = useState<string>(" ");
  const [openCableDialog, setOpenCableDialog] = useState(false);

  const [graphData, setGraphData] = useState<GraphDatum[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const consumption = parseFloat(proposal.consumption || "0");
    const generation = parseFloat(proposal.generation || "0");

    const yearsToPlot = 10; // fixed

    const newData: GraphDatum[] = [];

    for (let year = 1; year <= yearsToPlot; year++) {
      const adjustedConsumption =
        consumption * Math.pow(1 + 0.02, year - 1); // +2% each year

      const adjustedGeneration =
        generation * Math.pow(1 - 0.004, year - 1); // -0.4% each year

      newData.push({
        month: `${year}`, // keep property name "month"
        increment: adjustedConsumption, // match GraphDatum
        decrement: adjustedGeneration,  // match GraphDatum
      });
    }

    setGraphData(newData);
  }, [proposal.consumption, proposal.generation]);






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

  const [rows, setRows] = useState([
    { description: "", price: 0, quantity: 0, note: "" },
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
  // State to track which row the menu is open for
  const [openNoteRow, setOpenNoteRow] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);


  // Open menu handler
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, rowIndex: number) => {
    setAnchorEl(event.currentTarget as HTMLElement);
    setMenuRowIndex(rowIndex);
  };


  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowIndex(null);
  };

  // Delete row
  const handleDeleteRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    handleMenuClose();
  };
  const handleDeleteNote = (rowIndex: number) => {
    handleRowChange(rowIndex, "note", ""); // clear the note field
    setOpenNoteRow(null); // hide the note input again if you want
  }

  // Add row below
  const handleAddRowBelow = () => {
    if (menuRowIndex === null) return;
    const newRow = { description: "", price: 0, quantity: 0, note: "" };
    const updated = [
      ...rows.slice(0, menuRowIndex + 1),
      newRow,
      ...rows.slice(menuRowIndex + 1),
    ];
    setRows(updated);
    handleMenuClose();
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

  const handleCapture = async (proposal: Proposal) => {
    if (!tableRef.current) return;

    const canvas = await html2canvas(tableRef.current);
    const dataUrl = canvas.toDataURL("image/png");

    // Save image in the proposal object
    proposal.tableImage = dataUrl;
    toast.info("📤 Uploading image...");

    // Send to backend
    await fetch(
      // `http://localhost:5000/api/upload-table-image`,
      `${import.meta.env.VITE_API_URL}/api/upload-table-image`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

    // alert("Table image sent!");
    toast.success("✅ Image Saved")
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
    const currentProposal: Proposal = { ...proposal };

    // 1️⃣ capture graph if present
    if (graphRef.current) {
      try {
        await handleSaveGraph(currentProposal); // will set currentProposal.graphimage + upload
      } catch (err) {
        console.error("Graph capture failed", err);
      }
    }

    // 2️⃣ capture table if present
    if (tableRef.current) {
      try {
        await handleCapture(currentProposal); // will set currentProposal.tableImage + upload
      } catch (err) {
        console.error("Table capture failed", err);
      }
    }

    // 2️⃣ Required fields check
    const requiredFields = [
      "clientName",
      "clientPhone",
      "clientEmail",
      "clientAddress",
      "clienttitle",
      "customerType",
      "projectsize",
      "consumption",
      "electricity",
      "generation",
      "warranty",
      "proposalWattpeak",
      "Invertorwarranty",
      "batteryBrands",
      "batterytype",
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
          // `http://localhost:5000/api/proposal/${editingId}`,
          `${import.meta.env.VITE_API_URL}/api/proposal/${editingId}`,
          proposal
        );
        toast.success("✅ Proposal updated");
      } else {
        // Add new proposal
        await axios.post(
          // `http://localhost:5000/api/proposal/add-proposal`,
          `${import.meta.env.VITE_API_URL}/api/proposal/add-proposal`,
          proposal
        );
        toast.success("✅ Proposal added");
      }
      // const html = generateSolarQuoteHTML(currentProposal);
      // setPreviewHtml(html);

      // 4️⃣ Reset state
      setProposal({
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        clientAddress: "",
        clienttitle: "",
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
        invertorPhase: "",
        quantity: "",
        invertorquantitiy: "",
        invertortype: "",
        batteryBrands: "",
        batterytype: "",
        cableBrands: "",
        proposalStructure: "",
        structureDes: "",
        systemwarranty: "",
        stage1: "",
        stage2: "",
        stage3: "",
        stage4: "",
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

  const handleSaveGraph = async (proposal: Proposal) => {
    console.log("📌 handleSaveGraph called");

    if (!graphRef.current) {
      console.error("❌ graphRef.current is null");
      toast.error("Graph element not found");
      return;
    }

    try {
      console.log("📌 Taking snapshot of the graph DOM...");
      const canvas = await html2canvas(graphRef.current);

      console.log("📌 Converting canvas to data URL...");
      const dataUrl = canvas.toDataURL("image/png");
      console.log("📌 Data URL generated:", dataUrl.slice(0, 100), "...");

      proposal.graphimage = dataUrl;
      console.log("📌 proposal.graphimage updated");

      // Show loading toast or spinner
      toast.info("📤 Uploading image...");

      const res = await fetch(
        // `http://localhost:5000/api/proposal/uploadGraph`,
        `${import.meta.env.VITE_API_URL}/api/proposal/uploadGraph`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} ${errorText}`);
      }

      const json = await res.json();
      console.log("📌 Backend response:", json);

      toast.success("✅ Graph Image Saved");
    } catch (err: any) {
      console.error("❌ handleSaveGraph Error:", err);
      toast.error(`Failed to save graph: ${err.message}`);
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
    setProposal((prev) => ({
      ...prev,
      invertorBrands: (prev.invertorBrands as string[]).filter((b) => b !== brandName),
    }));
  };

  const handleAddCable = () => {
    if (newCable.trim() && !cableBrandList.includes(newCable)) {
      setCableBrandList((prev) => [...prev, newCable]);
      setCableBrands((prev) => [...prev, newCable]);
    }
    setNewCable("");
    setOpenCableDialog(false);
  };


  const handleBatteryLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBatteryLogo(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddBattery = () => {
    if (
      newBattery.trim() &&
      !batteryBrandList.some((t) => t.name === newBattery)
    ) {
      // add to list
      setBatteryBrandList([
        ...batteryBrandList,
        { name: newBattery, logo: newBatteryLogo || undefined },
      ]);

      // set selected brand to the new one (single string)
      setBatteryBrand(newBattery);
    }
    setNewBattery('');
    setNewBatteryLogo(null);
    setOpenBatteryDialog(false);
  };




  return (
    <Stack spacing={5} sx={{ maxWidth: 900, margin: "auto", mt: 5 }}>
      {/* Add Proposal Form */}
      <Card>
        <h1 className="text-3xl flex justify-center font-bold">📑 Add Proposal</h1>
        <CardContent>
          <form onSubmit={handleAddOrUpdateProposal}>

            <Stack spacing={2}>
              <div className="flex flex-row">
                <FormControl sx={{ marginRight: 2, width: 100 }} variant="filled">
                  <InputLabel id="client-type-label">Title</InputLabel>
                  <Select
                    labelId="client-type-label"
                    value={proposal.clienttitle}
                    onChange={(e) =>
                      setProposal({ ...proposal, clienttitle: e.target.value as ClientPrefix })
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
                  value={proposal.clientName}
                  onChange={(e) => setProposal({ ...proposal, clientName: e.target.value })}
                  fullWidth
                />
              </div>

              <div className="flex flex-row gap-4">
                <TextField
                  label="Client Phone"
                  placeholder="0987654321"
                  variant="filled"
                  value={proposal.clientPhone}
                  onChange={(e) => setProposal({ ...proposal, clientPhone: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Client Email"
                  placeholder="customer@gmail.com"
                  variant="filled"
                  value={proposal.clientEmail}
                  onChange={(e) => setProposal({ ...proposal, clientEmail: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <FormControl fullWidth variant="filled" sx={{ flex: 1 }}>
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

              {/* Conditional input for 'Others' */}
              {proposal.customerType === "others" && (
                <TextField
                  label="Specify Other Customer Type"
                  placeholder="Enter customer type"
                  variant="filled"
                  value={proposal.otherCustomerType || ""}
                  onChange={(e) => setProposal({ ...proposal, otherCustomerType: e.target.value })}
                  fullWidth
                  sx={{ mt: 2 }}
                />
              )}


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
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="panel-brand-label">Panel Brand</InputLabel>
                        <Select
                          labelId="panel-brand-label"
                          value={proposal.panelBrands || ""}
                          onChange={(e) =>
                            setProposal({ ...proposal, panelBrands: e.target.value as string })
                          }
                          displayEmpty
                        >
                          {panelBrand.map((brand, index) => (
                            <MenuItem key={index} value={brand}>
                              {brand}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

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
                        <h3>Selected Inverter Brands:</h3>
                        <Stack direction="column" spacing={2}>
                          {(proposal.invertorBrands as string[] | undefined)?.map((brandName) => {
                            const brand = brands.find((b) => b.name === brandName);
                            if (!brand) return null;

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
                                {/* Brand logo + name */}
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  {brand.logo && (
                                    <Avatar
                                      src={brand.logo}
                                      alt={brand.name}
                                      sx={{ width: 32, height: 32 }}
                                    />
                                  )}
                                  <span style={{ fontWeight: 500 }}>{brand.name}</span>
                                </Stack>

                                {/* Delete button */}
                                <IconButton color="error" onClick={() => handleDeleteBrand(brandName)}>
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
                          {/* "2kw-1ph" |"3kw-1ph" | "5kw-1ph"  */}
                          <MenuItem value="2kw-1ph"> 2kw-1ph</MenuItem>
                          <MenuItem value="3kw-1ph">3kw-1ph</MenuItem>
                          <MenuItem value="5kw-1ph">5kw-1ph</MenuItem>
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
                          {/* "Off Grid Inverter" | "Hybrid Inverter" */}
                          <MenuItem value="Off Grid Inverter">Off Grid Inverter</MenuItem>
                          <MenuItem value="Hybrid Inverter">Hybrid Inverter</MenuItem>
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


              {/* Battery details  */}
              <Stack spacing={2}>
                {/* Button to toggle invertor section */}
                <button
                  type="button"
                  className="rounded-2xl p-5 bg-blue-200"
                  onClick={() => setOpenBattery(!openBattery)}
                >
                  <div className="flex text-right justify-between">
                    <span className="font-semibold text-lg">
                      Battery Details
                    </span>
                    <span className="bg-blue-600 p-2 rounded-full">
                      {openBattery ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    </span>
                  </div>
                </button>

                {/* Collapsible Inverotr Section */}
                <Collapse in={openBattery}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      p: 2,
                      bgcolor: "#f9f9f9",
                    }}
                  >
                    <Stack spacing={2}>
                      <div>
                        {/* Select Battery Brands */}
                        <FormControl fullWidth variant="filled">
                          <InputLabel id="battery-brand-label">Select Battery Brand</InputLabel>
                          <Select
                            labelId="battery-brand-label"
                            // ❌ remove multiple
                            value={proposal.batteryBrands || ''} 
                            onChange={(e) => setBatteryBrand(e.target.value as string)}
                            renderValue={(selected) => {
                              // selected is a string here
                              const brand = batteryBrandList.find((b) => b.name === selected);
                              return (
                                <Stack direction="row" spacing={1} alignItems="center">
                                  {brand?.logo && (
                                    <Avatar
                                      src={brand.logo}
                                      alt={brand.name}
                                      sx={{ width: 24, height: 24 }}
                                    />
                                  )}
                                  <span>{brand?.name || selected}</span>
                                </Stack>
                              );
                            }}
                          >
                            {batteryBrandList.map((brand, index) => (
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
                          onClick={() => setOpenBatteryDialog(true)}
                          sx={{ mt: 2, width: "auto", alignSelf: "flex-start" }}
                        >
                          ➕ Add Battery Brand
                        </Button>

                        {/* Dialog for adding new battery brand */}
                        <Dialog open={openBatteryDialog} onClose={() => setOpenBatteryDialog(false)}>
                          <DialogTitle>Add Battery Brand</DialogTitle>
                          <DialogContent>
                            <TextField
                              autoFocus
                              margin="dense"
                              label="Brand Name"
                              fullWidth
                              value={newBattery}
                              onChange={(e) => setNewBattery(e.target.value)}
                            />
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                              <input
                                accept="image/*"
                                id="upload-battery-logo"
                                type="file"
                                style={{ display: "none" }}
                                onChange={handleBatteryLogoUpload}
                              />
                              <label htmlFor="upload-battery-logo">
                                <Button variant="contained" component="span" startIcon={<UploadIcon />}>
                                  Upload Logo
                                </Button>
                              </label>
                              {newBatteryLogo && (
                                <Avatar
                                  src={newBatteryLogo}
                                  alt="preview"
                                  sx={{ width: 50, height: 50, border: "2px solid #1976d2" }}
                                />
                              )}
                            </Stack>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setOpenBatteryDialog(false)}>Cancel</Button>
                            <Button onClick={handleAddBattery} variant="contained" color="success">
                              Add
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>

                      <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                          Select Battery Type
                        </Typography>

                        {/* Main Battery Type */}
                        <FormControl fullWidth variant="filled">
                          <InputLabel id="battery-type-label">Battery Type</InputLabel>
                          <Select
                            labelId="battery-type-label"
                            value={proposal.batterytype || ""}
                            onChange={(e) =>
                              setProposal({
                                ...proposal,
                                batterytype: e.target.value as BatteryType,
                                leadAcidSubtype: "", // reset subtype when changing main type
                              })
                            }
                          >
                            <MenuItem value="Li-Ion">Li-Ion</MenuItem>
                            <MenuItem value="Lead-Acid">Lead-Acid</MenuItem>
                          </Select>
                        </FormControl>

                        {/* Conditional Lead-Acid Subtype */}
                        {proposal.batterytype === "Lead-Acid" && (
                          <FormControl fullWidth variant="filled" sx={{ mt: 2 }}>
                            <InputLabel id="lead-acid-subtype-label">
                              Lead-Acid Subtype
                            </InputLabel>
                            <Select
                              labelId="lead-acid-subtype-label"
                              value={proposal.leadAcidSubtype || ""}
                              onChange={(e) =>
                                setProposal({
                                  ...proposal,
                                  leadAcidSubtype: e.target.value as LeadAcidSubtype,
                                })
                              }
                            >
                              {LeadAcidSubtype.map((subtype) => (
                                <MenuItem key={subtype} value={subtype}>
                                  {subtype}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </Box>
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


                      <Select
                        value={proposal.cableBrands || ""}
                        onChange={(e) =>
                          setProposal({ ...proposal, cableBrands: e.target.value as string })
                        }
                        displayEmpty
                      >
                        <MenuItem disabled value="">
                          Select Cable Brand
                        </MenuItem>
                        {cableBrandList.map((brand, index) => (
                          <MenuItem key={index} value={brand}>
                            {brand}
                          </MenuItem>
                        ))}
                      </Select>



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
                        <h3>Selected Cable Brand:</h3>
                        {proposal.cableBrands ? (
                          <Stack
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
                            {/* Brand logo + name */}
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <img
                                src={`/assets/cable-logos/${proposal.cableBrands.toLowerCase()}.png`}
                                alt={proposal.cableBrands}
                                style={{ width: 40, height: 40, objectFit: "contain" }}
                              />
                              <span style={{ fontWeight: 500 }}>{proposal.cableBrands}</span>
                            </Stack>
                          </Stack>
                        ) : (
                          <p style={{ color: "#777" }}>No brand selected</p>
                        )}
                      </Box>


                      {/* structure description  */}
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
                <span className="text-2xl font-semibold text-center">Graph preview: </span>
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
                    <div ref={graphRef} style={{ width: "100%", height: "400px" }}>
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
                  </div>
                </Box>
                {/* Button to toggle graph section */}
                {/* <button
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
                </button> */}

                {/* Collapsible Panel Section */}
                {/* <Collapse in={openGraph}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      p: 2,
                      bgcolor: "#f9f9f9",
                    }}
                  > */}
                <Stack spacing={2}>

                  {/* <span>Data:</span>

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
                      </FormControl> */}

                  {/* Chart */}

                  {/* <div className="flex justify-center" >
                            <Button
                              type="button"
                              onClick={() => handleSaveGraph(proposal)}
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


                          </div> */}

                  {/* </div>

                      </Box> */}
                  <span className="text-center text-lg">Yearly Generation Value (per kWp)</span>
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
                {/* </Box>
                </Collapse> */}
              </Stack>

              <Divider />
              <Box sx={{ width: '100%', mt: 3 }}>
                <div className="text-center text-2xl mt-6 ">Table </div>
                <div>
                  <div ref={tableRef}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#003366" }}>
                          <TableCell sx={{ color: "white" }}></TableCell>
                          <TableCell sx={{ color: "white" }}>Description</TableCell>
                          <TableCell sx={{ color: "white" }}>Price / kW</TableCell>
                          <TableCell sx={{ color: "white" }}>Quantity</TableCell>
                          <TableCell sx={{ color: "white" }}>Subtotal</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rows.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              backgroundColor: index % 2 === 0 ? "#f0f6ff" : "white"
                            }}
                          >
                            {/* menu button */}
                            <TableCell width={50}>
                              <IconButton onClick={(e) => handleMenuOpen(e, index)}>
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>

                            <TableCell>
                              <TextField
                                variant="standard"
                                placeholder="Give Description"
                                fullWidth
                                value={row.description}
                                onChange={(e) =>
                                  handleRowChange(index, "description", e.target.value)
                                }
                                InputProps={{ disableUnderline: true }}
                              />
                            </TableCell>

                            <TableCell>
                              <TextField
                                type="number"
                                variant="standard"
                                fullWidth
                                value={row.price || ""}
                                onChange={(e) =>
                                  handleRowChange(index, "price", Number(e.target.value) || 0)
                                }
                                InputProps={{
                                  disableUnderline: true,
                                  startAdornment: <span style={{ marginRight: 4 }}>₹</span>
                                }}
                                sx={{
                                  "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
                                    WebkitAppearance: "none",
                                    margin: 0
                                  },
                                  "& input[type=number]": { MozAppearance: "textfield" }
                                }}
                              />
                            </TableCell>

                            <TableCell>
                              <TextField
                                type="number"
                                variant="standard"
                                fullWidth
                                placeholder="0" // ← added placeholder
                                value={row.quantity || ""}
                                onChange={(e) =>
                                  handleRowChange(index, "quantity", Number(e.target.value) || 0)
                                }
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                  "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                  },
                                  "& input[type=number]": { MozAppearance: "textfield" },
                                }}
                              />
                            </TableCell>


                            <TableCell>
                              ₹ {(row.price * row.quantity).toLocaleString("en-IN")}

                              {openNoteRow === index && (
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
                              )}
                            </TableCell>

                          </TableRow>
                        ))}


                        {/* Subtotal */}
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>Subtotal</TableCell>
                          <TableCell>₹ {subtotal.toLocaleString("en-IN")}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>

                        {/* GST */}
                        <TableRow>
                          <TableCell></TableCell> {/* menu column */}
                          <TableCell>GST %</TableCell> {/* description column */}
                          <TableCell>
                            <TextField
                              type="number"
                              variant="standard"
                              value={gst || ""}
                              onChange={(e) => setGst(Number(e.target.value) || 0)}
                              InputProps={{
                                disableUnderline: true,
                              }}
                              placeholder="0"
                              sx={{
                                "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
                                  WebkitAppearance: "none",
                                  margin: 0
                                },
                                "& input[type=number]": { MozAppearance: "textfield" } // Firefox
                              }}
                            />
                          </TableCell> {/* price column (GST %) */}
                          <TableCell></TableCell> {/* quantity column */}
                          <TableCell>₹ {gstAmount.toLocaleString("en-IN")}</TableCell> {/* subtotal column */}
                        </TableRow>
                        {/* Total */}
                        <TableRow sx={{ backgroundColor: "#003366" }}>
                          <TableCell></TableCell>
                          <TableCell colSpan={2} align="right" sx={{ color: "white" }}>
                            Total Cost
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell sx={{ color: "white" }}>
                            ₹ {total.toLocaleString("en-IN")}
                          </TableCell>
                        </TableRow>
                        {/* Amount in Words Row */}
                        <TableRow sx={{ backgroundColor: "#003366" }}>
                          <TableCell colSpan={5} sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                color: "#fff",
                              }}
                            >
                              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Amount in Words:
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "semibold", fontSize: 15 }}
                              >
                                {numberToWords(total)}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>


                      </TableBody>

                      {/* 3-dot menu for add/delete */}
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        <MenuItem onClick={handleAddRowBelow}>
                          <AddIcon fontSize="small" /> Add Row Below
                        </MenuItem>

                        <MenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            if (menuRowIndex !== null) handleDeleteRow(menuRowIndex);
                          }}
                        >
                          <DeleteIcon fontSize="small" /> Delete Row
                        </MenuItem>

                        <MenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            if (menuRowIndex !== null) {
                              setOpenNoteRow(prev => (prev === menuRowIndex ? null : menuRowIndex));
                            }
                            setAnchorEl(null); // close menu after clicking
                          }}
                        >
                          <EditNoteIcon fontSize="small" /> Add/View Note
                        </MenuItem>
                        <MenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            if (menuRowIndex !== null) {
                              handleDeleteNote(menuRowIndex);
                            }
                            setAnchorEl(null); // close menu after clicking
                          }}
                        >
                          <DeleteIcon fontSize="small" /> Delete Note
                        </MenuItem>

                      </Menu>
                    </Table>
                  </div>
                  {/* <Button
                    onClick={() => handleCapture(proposal)}
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
                  </Button> */}

                </div>

                {/* Amount in Words Section */}
              </Box>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                >
                  {editingId ? "Update Proposal" : "Add Proposal"}
                </button>

              </div>
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
            </Stack>
          </form>
          {/* {previewHtml && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">📄 Proposal Preview</h2>
              <iframe
                title="Proposal PDF Preview"
                srcDoc={previewHtml}
                className="w-full h-[800px] border"
              />
            </div>
          )} */}
        </CardContent>
      </Card>
    </Stack>
  );
}

