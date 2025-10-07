import { useState, useEffect, useRef, type FormEvent } from "react";
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
  CircularProgress
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
import { useParams } from "react-router-dom";
import { ToWords } from 'to-words';
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UploadIcon from "@mui/icons-material/Upload";
import ClearIcon from '@mui/icons-material/Clear';
import { SolarProposalPDF } from "../components/ProposalPdf";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { fetchBrandsByCategory } from "../utils/brand.api";

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
  note?: string;
  quantityother: number;
  subtotalother: string;
};

export type RowType = {
  description: string;
  price: number;
  subtotalrow: number;
  quantitytable: number;
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
  holder: string;
  accountnumber: string;
  ifsc: string;
  bankname: string;
  date: string;
  heading: string;

  rows: RowType[];
  gst: number;
  subtotal: number;
  gstAmount: number;
  total: number;
  otherCharge: OtherCharge[];

  services: string[];
  products: string[];
  employees: string[];

  tableImage?: string;
  graphimage?: string;

  // [key: string]: string | string[] | number | RowType[] | undefined;
};


type ClientPrefix = "Mr." | "Mrs." | "Ms.";
type CustomerType = "Industrial" | "Commercial" | "Government" | "Residential" | "others";
type PanelType = "Mono" | "Mono-Perc" | "Poly" | "BIVP" | "Mono-Perc Half Cut" | "Mono BiFacial" | "TopCon MonoFacial" | "TopCon BiFacial";
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

const preloadedPanelBrands = [
  { name: "N/A" },
  { name: "Waaree Energies" },
  { name: "Tata Power Solar" },
  { name: "Adani Solar" },
  { name: "Vikram Solar" },
  { name: "Goldi Solar" },
  { name: "Rayzon Solar" }
];

const preloadedInverterBrands = [
  { name: "N/A" },
  { name: "Luminous", logo: "/office.svg" },
  { name: "Tata Power Solar", logo: "/office.svg" },
  { name: "Microtek", logo: "/office.svg" },
  { name: "Su-Kam", logo: "/office.svg" },
  { name: "Delta", logo: "/office.svg" },
  { name: "ABB", logo: "/office.svg" },
  { name: "Schneider Electric", logo: "/office.svg" },
  { name: "Huawei", logo: "/office.svg" }
];

const preloadedBatteryBrands = [
  { name: "N/A" },
  { name: "Luminous", logo: "/office.svg" },
  { name: "Exide", logo: "/office.svg" },
  { name: "Amaron", logo: "/office.svg" },
  { name: "Okaya", logo: "/office.svg" },
  { name: "LG", logo: "/office.svg" },
  { name: "Samsung", logo: "/office.svg" },
  { name: "Panasonic", logo: "/office.svg" },
  { name: "CATL", logo: "/office.svg" },
];

const preloadedCableBrands = [
  { name: "N/A" },
  { name: "Polycab", logo: "/office.svg" },
  { name: "Havells", logo: "/office.svg" },
  { name: "Finolex", logo: "/office.svg" },
  { name: "KEI", logo: "/office.svg" },
  { name: "RR Kabel", logo: "/office.svg" },
  { name: "Syska", logo: "/office.svg" },
  { name: "V-Guard", logo: "/office.svg" },
  { name: "Anchor", logo: "/office.svg" },
];

