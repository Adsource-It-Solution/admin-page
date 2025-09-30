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

export type OtherCharge = {
  description: string;
  price: number;
  quantity: number;
  note?:string;
};

export type RowType = {
  description: string;
  price: number;
  quantity: number;
  note?: string;
  otherCharges?: number;
};

export type Proposal = {
  _id?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  clienttitle: string;
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
  batteryquantity: string;
  batterywarranty: string;
  cableBrands: string;
  proposalStructure: string;
  structureDes: string;
  systemwarranty: string;
  balanceOfSystem: string;
  ourScope: string;
  customerScope: string;
  termandcondition: string;
  stage1: string;
  stage2: string;
  stage3: string;
  stage4: string;
  priceunitelectricity: string;
  invertorBrands: string[];
  otherCustomerType: string;
  panelBrands: string[];
  paneltype: string;

  rows: RowType[];
  gst: number;
  subtotal: number;
  gstAmount: number;
  total: number;
  otherCharges: OtherCharge[];

  services: string[];
  products: string[];
  employees: string[];

  tableImage?: string;
  graphimage?: string;

  // [key: string]: string | string[] | number | RowType[] | undefined;
};


type ClientPrefix = "Mr." | "Mrs." | "Ms.";
type CustomerType = "Industrial" | "Commercial" | "Government" | "Residential" | "others";
type PanelType = "Mono" | "Mono-Perc" | "Poly" | "BIVP" | "Mono-Prev Half Cut" | "Mono BiFacial" | "TopCon MonoFacial" | "TopCon BiFacial";
type InvertorSize = "2kw-1ph" | "3kw-1ph" | "5kw-1ph" | "5KW- 3P" | "6KW- 3P" | "8KW- 3P" | "10KW- 3P" | "12KW- 3P" | "15KW- 3P" | "20KW- 3P" | "25KW- 3P" | "30KW- 3P" | "50KW- 3P" | "100KW- 3P";
type InvertorPhase = "Single Phase" | "Three Phase";
type Invertortype = "String Invertor" | "Micro Invertor" | "Off Grid Inverter" | "Hybrid Inverter";
type ProposalStructure = "Elevated" | "Standard" | "Metal Shed";
type StrucrtureDes = "Hot Dip Galvanised" | "Pre Galvanised" | "Slotted Channel" | "Ms Channel & Gi Channel"
// type DirectionType = "Left to Right" | "Right to left";

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
    batteryquantity: "",
    batterywarranty: "",
    proposalStructure: "",
    cableBrands: "",
    structureDes: "",
    systemwarranty: "",
    stage1: "",
    stage2: "",
    stage3: "",
    stage4: "",
    priceunitelectricity: "",
    invertorBrands: [],
    otherCustomerType: "",
    panelBrands: [],
    paneltype: "",

    // tabledata
    rows: [
      { description: "", price: 0, quantity: 0, note: "", otherCharges: 0 },
      { description: "", price: 0, quantity: 0, note: "", otherCharges: 0 },
    ],
    gst: 0,
    subtotal: 0,
    gstAmount: 0,
    total: 0,
    otherCharges: [{ description: "", price: 0, quantity: 0, note: ""}],
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

    termandcondition: `Packing is included in the offer.
  • Transportation charges are our scope.
  • Civil and digging are at our scope.
  • Prices quotes are firm and valid for 10 days from the date of offer. After this period a
  reconfirmation from our office should be taken.
  • Water supply at site will be provided by customer free of cost during installation and
  commissioning.
  • Closed, covered, locked stores will be provided by customer during installation and
  commissioning.
  • We will start the approval process as soon as we receive order confirmation. From
  confirmation till 10 days before installation, a nominal cancellation charge of INR 25,000
  or 5% of system cost, whichever is higher.
  • Delivery: 2-3 weeks from the date of technically and commercially cleared order.
  • Force Majeure clause applies.
  • Include leasing charges.`
  });

  const [, setProposals] = useState<Proposal[]>([]);
  const [, setServices] = useState<Service[]>([]);
  const [, setProducts] = useState<Product[]>([]);

  // State for editing proposal and employee details
  const [editingId, setEditingId] = useState<string | null>(null);

  // Customer and proposal-related states
  // const [customerType, setCustomerType] = useState<CustomerType>();
  const [openPanel, setOpenPanel] = useState(false);
  const [openPanelDialog, setOpenPanelDialog] = useState(false);
  const [newPanelLogo, setNewPanelLogo] = useState<string | null>(null);
  const [newPanelBrand, setNewPanelBrand] = useState("");
  const [, setPanelBrands] = useState<string[]>([]);
  const [openProposal, setOpenPropsal] = useState(false);
  const [openBattery, setOpenBattery] = useState(false);
  const [, setBatteryBrand] = useState<string>('');
  const [batteryBrandList, setBatteryBrandList] = useState<{ name: string; logo?: string }[]>([
    { name: "N/A" },
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
    { name: "N/A" },
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
    "N/A", "Waaree Energies", "Tata Power Solar", "Adani Solar", "Vikram Solar", " Goldi Solar", "Rayzon Solar"
  ]);
  const [newCable, setNewCable] = useState<string>(" ");
  const [openCableDialog, setOpenCableDialog] = useState(false);

  const [graphData, setGraphData] = useState<GraphDatum[]>([]);
  // const chartRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);
  const [openNoteRow, setOpenNoteRow] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [anchorEll, setAnchorEll] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEll);


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
  const tableRef = useRef<HTMLDivElement>(null);


  const handleMenuOpenother = (event: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
    setAnchorEll(event.currentTarget);
    setSelectedRow(rowIndex);
  };

  const handleMenuCloseother = () => {
    setAnchorEll(null);
    setSelectedRow(null);
  };

  const handleAddOtherCharge = () => {
    setProposal((prev) => ({
      ...prev,
      otherCharges: [...prev.otherCharges, { description: "", price: 0, quantity: 0 }],
    }));
    handleMenuCloseother();
  };

  const handleDeleteOtherCharge = (index: number) => {
    setProposal((prev) => ({
      ...prev,
      otherCharges: prev.otherCharges.filter((_, i) => i !== index),
    }));
    handleMenuCloseother();
  };

