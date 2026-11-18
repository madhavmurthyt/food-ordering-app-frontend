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
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Config from "../../common/utils/Config";
import { getAccessToken } from "../../common/utils/AuthGuard";

export default function OrdersTab() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const rowsPerPage = 20;

    const fetchOrders = useCallback(() => {
        setLoading(true);
        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Admin Orders").uri +
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
                setOrders(data.orders || []);
                setTotal(data.total || 0);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading && orders.length === 0) {
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
                            <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Restaurant</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Typography sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                                        No orders found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                                        {o.id.substring(0, 8)}...
                                    </TableCell>
                                    <TableCell>{o.customer_name}</TableCell>
                                    <TableCell>{o.restaurant_name}</TableCell>
                                    <TableCell>
                                        {"₹"}{o.bill.toLocaleString("en-IN")}
                                        {o.discount > 0 && (
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                sx={{ color: "success.main", ml: 0.5 }}
                                            >
                                                (-{"₹"}{o.discount})
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{formatDate(o.date)}</TableCell>
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
