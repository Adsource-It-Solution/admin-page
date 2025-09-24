import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import {
  Stack,
  Card,
  CardContent,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// Import your Proposal type
import type { Proposal } from "../pages/Proposal"; // adjust path

// Import your PDF template
import { SolarProposalPDF } from "./ProposalPdf"; // adjust path

function ProposalList() {
  // const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingPdf, setLoadingPdf] = useState<string | null>(null);

  // Fetch proposals from backend
  const fetchProposals = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/proposal/proposals`,
        // "http://localhost:5000/api/proposal/proposals"
      );
      setProposals(res.data);
    } catch {
      toast.error("❌ Failed to fetch proposals");
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // Delete a proposal
  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/proposal/${id}`);
      //  await axios.delete(`http://localhost:5000/api/proposal/${id}`);
  
      fetchProposals();
      toast.success("🗑️ Proposal deleted");
    } catch {
      toast.error("❌ Failed to delete proposal");
    }
  };
  

  // Edit a proposal
  // const handleEditClick = (p: Proposal) => {
  //   navigate(`/proposal/${p._id}`);
  // };

  // Generate & download PDF in frontend using @react-pdf/renderer
  const handleDownloadPdf = async (proposal: Proposal) => {
    try {
      setLoadingPdf(proposal._id || null);

      // Generate PDF document as Blo
      const blob = await pdf(<SolarProposalPDF proposal={proposal} />).toBlob();

      // Use FileSaver to trigger download
      saveAs(blob, `proposal_${proposal._id}.pdf`);

      toast.success("✅ PDF generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to generate PDF");
    } finally {
      setLoadingPdf(null);
    }
  };

  return (
    <div className="mx-5 my-5">
      <Stack spacing={2}>
      {/* <div>
          <input type="search" name="search-proposal"
           id="search-proposal"
            placeholder="Search the proposal"
             className="px-10 py-5 rounded-xl mx-3 border border-slate-600" />
        </div> */}
        {proposals.length === 0 && (
          <p className="border border-slate-600 flex justify-center py-3">
            ❌ No proposals added yet.
          </p>
        )}
        {proposals.map((p) => (
          <Card key={p._id}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <div>
                  <h3 className="font-bold text-lg">{p.clientName}</h3>
                  <p>
                    Phone no.:{" "}
                    <span className="text-base font-semibold">{p.clientPhone}</span>
                  </p>
                  <p>
                    Email:{" "}
                    <span className="text-base font-semibold">{p.clientEmail}</span>
                  </p>
                  <p>
                    Address:{" "}
                    <span className="text-base font-semibold">{p.clientAddress}</span>
                  </p>
                  <p className="text-lg">✅ Proposal Created!</p>
                </div>
                <Stack direction="row" spacing={4}>
                  <IconButton
                    color="primary"
                    onClick={() => handleDownloadPdf(p)}
                    disabled={loadingPdf === p._id}
                  >
                    {loadingPdf === p._id ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <PictureAsPdfIcon />
                    )}
                  </IconButton>
                  {/* <IconButton color="primary" onClick={() => handleEditClick(p)}>
                    <EditIcon />
                  </IconButton> */}
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
    </div>
  );
}

export default ProposalList;
