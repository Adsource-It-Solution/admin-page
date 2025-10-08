import { useState, useEffect } from "react";
import { Stack, Card, CardContent, Button, CircularProgress  } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import { toast } from "react-toastify";

import type { Proposal } from "../pages/Proposal";

function RecycleBin() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecycleProposals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/proposal/recycle-bin`);
      setProposals(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch deleted proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecycleProposals();
  }, []);

  const handleRestore = async (id?: string) => {
    if (!id) return;
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/proposal/${id}/restore`);
      toast.success("✅ Proposal restored successfully");
      fetchRecycleProposals();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to restore proposal");
    }
  };

  const handlePermanentDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/proposal/${id}/permanent`);
      toast.success("🗑️ Proposal permanently deleted");
      fetchRecycleProposals();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete proposal");
    }
  };

  return (
    <div className="mx-5 my-5">
      {loading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={2}>
          {proposals.length === 0 && <p className="border border-slate-600 flex justify-center py-3">Recycle Bin is empty.</p>}

          {proposals.map((p, index) => (
            <Card key={p._id}>
              <CardContent className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{p.heading || `Proposal: ${index + 1}`}</h3>
                  <p>Client: {p.clientName}</p>
                  <p>Deleted At: {p.deletedAt ? new Date(p.deletedAt).toLocaleDateString("en-GB") : "N/A"}</p>
                </div>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="success" onClick={() => handleRestore(p._id)}>
                    <RestoreIcon /> Restore
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handlePermanentDelete(p._id)}>
                    <DeleteForeverIcon /> Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </div>
  );
}

export default RecycleBin;
