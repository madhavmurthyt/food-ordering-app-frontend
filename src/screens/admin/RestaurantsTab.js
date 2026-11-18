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
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import Config from "../../common/utils/Config";
import { getAccessToken } from "../../common/utils/AuthGuard";

export default function RestaurantsTab() {
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const rowsPerPage = 20;

    const fetchRestaurants = useCallback(() => {
        setLoading(true);
        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Admin Restaurants").uri +
            `?page=${page}&size=${rowsPerPage}`;
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
    }, [page]);

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    const toggleStatus = (restaurant) => {
        const newStatus = restaurant.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
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
            .then(() => fetchRestaurants())
            .catch(() => {});
    };

    if (loading && restaurants.length === 0) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
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
                                <TableRow key={r.id}>
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
                                                bgcolor:
                                                    r.status === "ACTIVE"
                                                        ? "#4CAF5014"
                                                        : "#E2374414",
                                                color:
                                                    r.status === "ACTIVE"
                                                        ? "#4CAF50"
                                                        : "#E23744",
                                                fontWeight: 600,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => toggleStatus(r)}
                                            title={
                                                r.status === "ACTIVE"
                                                    ? "Suspend"
                                                    : "Activate"
                                            }
                                        >
                                            {r.status === "ACTIVE" ? (
                                                <BlockIcon sx={{ color: "#E23744" }} />
                                            ) : (
                                                <CheckCircleIcon sx={{ color: "#4CAF50" }} />
                                            )}
                                        </IconButton>
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
    );
}