export default function ProposalPage() {
  const { id } = useParams();
  // const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientAddress: "",
    heading: "",
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
    holder: `SUNMAYO PRIVATE LIMITED`,
    accountnumber: `IDFC FIRST BANK`,
    ifsc: `10223162147`,
    bankname: `IDFB0021005`,
    date: "",

    // tabledata
    rows: [
      { description: "", price: 0, quantitytable: 0, note: "", otherCharges: 0, subtotalrow: 0 },
      { description: "", price: 0, quantitytable: 0, note: "", otherCharges: 0, subtotalrow: 0 },
    ],
    gst: 0,
    subtotal: 0,
    gstAmount: 0,
    total: 0,
    otherCharge: [{ description: "", price: 0, note: "", quantityother: 0, subtotalother: "" }],
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
  • Prices quotes are firm and valid for 10 days from the date of offer. After this period a reconfirmation from our office should be taken.
  • Water supply at site will be provided by customer free of cost during installation and commissioning.
  • Closed, covered, locked stores will be provided by customer during installation and commissioning.
  • We will start the approval process as soon as we receive order confirmation. From confirmation till 10 days before installation, a nominal cancellation charge of INR 25,000 or 5% of system cost, whichever is higher.
  • Delivery: 2-3 weeks from the date of technically and commercially cleared order.
  • Force Majeure clause applies.
  • Include leasing charges.`
  });

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
  const [openProposal, setOpenPropsal] = useState(false);
  const [openBattery, setOpenBattery] = useState(false);

  const LeadAcidSubtype: LeadAcidSubtype[] = ["40Ah", "75Ah", "100Ah", "150Ah", "200Ah"];


  // Invertor and cable brands
  const [openInvertor, setOpenInvertor] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openInvertorDialog, setOpenInvertorDialog] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newLogo, setNewLogo] = useState<string | null>(null);
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

  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);

  const [panelBrands, setPanelBrands] = useState<any[]>([]);
  const [inverterBrands, setInverterBrands] = useState<any[]>([]);
  const [batteryBrands, setBatteryBrands] = useState<any[]>([]);
  const [newBatteryLogo, setNewBatteryLogo] = useState<string | null>(null);
  const [cableBrands, setCableBrands] = useState<any[]>([]);
  const [newCableBrand, setNewCableBrand] = useState("");
  const [newCableLogo, setNewCableLogo] = useState<string | null>(null);


  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [panels, inverters, batteries, cables] = await Promise.all([
          fetchBrandsByCategory("panel"),
          fetchBrandsByCategory("inverter"),
          fetchBrandsByCategory("battery"),
          fetchBrandsByCategory("cable"),
        ]);

        console.log("Fetched panels:", panels);
        console.log("Fetched inverters:", inverters);

        const mergeBrands = (preloaded: any[], backend: any[]) => [
          ...preloaded,
          ...backend.filter((b) => !preloaded.some((p) => p.name === b.name)),
        ];

        setPanelBrands(mergeBrands(preloadedPanelBrands, panels));
        setInverterBrands(mergeBrands(preloadedInverterBrands, inverters));
        setBatteryBrands(mergeBrands(preloadedBatteryBrands, batteries));
        setCableBrands(mergeBrands(preloadedCableBrands, cables));
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };

    fetchAll();
  }, []);




  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [date, setDate] = useState<string>(getToday());


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
      otherCharge: [...prev.otherCharge, { description: "", price: 0, quantityother: 0, subtotalother: "" }],
    }));
    handleMenuCloseother();
  };

  const handleDeleteOtherCharge = (index: number) => {
    setProposal((prev) => ({
      ...prev,
      otherCharge: prev.otherCharge.filter((_, i) => i !== index),
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
      const updated = [...prev.otherCharge];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, otherCharge: updated };
    });
  };



  useEffect(() => {
    const { rows = [], otherCharge = [], gst = 0 } = proposal;

    const subtotal = rows.reduce((acc, r) => acc + (r.price || 0) * (r.quantitytable || 0), 0);
    const otherChargesTotal = otherCharge.reduce((acc, oc) => acc + oc.price, 0);
    const gstAmount = (subtotal * gst) / 100;
    const total = subtotal + otherChargesTotal + gstAmount;

    setProposal((prev) => ({ ...prev, subtotal, gstAmount, total }));
  }, [proposal.rows, proposal.otherCharge, proposal.gst]);

  const toWords = new ToWords({ localeCode: 'en-IN' });


  // Convert number to words
  const numberToWords = (num: number) => {
    return (
      toWords
        .convert(num)
        .replace(/\b[a-z]/g, (char) => char.toUpperCase()) + " Rupees"
    );
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
    const newRow: RowType = { description: "", price: 0, quantitytable: 0, note: "", otherCharges: 0, subtotalrow: 0 };
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

  useEffect(() => {
    if (!id) return;
    const fetchProposal = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/proposal/${id}`);
        setProposal(res.data);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to fetch proposal");
      }
    };
    fetchProposal();
  }, [id]);

  const handleAddOrUpdateProposal = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const currentProposal = {
        ...proposal,
        rows: proposal.rows || [],
        otherCharge: proposal.otherCharge || [],
        date,
      };

      let savedProposal: Proposal;

      if (!editingId) {
        // CREATE
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/proposal/add-proposal`,
          currentProposal
        );
        savedProposal = res.data.proposal;
        toast.success("✅ Proposal added");
        setEditingId(savedProposal._id ?? null);
      } else {
        // UPDATE
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/proposal/${editingId}`,
          currentProposal
        );
        savedProposal = res.data.proposal || { ...currentProposal, _id: editingId };
        toast.success("✅ Proposal updated");
      }

      setProposal((prev) => ({
        ...prev,
        ...savedProposal,
        rows: savedProposal.rows || prev.rows,
        otherCharge: savedProposal.otherCharge || prev.otherCharge,
        gst: savedProposal.gst ?? prev.gst,
        subtotal: savedProposal.subtotal ?? prev.subtotal,
        gstAmount: savedProposal.gstAmount ?? prev.gstAmount,
        total: savedProposal.total ?? prev.total,
      }));

      // navigate("/proposallist");
    } catch (err: any) {
      toast.error("❌ " + (err.response?.data?.error || err.message || "Something went wrong"));
      console.error(err);
    }
  };

  const handleDownloadPdf = async () => {
    if (!editingId) return;

    try {
      setLoadingPdf(true);
      const blob = await pdf(<SolarProposalPDF proposal={proposal} />).toBlob();
      saveAs(blob, `proposal_${editingId}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPdf(false);
    }
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

  // ---- Add Panel Brand ----
  const handleAddPanelBrand = async () => {
    if (!newPanelBrand.trim()) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/brands`, {
        name: newPanelBrand,
        logo: newPanelLogo,
        category: "panel",
      });

      const createdBrand = res.data;

      setPanelBrands((prev) => [...prev, createdBrand]);

      // auto-select the newly added brand
      setProposal((prev: any) => ({
        ...prev,
        panelBrands: [createdBrand.name],
      }));

      // reset form
      setNewPanelBrand("");
      setNewPanelLogo(null);
      setOpenPanelDialog(false);
    } catch (err) {
      console.error("Error adding panel brand", err);
    }
  };


  // Inverter
  const handleinvertorLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setNewLogo(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Add new inverter brand
  const handleAddinvertorBrand = async () => {
    if (!newBrand.trim()) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/brands`, {
        name: newBrand,
        logo: newLogo,
        category: "inverter",
      });
      const created = res.data;

      setInverterBrands((prev) => [...prev, created]);

      setProposal((prev: any) => ({
        ...prev,
        invertorBrands: [created.name],
      }));

      setNewBrand("");
      setNewLogo(null);
      setOpenInvertorDialog(false);
    } catch (err) {
      console.error("Error adding inverter brand", err);
    }
  };

  const handleDeleteBrand = (brandToRemove: string) => {
    setProposal((prev: any) => ({
      ...prev,
      invertorBrands: (prev.invertorBrands || []).filter(
        (b: string) => b !== brandToRemove
      ),
    }));
  };

  const handleBatteryLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setNewLogo(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Add new battery brand
  const handleAddBatteryBrand = async () => {
    if (!newBrand.trim()) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/brands`, {
        name: newBrand,
        logo: newBatteryLogo,
        category: "battery",
      });
      const created = res.data;

      setBatteryBrands((prev) => [...prev, created]);

      setProposal((prev: any) => ({
        ...prev,
        batteryBrand: created.name,
      }));

      setNewBrand("");
      setNewBatteryLogo(null);
      setOpenDialog(false);
    } catch (err) {
      console.error("Error adding battery brand", err);
    }
  };


  const handleCableLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCableLogo(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Add new cable brand
  const handleAddCableBrand = async () => {
    if (!newCableBrand.trim()) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/brands`, {
        name: newCableBrand,
        logo: newCableLogo,
        category: "cable",
      });

      const created = res.data;
      setCableBrands((prev) => [...prev, created]);

      // auto-select
      setProposal((prev: any) => ({
        ...prev,
        cableBrands: [created.name],
      }));

      // reset
      setNewCableBrand("");
      setNewCableLogo(null);
      setOpenCableDialog(false);
    } catch (err) {
      console.error("Error adding cable brand", err);
    }
  };

  return (
    <Stack spacing={5} sx={{ maxWidth: 900, margin: "auto", mt: 5 }}>
      {/* Add Proposal Form */}
      <Card>
        <h1 className="text-3xl flex justify-center font-bold">📑 Add Proposal</h1>
        <CardContent>
          <form onSubmit={handleAddOrUpdateProposal}>

            <Stack spacing={4}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <TextField
                  label="Select Date"
                  type="date"
                  value={date}
                  variant="filled"
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ width: 200 }}
                />
              </Box>
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
                      <TextField
                        select
                        label="Panel Brand"
                        value={proposal.panelBrands?.[0] || ""}
                        onChange={(e) =>
                          setProposal((prev) => ({
                            ...prev,
                            panelBrands: [e.target.value],
                          }))
                        }
                        fullWidth
                      >
                        {panelBrands.length === 0 ? (
                          <MenuItem disabled>Loading...</MenuItem>
                        ) : (
                          panelBrands.map((b) => (
                            <MenuItem
                              key={b._id}
                              value={b.name}
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                            >
                              <div style={{ display: "flex", alignItems: "center" }}>
                                {b.logo && (
                                  <img
                                    src={b.logo}
                                    alt={b.name}
                                    style={{ width: 20, height: 20, marginRight: 8 }}
                                  />
                                )}
                                {b.name}
                              </div>

                              <IconButton
                                size="small"
                                edge="end"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete brand "${b.name}"?`)) {
                                    await axios.delete(`${import.meta.env.VITE_API_URL}/brands/${b._id}`);
                                    setPanelBrands((prev) => prev.filter((item) => item._id !== b._id));
                                    if (proposal.panelBrands?.[0] === b.name) {
                                      setProposal((prev) => ({ ...prev, panelBrands: [""] }));
                                    }
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </MenuItem>
                          ))
                        )}
                      </TextField>



                      {/* Add Button */}
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenPanelDialog(true)}
                        sx={{ mt: 2, width: "auto", alignSelf: "flex-start" }}
                      >
                        ➕ Add Panel Brand
                      </Button>

                      {/* Add Dialog */}
                      <Dialog
                        open={openPanelDialog}
                        onClose={() => setOpenPanelDialog(false)}
                        fullWidth
                        maxWidth="sm"
                      >
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
                            {/* Hidden File Input */}
                            <input
                              accept="image/*"
                              id="upload-panel-logo"
                              type="file"
                              style={{ display: "none" }}
                              onChange={handlePanelLogoUpload}
                            />

                            {/* Label wraps the Button */}
                            <label htmlFor="upload-panel-logo">
                              <Button
                                variant="contained"
                                component="span"
                                startIcon={<UploadIcon />}
                              >
                                Upload Logo
                              </Button>
                            </label>

                            {/* Preview Avatar */}
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
                          <Button type="button" onClick={() => setOpenPanelDialog(false)}>Cancel</Button>
                          <Button
                            onClick={handleAddPanelBrand}
                            variant="contained"
                            color="success"
                            type="button"
                          >
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
                          <MenuItem value="Mono-Perc Half Cut">Mono-Perc Half Cut</MenuItem>
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
                      <TextField
                        select
                        label="Invertor Brand"
                        value={proposal.invertorBrands?.[0] || ""}
                        onChange={(e) =>
                          setProposal((prev: any) => ({
                            ...prev,
                            invertorBrands: [e.target.value],
                          }))
                        }
                        fullWidth
                      >
                        {inverterBrands.length === 0 ? (
                          <MenuItem disabled>Loading...</MenuItem>
                        ) : (
                          inverterBrands.map((b) => (
                            <MenuItem
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                              key={b._id} value={b.name}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                {b.logo && (
                                  <img
                                    src={b.logo}
                                    alt={b.name}
                                    style={{ width: 20, height: 20, marginRight: 8 }}
                                  />
                                )}
                                {b.name}
                              </div>

                              <IconButton
                                size="small"
                                edge="end"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete brand "${b.name}"?`)) {
                                    await axios.delete(`${import.meta.env.VITE_API_URL}/brands/${b._id}`);
                                    setInverterBrands((prev) => prev.filter((item) => item._id !== b._id));
                                    if (proposal.invertorBrands?.[0] === b.name) {
                                      setProposal((prev) => ({ ...prev, invertorBrands: [""] }));
                                    }
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </MenuItem>
                          ))
                        )}
                      </TextField>


                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenInvertorDialog(true)}
                        sx={{ mt: 2, width: "auto", alignSelf: "flex-start" }}
                      >
                        ➕ Add Inverter Brand
                      </Button>

                      <Dialog open={openInvertorDialog} onClose={() => setOpenInvertorDialog(false)} fullWidth maxWidth="sm">
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
                            {/* Hidden File Input */}
                            <input
                              accept="image/*"
                              id="upload-invertor-logo"
                              type="file"
                              style={{ display: "none" }}
                              onChange={handleinvertorLogoUpload}
                            />

                            {/* Label wraps the Button */}
                            <label htmlFor="upload-invertor-logo">
                              <Button
                                variant="contained"
                                component="span"
                                startIcon={<UploadIcon />}
                              >
                                Upload Logo
                              </Button>
                            </label>

                            {/* Preview Avatar */}
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
                          <Button type="button" onClick={() => setOpenInvertorDialog(false)}>Cancel</Button>
                          <Button type="button" onClick={handleAddinvertorBrand} variant="contained" color="success">
                            Add
                          </Button>
                        </DialogActions>
                      </Dialog>

                      <Box sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
                        <h3>Selected Inverter Brands:</h3>
                        <Stack direction="column" spacing={2}>
                          {(proposal.invertorBrands as string[] | undefined)?.map((brandName) => {
                            const brand = inverterBrands.find((b) => b.name === brandName);
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
                                <IconButton
                                  type="button"
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
                        <TextField
                          select
                          label="Battery Brand"
                          value={proposal.batteryBrands || ""}
                          onChange={(e) => setProposal((prev) => ({ ...prev, batteryBrands: e.target.value }))}
                          fullWidth
                        >
                          {batteryBrands.map((b) => (
                            <MenuItem
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                              key={b._id} value={b.name}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                {b.logo && (
                                  <img
                                    src={b.logo}
                                    alt={b.name}
                                    style={{ width: 20, height: 20, marginRight: 8 }}
                                  />
                                )}
                                {b.name}
                              </div>
                              <IconButton
                                size="small"
                                edge="end"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete brand "${b.name}"?`)) {
                                    await axios.delete(`${import.meta.env.VITE_API_URL}/brands/${b._id}`);
                                    setBatteryBrands((prev) => prev.filter((item) => item._id !== b._id));
                                    if (proposal.batteryBrands?.[0] === b.name) {
                                      setProposal((prev) => ({ ...prev, batteryBrands: "" }));
                                    }
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </MenuItem>
                          ))}
                        </TextField>

                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={() => setOpenDialog(true)}
                          sx={{ mt: 2, width: "auto", alignSelf: "flex-start" }}
                        >
                          ➕ Add Battery Brand
                        </Button>

                        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                          <DialogTitle>Add Battery Brand</DialogTitle>
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
                              {/* Hidden File Input */}
                              <input
                                accept="image/*"
                                id="upload-battery-logo"
                                type="file"
                                style={{ display: "none" }}
                                onChange={handleBatteryLogoUpload}
                              />

                              {/* Label wraps the Button */}
                              <label htmlFor="upload-battery-logo">
                                <Button
                                  variant="contained"
                                  component="span"
                                  startIcon={<UploadIcon />}
                                >
                                  Upload Logo
                                </Button>
                              </label>

                              {/* Preview Avatar */}
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
                            <Button type="button" onClick={() => setOpenDialog(false)}>Cancel</Button>
                            <Button type="button" onClick={handleAddBatteryBrand} variant="contained" color="success">
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


                      <TextField
                        select
                        label="Cable Brand"
                        value={proposal.cableBrands?.[0] || ""}
                        onChange={(e) =>
                          setProposal((prev: any) => ({
                            ...prev,
                            cableBrands: [e.target.value],
                          }))
                        }
                        fullWidth
                      >
                        {cableBrands.length === 0 ? (
                          <MenuItem disabled>Loading...</MenuItem>
                        ) : (
                          cableBrands.map((b) => (
                            <MenuItem
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                              key={b._id} value={b.name}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                {b.logo && (
                                  <img
                                    src={b.logo}
                                    alt={b.name}
                                    style={{ width: 20, height: 20, marginRight: 8 }}
                                  />
                                )}
                                {b.name}
                              </div>
                              <IconButton
                                size="small"
                                edge="end"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete brand "${b.name}"?`)) {
                                    await axios.delete(`${import.meta.env.VITE_API_URL}/brands/${b._id}`);
                                    setCableBrands((prev) => prev.filter((item) => item._id !== b._id));
                                    if (proposal.cableBrands?.[0] === b.name) {
                                      setProposal((prev) => ({ ...prev, cableBrands: "" }));
                                    }
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </MenuItem>
                          ))
                        )}
                      </TextField>

                      {/* Add Button */}
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenCableDialog(true)}
                        sx={{ mt: 2, width: "auto", alignSelf: "flex-start" }}
                      >
                        ➕ Add Cable Brand
                      </Button>

                      {/* Add Dialog */}
                      <Dialog
                        open={openCableDialog}
                        onClose={() => setOpenCableDialog(false)}
                        fullWidth
                        maxWidth="sm"
                      >
                        <DialogTitle>Add Cable Brand</DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Brand Name"
                            fullWidth
                            value={newCableBrand}
                            onChange={(e) => setNewCableBrand(e.target.value)}
                          />
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                            {/* Hidden File Input */}
                            <input
                              accept="image/*"
                              id="upload-cable-logo"
                              type="file"
                              style={{ display: "none" }}
                              onChange={handleCableLogoUpload}
                            />

                            {/* Label wraps the Button */}
                            <label htmlFor="upload-cable-logo">
                              <Button
                                variant="contained"
                                component="span"
                                startIcon={<UploadIcon />}
                              >
                                Upload Logo
                              </Button>
                            </label>

                            {/* Preview Avatar */}
                            {newCableLogo && (
                              <Avatar
                                src={newCableLogo}
                                alt="preview"
                                sx={{ width: 50, height: 50, border: "2px solid #1976d2" }}
                              />
                            )}
                          </Stack>

                        </DialogContent>
                        <DialogActions>
                          <Button type="button" onClick={() => setOpenCableDialog(false)}>Cancel</Button>
                          <Button
                            type="button"
                            onClick={handleAddCableBrand}
                            variant="contained"
                            color="success"
                          >
                            Add
                          </Button>
                        </DialogActions>
                      </Dialog>


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
                              <IconButton type="button" onClick={(e) => handleMenuOpen(e, index)}>
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
                                placeholder="Qty"
                                fullWidth
                                value={row.quantitytable || ""}
                                onChange={(e) => handleRowChange(index, "quantitytable", Number(e.target.value) || 0)}
                                InputProps={{ disableUnderline: true }}
                              />
                            </TableCell>
                            <TableCell>
                              ₹ {((row.price || 0) * (row.quantitytable || 0)).toLocaleString("en-IN")}
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
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell>₹ {(proposal.subtotal || 0).toLocaleString("en-IN")}</TableCell>
                        </TableRow>

                        {/* GST Row */}
                        <TableRow>
                          <TableCell width={50}>
                            <IconButton type="button" onClick={(e) => handleMenuOpenother(e, -1)}>
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
                        {(proposal.otherCharge ?? []).map((otherCharges, index) => (
                          <TableRow
                            key={index}
                            sx={{ backgroundColor: index % 2 === 0 ? "#f0f6ff" : "white" }}
                          >
                            <TableCell width={50}>
                              <IconButton type="button" onClick={(e) => handleMenuOpenother(e, index)}>
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>

                            {/* Description */}
                            <TableCell>
                              <TextField
                                variant="standard"
                                fullWidth
                                value={otherCharges.description}
                                onChange={(e) =>
                                  handleOtherChargeChange(index, "description", e.target.value)
                                }
                                InputProps={{ disableUnderline: true }}
                                placeholder="Description"
                              />
                            </TableCell>

                            {/* Price */}
                            <TableCell>
                              <TextField
                                variant="standard"
                                type="number"
                                fullWidth
                                value={otherCharges.price || ""}
                                onChange={(e) =>
                                  handleOtherChargeChange(
                                    index,
                                    "price",
                                    Number(e.target.value) || 0
                                  )
                                }
                                InputProps={{ disableUnderline: true, startAdornment: <span>₹</span> }}
                              />
                            </TableCell>

                            {/* Quantity */}
                            <TableCell>
                              <TextField
                                variant="standard"
                                type="number"
                                fullWidth
                                value={otherCharges.quantityother || ""}
                                onChange={(e) =>
                                  handleOtherChargeChange(
                                    index,
                                    "quantityother",
                                    Number(e.target.value) || 0
                                  )
                                }
                                InputProps={{ disableUnderline: true }}
                                placeholder="Qty"
                              />
                            </TableCell>

                            {/* Note */}
                            <TableCell>
                              ₹{" "}
                              {(
                                (otherCharges.price || 0) *
                                (otherCharges.quantityother || 0)
                              ).toLocaleString("en-IN")}

                              <TextField
                                variant="standard"
                                fullWidth
                                value={otherCharges.note || ""}
                                onChange={(e) =>
                                  handleOtherChargeChange(index, "note", e.target.value)
                                }
                                InputProps={{ disableUnderline: true }}
                                placeholder="Add note"
                                sx={{ fontSize: "0.8rem", mt: 0.5 }}
                              />
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

                </div>
              </Box>
              <span>Bank Details:  </span>
              <TextField
                label="Bank Name"
                placeholder="Jhon Doe"
                variant="filled"
                value={proposal.bankname}
                onChange={(e) => setProposal({ ...proposal, bankname: e.target.value })}
                fullWidth
              />
              <TextField
                label="Account Holder Name"
                placeholder="Jhon Doe"
                variant="filled"
                value={proposal.holder}
                onChange={(e) => setProposal({ ...proposal, holder: e.target.value })}
                fullWidth
              />
              <TextField
                label="Account Number"
                placeholder="Jhon Doe"
                variant="filled"
                value={proposal.accountnumber}
                onChange={(e) => setProposal({ ...proposal, accountnumber: e.target.value })}
                fullWidth
              />
              <TextField
                label="IFSC Code"
                placeholder="Jhon Doe"
                variant="filled"
                value={proposal.ifsc}
                onChange={(e) => setProposal({ ...proposal, ifsc: e.target.value })}
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

              <div className="flex justify-center">
                <Button type="submit" variant="contained" color="primary">
                  {id ? "Update Proposal" : "Add Proposal"}
                </Button>

                {editingId && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    startIcon={loadingPdf ? <CircularProgress size={20} /> : <PictureAsPdfIcon />}
                    onClick={handleDownloadPdf}
                    sx={{ ml: 2 }}
                  >
                    {loadingPdf ? "Generating PDF..." : "Download PDF"}
                  </Button>
                )}


              </div>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
}

