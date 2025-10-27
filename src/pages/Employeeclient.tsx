import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
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
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/service/employee-clients-by-employee`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGroupedClients(res.data);
    } catch (err) {
      toast.error("❌ Failed to load employee clients");
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
        ❌ No clients found.
      </Typography>
    );
  }

  return (
    <Stack spacing={4} sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
        👥 Employee Clients Overview
      </Typography>

      {employeeNames.map((employeeName) => {
        const clients = groupedClients[employeeName];
        return (
          <Card key={employeeName} sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              {/* Employee Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {employeeName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Clients: {clients.length}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Clients List */}
              <List>
                {clients.map((client) => (
                  <ListItem
                    key={client._id}
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                      flexDirection: "column",
                      alignItems: "flex-start",
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
                          <Typography>Requirement: {client.requirement} KWH</Typography>
                          <Typography>Type: {client.clienttype}</Typography>
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
                      sx={{ mt: 1 }}
                    >
                      Added on:{" "}
                      {new Date(client.createdAt).toLocaleDateString()}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

