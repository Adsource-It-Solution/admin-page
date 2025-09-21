import { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import {
    Stack,
    Card,
    CardContent,
    Button,
    IconButton,
    CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-toastify";

// import your Proposal type
import type { Proposal } from "../pages/Proposal"; // adjust path

function ProposalList() {
    const navigate = useNavigate()
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loadingPdf, setLoadingPdf] = useState<string | null>(null);


    // Fetch proposals from backend
    const fetchProposals = async () => {
        try {
            // const res = await axios.get("http://localhost:5000/api/proposal/proposals");
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/proposal/proposals`);
            setProposals(res.data);
        } catch {
            toast.error("❌ Failed to fetch proposals");
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const handleDelete = async (id?: string) => {
        if (!id) return;
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/proposal/${id}`,
                // `http://localhost:5000/api/proposal/${id}`
            );
            fetchProposals();
            toast.success("🗑️ Proposal deleted");
        } catch {
            toast.error("❌ Failed to delete proposal");
        }
    };

    const handleEditClick = (p: Proposal) => {
        navigate(`/proposal/edit/${p._id}`);
      };
      

    const handleDownloadPdf = async (id?: string) => {
        if (!id) return;
        try {
            setLoadingPdf(id);
            const res = await axios.get(
                // `http://localhost:5000/api/proposal/${id}/pdf`,
                `${import.meta.env.VITE_API_URL}/api/proposal/${id}/pdf`,
                { responseType: "blob" }
            );

            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            // Open in new tab or force download
            const newWindow = window.open(url, "_blank");
            if (!newWindow) {
                const link = document.createElement("a");
                link.href = url;
                link.download = `proposal_${id}.pdf`;
                document.body.appendChild(link);
                link.click();
                link.remove();
            }

            setTimeout(() => window.URL.revokeObjectURL(url), 100);
            toast.success("✅ PDF ready");
        } catch (err) {
            console.error("PDF download error:", err);
            toast.error("❌ Failed to download PDF");
        } finally {
            setLoadingPdf(null);
        }
    };

    return (
        <div className="mx-5 my-5">
            <Stack spacing={2}>
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
                                    <IconButton color="primary" onClick={() => handleEditClick(p)}>
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
        </div>
    );
}

export default ProposalList;
