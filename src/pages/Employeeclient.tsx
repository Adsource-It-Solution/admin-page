import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Stack,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  InputAdornment
} from "@mui/material";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";

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
  updatedAt: string;
  createdBy: string;
  clientId: string;
};

type GroupedClients = Record<string, Client[]>;

export default function EmployeeClientsDashboard() {
  const [groupedClients, setGroupedClients] = useState<GroupedClients>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🆕 search input state

  const fetchClients = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("adminToken");
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

      console.log("📦 API Response Data:", res.data);
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

  // 🧠 Filter employees based on search
  const filteredEmployeeNames = employeeNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Stack spacing={3} sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
        👨‍💼 Employee Clients Overview
      </Typography>

      {/* 🆕 Search Bar */}
      <Box textAlign="left" mb={3}>
        <TextField
          variant="filled"
          label="Search Employee"
          placeholder="Type employee name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "60%",
            maxWidth: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        />
      </Box>


      {filteredEmployeeNames.length === 0 ? (
        <Typography align="center" color="text.secondary">
          🔍 No employees found matching “{searchTerm}”
        </Typography>
      ) : (
        filteredEmployeeNames.map((employeeName) => {
          const clients = groupedClients[employeeName];
          return (
            <Card
              key={employeeName}
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                bgcolor: "#ffffff",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    {employeeName}
                  </Typography>
                }
                subheader={
                  <Typography color="text.secondary">
                    Total Clients: {clients.length}
                  </Typography>
                }
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  py: 2,
                }}
              />

              <CardContent>
                {clients.length === 0 ? (
                  <Typography color="text.secondary">
                    No clients added yet.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {clients.map((client) => (
                      <Box
                        key={client._id}
                        sx={{
                          width: { xs: "100%", sm: "48%", md: "31%" },
                          display: "inline-block",
                          verticalAlign: "top",
                          mb: 2,
                        }}
                      >
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            boxShadow: 2,
                            bgcolor: "#fafafa",
                            "&:hover": { boxShadow: 4, bgcolor: "#f5f5f5" },
                          }}
                        >
                          <CardContent>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              gutterBottom
                            >
                              {client.title
                                ? `${client.title} ${client.nameemployeeclient}`
                                : client.nameemployeeclient}
                            </Typography>

                            <Typography variant="body2">
                              <strong>Client ID:</strong> {client.clientId}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Email:</strong> {client.email}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Phone:</strong> {client.phoneno}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Requirement:</strong> {client.requirement}{" "}
                              KWH
                            </Typography>
                            <Typography variant="body2">
                              <strong>Type:</strong> {client.clienttype}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Address:</strong> {client.address}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>About:</strong> {client.aboutclient}
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="caption" color="text.secondary">
                              <strong>Created By:</strong> {client.createdBy}
                            </Typography>
                            <Typography variant="caption" display="block">
                              <strong>Created:</strong>{" "}
                              {new Date(client.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" display="block">
                              <strong>Updated:</strong>{" "}
                              {new Date(client.updatedAt).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </Stack>
  );
}