// Handler for updating otherCharges
const handleOtherChargeChange = <K extends keyof OtherCharge>(
  index: number,
  field: K,
  value: OtherCharge[K]
) => {
  setProposal((prev) => {
    const updated = [...prev.otherCharges]; // copy array
    updated[index] = { ...updated[index], [field]: value }; // update field
    return { ...prev, otherCharges: updated };
  });
};

  

  useEffect(() => {
    const { rows = [], otherCharges = [], gst = 0 } = proposal;
  
    const subtotal = rows.reduce((acc, r) => acc + (r.price || 0) * (r.quantity || 0), 0);
    const otherChargesTotal = otherCharges.reduce((acc, oc) => acc + (oc.price || 0) * (oc.quantity || 0), 0);
    const gstAmount = (subtotal * gst) / 100;
    const total = subtotal + otherChargesTotal + gstAmount;
  
    setProposal((prev) => ({ ...prev, subtotal, gstAmount, total }));
  }, [proposal.rows, proposal.otherCharges, proposal.gst]);
  
  // Convert number to words
  const numberToWords = (num: number) => {
    return toWords(num)
      .replace(/(^|\s)([a-z])/g, (match) => match.toUpperCase()) + " Rupees";
  };

  // Row actions
  const handleRowChange = <K extends keyof RowType>(
    index: number,
    field: K,
    value: RowType[K]
  ) => {
    setProposal((prev) => {
      const updatedRows = [...prev.rows];
      updatedRows[index][field] = value;
      return { ...prev, rows: updatedRows };
    });
  };

  const handleAddRowBelow = () => {
    if (menuRowIndex === null) return;
    const newRow: RowType = { description: "", price: 0, quantity: 0, note: "", otherCharges: 0 };
    setProposal((prev) => {
      const updatedRows = [
        ...prev.rows.slice(0, menuRowIndex + 1),
        newRow,
        ...prev.rows.slice(menuRowIndex + 1),
      ];
      return { ...prev, rows: updatedRows };
    });
    handleMenuClose();
  };

  const handleDeleteRow = () => {
    if (menuRowIndex === null) return;
    setProposal((prev) => {
      const updatedRows = prev.rows.filter((_, i) => i !== menuRowIndex);
      return { ...prev, rows: updatedRows };
    });
    handleMenuClose();
  };

  const handleDeleteNote = () => {
    if (menuRowIndex === null) return;
    handleRowChange(menuRowIndex, "note", "");
    setOpenNoteRow(null);
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setMenuRowIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowIndex(null);
  };

  // Fetch proposals along with master data
  useEffect(() => {
    fetchProposals();
    fetchMasterData();
  }, []);

  // ---------------------
  // Save Graph Snapshot
  // ---------------------
  // const handleSaveGraph = async (proposal: Proposal) => {
  //   if (!graphRef.current) {
  //     toast.error("Graph element not found");
  //     return;
  //   }

  //   try {
  //     const canvas = await html2canvas(graphRef.current);
  //     const dataUrl = canvas.toDataURL("image/png");

  //     proposal.graphimage = dataUrl;

  //     // toast.info("📤 Uploading graph...");

  //     const res = await fetch(
  //       `http://localhost:5000/api/proposal/${proposal.id}/uploadGraph`, 
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ image: dataUrl }),
  //       }
  //     );

  //     if (!res.ok) {
  //       const errorText = await res.text();
  //       throw new Error(`Upload failed: ${res.status} ${errorText}`);
  //     }

  //     const json = await res.json();
  //     console.log("📌 Graph saved:", json);

  //     toast.success("✅ Graph Image Saved");
  //   } catch (err: any) {
  //     console.error("❌ handleSaveGraph Error:", err);
  //     // toast.error(`Failed to save graph: ${err.message}`);
  //   }
  // };


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

    // Ensure rows array exists
    const currentProposal: Proposal = {
      ...proposal,
      rows: proposal.rows || [],  
      gst: proposal.gst || 0,
      subtotal: proposal.subtotal || 0,
      gstAmount: proposal.gstAmount || 0,
      total: proposal.total || 0,
      otherCharges: proposal.otherCharges || [],
    };

    // 1️⃣ Required fields check
    const requiredFields: (keyof Proposal)[] = [
      "clientName",
      "clientPhone",
      "clientAddress",
      "clienttitle",
      "customerType",
      "projectsize",
      "consumption",
      "electricity",
      "generation",
      "warranty",
      "batterytype",
      "quantity",
    ];

    const missingFields = requiredFields.filter((field) => !currentProposal[field]);
    if (missingFields.length > 0) {
      toast.error(`❌ Please fill all required fields: ${missingFields.join(", ")}`);
      return;
    }

    try {
      let savedProposal: Proposal;

      // 2️⃣ Add new proposal
      if (!editingId) {
        const res = await axios.post(
          (`${import.meta.env.VITE_API_URL}/api/proposal/add-proposal`),
          // `http://localhost:5000/api/proposal/add-proposal`,
          currentProposal
        );

        savedProposal = res.data.proposal;
        setEditingId(savedProposal._id ?? null);
        toast.success("✅ Proposal added");
      } else {
        // 3️⃣ Update existing proposal
        // const res = await axios.put(
        //   `http://localhost:5000/api/proposal/${editingId}`,
        //   currentProposal
        // );

        savedProposal = { ...currentProposal, _id: editingId };
        toast.success("✅ Proposal updated");
      }

      // 4️⃣ Reset non-essential fields, **keep rows and totals**
      setProposal((_prev) => ({
        ...savedProposal,
        rows: savedProposal.rows,          // keep all rows
        gst: savedProposal.gst,
        subtotal: savedProposal.subtotal,
        gstAmount: savedProposal.gstAmount,
        total: savedProposal.total,
        otherCharges: savedProposal.otherCharges,
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
  4. Installation of monitoring and controlling system for solar plant.
  5. Commissioning of Solar Power Plant and supply of Power to LT panel of SGD.
  6. Zero Export Device installation.`,
        customerScope: `1. Providing safe storage place for material during installation & commissioning period.
  2. Provide space to evacuate the solar power.
  3. Design/Drawing approval within 7 days.`,
      }));

      setEditingId(null);

      // 5️⃣ Refresh proposal list
      fetchProposals();
    } catch (err: any) {
      toast.error(
        "❌ " + (err.response?.data?.error || err.message || "Something went wrong")
      );
    }
  };



  const handleCapture = async (proposal: Proposal) => {
    const proposalId = proposal._id ?? proposal._id;
    if (!proposalId) {
      toast.error("❌ Proposal ID missing. Save the proposal first.");
      return;
    }

    if (!tableRef.current) return;

    const canvas = await html2canvas(tableRef.current);
    const dataUrl = canvas.toDataURL("image/png");

    toast.info("📤 Uploading table...");

    const res = await fetch(
      (`${import.meta.env.VITE_API_URL}/api/proposal/${proposalId}/uploadTable`),
      // `http://localhost:5000/api/proposal/${proposalId}/uploadTable`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${res.status} ${errorText}`);
    }

    const { file } = await res.json();
    proposal.tableImage =
      (`${import.meta.env.VITE_API_URL}/uploads/${file}`),
      // `http://localhost:5000/uploads/${file}`;
      toast.success("✅ Table Image Saved");
  };

  const handleAddPanelBrand = () => {
    if (newPanelBrand.trim() && !brands.some((b) => b.name === newPanelBrand)) {
      setBrands([...brands, { name: newPanelBrand, logo: newPanelLogo || undefined }]);
      setPanelBrands((prev) => [...prev, newPanelBrand]);
    }
    setNewPanelBrand("");
    setNewPanelLogo(null);
    setOpenPanelDialog(false);
  };

  const handlePanelLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPanelLogo(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
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

            <Stack spacing={4}>
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
              <div className="flex flex-col gap-8">
                <TextField
                  label="Yearly consumption (Units)"
                  placeholder="e.g: 2400 KWh"
                  variant="filled"
                  value={proposal.consumption}
                  onChange={(e) => setProposal({ ...proposal, consumption: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Yearly generation in KWh"
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

                    <Stack spacing={4}>
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="panel-brand-label">Panel Brand</InputLabel>
                        <Select
                          labelId="panel-brand-label"
                          value={proposal.panelBrands || ""}
                          onChange={(e) =>
                            setProposal({ ...proposal, panelBrands: e.target.value as string[] })
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
                      {/* Button to open dialog */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenPanelDialog(true)}
                        sx={{
                          mt: 2,
                          width: "auto",
                          alignSelf: "flex-start",
                        }}
                      >
                        ➕ Add Panel Brand
                      </Button>

                      <Dialog open={openPanelDialog} onClose={() => setOpenPanelDialog(false)}>
                        <DialogTitle>Add Panel Brand</DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Brand Name"
                            fullWidth
                            value={newPanelBrand}
                            onChange={(e) => setNewPanelBrand(e.target.value)}
                          />
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                            <input
                              accept="image/*"
                              id="upload-logo"
                              type="file"
                              style={{ display: "none" }}
                              onChange={handlePanelLogoUpload}
                            />
                            <label htmlFor="upload-logo">
                              <Button variant="contained" component="span" startIcon={<UploadIcon />}>
                                Upload Logo
                              </Button>
                            </label>
                            {newPanelLogo && (
                              <Avatar
                                src={newPanelLogo}
                                alt="preview"
                                sx={{ width: 50, height: 50, border: "2px solid #1976d2" }}
                              />
                            )}
                          </Stack>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpenPanelDialog(false)}>Cancel</Button>
                          <Button onClick={handleAddPanelBrand} variant="contained" color="success">
                            Add
                          </Button>
                        </DialogActions>
                      </Dialog>

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
                          <MenuItem value="Mono-Perc">Mono-Perc</MenuItem>
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
                    <Stack spacing={4}>
                      {/* ✅ Inverter Brands (multiple select) */}
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="invertor-brand-label">Select Inverter Brands</InputLabel>
                        <Select
                          labelId="invertor-brand-label"
                          multiple={false}
                          value=""
                          onChange={(e) => {
                            const selectedBrand = e.target.value as string;
                            const currentBrands = proposal.invertorBrands as string[] || [];

                            if (!currentBrands.includes(selectedBrand)) {
                              setProposal({
                                ...proposal,
                                invertorBrands: [...currentBrands, selectedBrand],
                              });
                            }
                          }}
                          renderValue={() => (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {(proposal.invertorBrands as string[] | undefined)?.map((value) => {
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
                              <Button variant="contained" component="span" startIcon={<UploadIcon />}>
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
                    <Stack spacing={4}>
                      <div>
                        {/* Select Battery Brands */}
                        <FormControl fullWidth variant="filled">
                          <InputLabel id="battery-brand-label">Select Battery Brand</InputLabel>
                          <Select
                            labelId="battery-brand-label"
                            value={proposal.batteryBrands || ""} // must match the selected string
                            onChange={(e) => {
                              const selected = e.target.value as string;
                              setProposal({ ...proposal, batteryBrands: selected }); // update proposal state
                            }}
                            renderValue={(selected) => {
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
                            {batteryBrandList.map((brand) => (
                              <MenuItem key={brand.name} value={brand.name}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  {brand.logo && <Avatar src={brand.logo} alt={brand.name} sx={{ width: 24, height: 24 }} />}
                                  <span>{brand.name}</span>
                                </Stack>
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

                      <Box sx={{ width: "100%", mx: "auto", mt: 4 }}>
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
                      <TextField
                        label="Battery Warranty"
                        placeholder="e.g: 12"
                        variant="filled"
                        value={proposal.batterywarranty || ""}
                        onChange={(e) =>
                          setProposal({ ...proposal, batterywarranty: e.target.value })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Battery Quantity"
                        placeholder="e.g: 12"
                        variant="filled"
                        value={proposal.batteryquantity || ""}
                        onChange={(e) =>
                          setProposal({ ...proposal, batteryquantity: e.target.value })
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

                    <Stack spacing={4}>
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
                    mt: 5,
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
                <Stack spacing={2}>
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
                  {/* table  */}
                  <div>
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
                        {/* Product Rows */}
                        {proposal.rows.map((row, index) => (
                          <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "#f0f6ff" : "white" }}>
                            <TableCell width={50}>
                              <IconButton onClick={(e) => handleMenuOpen(e, index)}>
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <TextField
                                variant="standard"
                                fullWidth
                                value={row.description}
                                onChange={(e) => handleRowChange(index, "description", e.target.value)}
                                InputProps={{ disableUnderline: true }}
                                placeholder="Description"
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                variant="standard"
                                type="number"
                                fullWidth
                                value={row.price || ""}
                                onChange={(e) => handleRowChange(index, "price", Number(e.target.value) || 0)}
                                InputProps={{ disableUnderline: true, startAdornment: <span>₹</span> }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                variant="standard"
                                type="number"
                                fullWidth
                                value={row.quantity || ""}
                                onChange={(e) => handleRowChange(index, "quantity", Number(e.target.value) || 0)}
                                InputProps={{ disableUnderline: true }}
                              />
                            </TableCell>
                            <TableCell>
                              ₹ {((row.price || 0) * (row.quantity || 0)).toLocaleString("en-IN")}
                              {openNoteRow === index && (
                                <TextField
                                  variant="standard"
                                  fullWidth
                                  value={row.note || ""}
                                  onChange={(e) => handleRowChange(index, "note", e.target.value)}
                                  InputProps={{ disableUnderline: true }}
                                  placeholder="Add note"
                                  sx={{ fontSize: "0.8rem", mt: 0.5 }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* Subtotal */}
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>Subtotal</TableCell>
                          <TableCell>₹ {(proposal.subtotal || 0).toLocaleString("en-IN")}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>

                        {/* GST Row */}
                        <TableRow>
                          <TableCell width={50}>
                            <IconButton onClick={(e) => handleMenuOpenother(e, -1)}>
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>GST %</TableCell>
                          <TableCell>
                            <TextField
                              variant="standard"
                              type="number"
                              value={proposal.gst || ""}
                              onChange={(e) =>
                                setProposal((prev) => ({ ...prev, gst: Number(e.target.value) || 0 }))
                              }
                              InputProps={{ disableUnderline: true }}
                              placeholder="0"
                            />
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            {proposal.gstAmount > 0 ? `₹ ${proposal.gstAmount.toLocaleString("en-IN")}` : ""}
                          </TableCell>
                        </TableRow>


                        {/* Other Charges */}
                        {(proposal.otherCharges ?? []).map((otherCharges, index) => (
                          <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "#f0f6ff" : "white" }}>
                            <TableCell width={50}>
                              <IconButton onClick={(e) => handleMenuOpenother(e, index)}>
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <TextField
                                variant="standard"
                                fullWidth
                                value={otherCharges.description}
                                onChange={(e) => handleOtherChargeChange(index, "description", e.target.value)}
                                InputProps={{ disableUnderline: true }}
                                placeholder="Description"
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                variant="standard"
                                type="number"
                                fullWidth
                                value={otherCharges.price || ""}
                                onChange={(e) => handleOtherChargeChange(index, "price", Number(e.target.value) || 0)}
                                InputProps={{ disableUnderline: true, startAdornment: <span>₹</span> }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                variant="standard"
                                type="number"
                                fullWidth
                                value={otherCharges.quantity || ""}
                                onChange={(e) => handleOtherChargeChange(index, "quantity", Number(e.target.value) || 0)}
                                InputProps={{ disableUnderline: true }}
                              />
                            </TableCell>
                            <TableCell>
                              ₹ {((otherCharges.price || 0) * (otherCharges.quantity || 0)).toLocaleString("en-IN")}
                              {openNoteRow === index && (
                                <TextField
                                  variant="standard"
                                  fullWidth
                                  value={otherCharges.note || ""}
                                  onChange={(e) => handleOtherChargeChange(index, "note", e.target.value)}
                                  InputProps={{ disableUnderline: true }}
                                  placeholder="Add note"
                                  sx={{ fontSize: "0.8rem", mt: 0.5 }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}


                        {/* Total */}
                        <TableRow sx={{ backgroundColor: "#003366" }}>
                          <TableCell></TableCell>
                          <TableCell colSpan={2} align="right" sx={{ color: "white" }}>
                            Total Cost
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell sx={{ color: "white" }}>₹ {(proposal.total || 0).toLocaleString("en-IN")}</TableCell>
                        </TableRow>

                        {/* Amount in Words */}
                        <TableRow sx={{ backgroundColor: "#003366" }}>
                          <TableCell colSpan={5} sx={{ p: 2 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", color: "#fff" }}>
                              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Amount in Words:
                              </Typography>
                              <Typography variant="h6" sx={{ fontSize: 15 }}>
                                {numberToWords(proposal.total || 0)}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    {/* Product Row Menu */}
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                      <MenuItem onClick={handleAddRowBelow}>
                        <AddIcon fontSize="small" /> Add Row Below
                      </MenuItem>
                      <MenuItem onClick={handleDeleteRow}>
                        <DeleteIcon fontSize="small" /> Delete Row
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          if (menuRowIndex !== null)
                            setOpenNoteRow((prev) => (prev === menuRowIndex ? null : menuRowIndex));
                          handleMenuClose();
                        }}
                      >
                        <EditNoteIcon fontSize="small" /> Add/View Note
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDeleteNote();
                          handleMenuClose();
                        }}
                      >
                        <DeleteIcon fontSize="small" /> Delete Note
                      </MenuItem>
                    </Menu>

                    {/* Other Charges Menu */}
                    <Menu anchorEl={anchorEll} open={menuOpen} onClose={handleMenuCloseother}>
                      <MenuItem onClick={handleAddOtherCharge}>Add Other Charge</MenuItem>
                      {selectedRow !== null && selectedRow >= 0 && (
                        <MenuItem onClick={() => handleDeleteOtherCharge(selectedRow)}>Delete Row</MenuItem>
                      )}
                    </Menu>
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
              {(proposal._id || proposal._id) && (
                <button
                  type="button"
                  onClick={() => handleCapture(proposal)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    borderRadius: "6px",
                    marginTop: "1rem",
                  }}
                >
                  Save Table Image
                </button>
              )}
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
              <span>Terms & Condition</span>
              <TextareaAutosize
                maxRows={10}
                aria-label="termandcondition"
                value={proposal.termandcondition}
                onChange={(e) =>
                  setProposal({ ...proposal, termandcondition: e.target.value })
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

