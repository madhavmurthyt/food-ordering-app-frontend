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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Config from "../../common/utils/Config";
import { getAccessToken } from "../../common/utils/AuthGuard";

const ROLES = ["CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"];

const providerColors = {
    LOCAL: { bg: "#2196F314", color: "#2196F3" },
    GOOGLE: { bg: "#4CAF5014", color: "#4CAF50" },
};

export default function UsersTab() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const rowsPerPage = 20;

    const fetchUsers = useCallback(() => {
        setLoading(true);
        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Admin Users").uri +
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
                setUsers(data.users || []);
                setTotal(data.total || 0);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const changeRole = (userId, newRole) => {
        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Admin User Role").uri +
            `/${userId}/role`;
        fetch(uri, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
            body: JSON.stringify({ role: newRole }),
        })
            .then((res) => {
                if (!res.ok) throw res;
                return res.json();
            })
            .then(() => fetchUsers())
            .catch(() => {});
    };

    if (loading && users.length === 0) {
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
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Provider</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Typography sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                                        No users found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((u) => {
                                const prov = providerColors[u.auth_provider] || providerColors.LOCAL;
                                return (
                                    <TableRow key={u.id}>
                                        <TableCell>
                                            {u.first_name}
                                            {u.last_name ? ` ${u.last_name}` : ""}
                                        </TableCell>
                                        <TableCell>{u.email || "—"}</TableCell>
                                        <TableCell>{u.contact_number || "—"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={u.auth_provider || "LOCAL"}
                                                size="small"
                                                sx={{
                                                    bgcolor: prov.bg,
                                                    color: prov.color,
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                size="small"
                                                value={u.role}
                                                onChange={(e) => changeRole(u.id, e.target.value)}
                                                sx={{ minWidth: 160 }}
                                            >
                                                {ROLES.map((r) => (
                                                    <MenuItem key={r} value={r}>
                                                        {r.replace("_", " ")}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
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
