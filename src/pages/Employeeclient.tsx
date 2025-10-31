import { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";

type Client = {
  _id: string;
  nameemployeeclient: string;
  email: string;
  address: string;
  requirement: string;
  phoneno: string;
  title: string;
  clienttype: string;
  aboutclient: string;
  createdAt: string;
};

type GroupedClients = Record<string, Client[]>;

export default function EmployeeClientsDashboard() {
  const [groupedClients, setGroupedClients] = useState<GroupedClients>({});
  const [loading, setLoading] = useState(true);

const fetchClients = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("accessToken") || localStorage.getItem("adminToken");
    if (!token) {
      toast.error("No access token found. Please log in again.");
      return;
    }

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/employee/employee-clients-by-employee`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setGroupedClients(res.data);
  } catch (err: any) {
    console.error("❌ Error fetching clients:", err);
    toast.error("Failed to load employee clients");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchClients();
  }, []);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
      </Stack>
    );
  }

  const employeeNames = Object.keys(groupedClients);

  if (employeeNames.length === 0) {
    return (
      <Typography align="center" mt={5}>
        ❌ No employees or clients found.
      </Typography>
    );
  }

  return (
    <Stack spacing={3} sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
        👨‍💼 Employee → 👥 Clients Overview
      </Typography>

      {employeeNames.map((employeeName) => {
        const clients = groupedClients[employeeName];
        return (
          <Accordion key={employeeName} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                borderRadius: 2,
              }}
            >
              <Box display="flex" flexDirection="column" width="100%">
                <Typography variant="h6" fontWeight="bold">
                  {employeeName}
                </Typography>
                <Typography variant="body2" color="white">
                  Total Clients: {clients.length}
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ bgcolor: "#fafafa" }}>
              {clients.length === 0 ? (
                <Typography color="text.secondary">
                  No clients added yet.
                </Typography>
              ) : (
                <List>
                  {clients.map((client) => (
                    <Box key={client._id}>
                      <ListItem
                        sx={{
                          flexDirection: "column",
                          alignItems: "flex-start",
                          borderBottom: "1px solid #e0e0e0",
                          pb: 1,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {client.title} {client.nameemployeeclient}
                        </Typography>
                        <ListItemText
                          primary={
                            <>
                              <Typography>Email: {client.email}</Typography>
                              <Typography>Phone: {client.phoneno}</Typography>
                              <Typography>
                                Requirement: {client.requirement} KWH
                              </Typography>
                              <Typography>
                                Type: {client.clienttype}
                              </Typography>
                              <Typography>Address: {client.address}</Typography>
                              <Typography color="text.secondary">
                                About: {client.aboutclient}
                              </Typography>
                            </>
                          }
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Added on:{" "}
                          {new Date(client.createdAt).toLocaleDateString()}
                        </Typography>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
