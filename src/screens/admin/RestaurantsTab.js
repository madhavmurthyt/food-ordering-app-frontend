import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import AddIcon from "@mui/icons-material/Add";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Config from "../../common/utils/Config";
import { getAccessToken } from "../../common/utils/AuthGuard";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CreateRestaurantDialog from "./CreateRestaurantDialog";
import MenuItemsPanel from "./MenuItemsPanel";
import CsvImportDialog from "./CsvImportDialog";

export default function RestaurantsTab() {
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [snack, setSnack] = useState({ open: false, message: "" });
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [importOpen, setImportOpen] = useState(false);
    const rowsPerPage = 20;

    const fetchRestaurants = useCallback(() => {
        setLoading(true);
        let uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Admin Restaurants").uri +
            `?page=${page}&size=${rowsPerPage}`;
        if (statusFilter !== "ALL") uri += `&status=${statusFilter}`;
        fetch(uri, {
            headers: {
                Accept: "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
        })
            .then((res) => {
                if (!res.ok) throw res;
                return res.json();
            })
            .then((data) => {
                setRestaurants(data.restaurants || []);
                setTotal(data.total || 0);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page, statusFilter]);

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    const changeStatus = (restaurant, newStatus) => {
        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Admin Restaurant Status").uri +
            `/${restaurant.id}/status`;
        fetch(uri, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
            body: JSON.stringify({ status: newStatus }),
        })
            .then((res) => {
                if (!res.ok) throw res;
                return res.json();
            })
            .then(() => {
                setSnack({ open: true, message: `Restaurant ${newStatus.toLowerCase()}.` });
                fetchRestaurants();
            })
            .catch(() => setSnack({ open: true, message: "Failed to update status." }));
    };

    const toggleStatus = (restaurant) => {
        changeStatus(restaurant, restaurant.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE");
    };

    const approveRestaurant = (restaurant) => {
        changeStatus(restaurant, "ACTIVE");
    };

    const statusChipColors = (status) => {
        switch (status) {
            case "ACTIVE": return { bgcolor: "#4CAF5014", color: "#4CAF50" };
            case "PENDING": return { bgcolor: "#FF980014", color: "#FF9800" };
            case "SUSPENDED": return { bgcolor: "#E2374414", color: "#E23744" };
            default: return { bgcolor: "#9E9E9E14", color: "#9E9E9E" };
        }
    };

    if (selectedRestaurant) {
        return (
            <MenuItemsPanel
                restaurant={selectedRestaurant}
                onBack={() => setSelectedRestaurant(null)}
            />
        );
    }

    if (loading && restaurants.length === 0) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <TextField
                    select size="small" label="Status"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="SUSPENDED">Suspended</MenuItem>
                </TextField>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="outlined" startIcon={<FileUploadIcon />} onClick={() => setImportOpen(true)}>
                        Import CSV
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
                        Add Restaurant
                    </Button>
                </Box>
            </Box>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Avg Price</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {restaurants.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Typography sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                                            No restaurants found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                restaurants.map((r) => (
                                    <TableRow
                                        key={r.id}
                                        hover
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => setSelectedRestaurant(r)}
                                    >
                                        <TableCell>{r.restaurant_name}</TableCell>
                                        <TableCell>
                                            {r.customer_rating != null
                                                ? `${r.customer_rating.toFixed(1)} (${r.number_of_customers_rated})`
                                                : "—"}
                                        </TableCell>
                                        <TableCell>{"₹"}{r.average_price_for_two}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={r.status}
                                                size="small"
                                                sx={{
                                                    ...statusChipColors(r.status),
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {r.status === "PENDING" ? (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<ThumbUpIcon />}
                                                    onClick={(e) => { e.stopPropagation(); approveRestaurant(r); }}
                                                    sx={{ textTransform: "none" }}
                                                >
                                                    Approve
                                                </Button>
                                            ) : (
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => { e.stopPropagation(); toggleStatus(r); }}
                                                    title={r.status === "ACTIVE" ? "Suspend" : "Activate"}
                                                >
                                                    {r.status === "ACTIVE" ? (
                                                        <BlockIcon sx={{ color: "#E23744" }} />
                                                    ) : (
                                                        <CheckCircleIcon sx={{ color: "#4CAF50" }} />
                                                    )}
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {total > rowsPerPage && (
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[20]}
                    />
                )}
            </Paper>

            <CreateRestaurantDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={() => {
                    setSnack({ open: true, message: "Restaurant created!" });
                    fetchRestaurants();
                }}
            />

            <CsvImportDialog
                open={importOpen}
                onClose={() => setImportOpen(false)}
                onImported={() => {
                    setSnack({ open: true, message: "Restaurants imported!" });
                    fetchRestaurants();
                }}
            />

            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack({ open: false, message: "" })}
                message={snack.message}
            />
        </Box>
    );
}
