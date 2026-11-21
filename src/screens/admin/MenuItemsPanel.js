import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Config from "../../common/utils/Config";
import { getAccessToken } from "../../common/utils/AuthGuard";

const ITEM_TYPES = ["VEG", "NON_VEG"];

function ItemFormDialog({ open, onClose, onSave, editItem }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("VEG");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editItem) {
            setName(editItem.item_name || "");
            setPrice(String(editItem.price || ""));
            setType(editItem.type || "VEG");
        } else {
            setName(""); setPrice(""); setType("VEG");
        }
        setError(""); setSubmitting(false);
    }, [editItem, open]);

    const handleSave = () => {
        if (!name.trim()) { setError("Item name is required."); return; }
        if (!price || Number(price) <= 0) { setError("Price must be greater than 0."); return; }
        setError(""); setSubmitting(true);
        onSave({ item_name: name.trim(), price: Number(price), type }, () => setSubmitting(false));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>
                {editItem ? "Edit Item" : "Add Item"}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                    {error && <Typography variant="caption" color="error">{error}</Typography>}
                    <TextField label="Item Name" size="small" required fullWidth
                        value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Price" size="small" required fullWidth type="number"
                        value={price} onChange={(e) => setPrice(e.target.value)} />
                    <TextField label="Type" size="small" select required fullWidth
                        value={type} onChange={(e) => setType(e.target.value)}>
                        {ITEM_TYPES.map((t) => (
                            <MenuItem key={t} value={t}>{t.replace("_", " ")}</MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={submitting}>
                    {submitting ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function MenuItemsPanel({ restaurant, onBack }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [snack, setSnack] = useState({ open: false, message: "" });
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteUrl, setInviteUrl] = useState("");
    const [inviteExpires, setInviteExpires] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);

    const baseUri =
        Config.endpointPrefix +
        Config.endpoints.find((e) => e.name === "Admin Restaurant Items").uri +
        "/" + restaurant.id;

    const fetchItems = useCallback(() => {
        setLoading(true);
        fetch(Config.endpointPrefix + "/api/item/restaurant/" + restaurant.id, {
            headers: { Accept: "application/json" },
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then((data) => { setItems(data || []); setLoading(false); })
            .catch(() => { setItems([]); setLoading(false); });
    }, [restaurant.id]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleAddItem = (itemData, done) => {
        fetch(baseUri + "/items", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
            body: JSON.stringify({ items: [itemData] }),
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then(() => {
                done();
                setDialogOpen(false);
                setSnack({ open: true, message: "Item added!" });
                fetchItems();
            })
            .catch(() => { done(); setSnack({ open: true, message: "Failed to add item." }); });
    };

    const handleEditItem = (itemData, done) => {
        fetch(baseUri + "/items/" + editItem.id, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
            body: JSON.stringify(itemData),
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then(() => {
                done();
                setDialogOpen(false);
                setEditItem(null);
                setSnack({ open: true, message: "Item updated!" });
                fetchItems();
            })
            .catch(() => { done(); setSnack({ open: true, message: "Failed to update item." }); });
    };

    const handleDeleteItem = (item) => {
        fetch(baseUri + "/items/" + item.id, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then(() => {
                setSnack({ open: true, message: "Item deleted." });
                fetchItems();
            })
            .catch(() => setSnack({ open: true, message: "Failed to delete item." }));
    };

    const openAdd = () => { setEditItem(null); setDialogOpen(true); };
    const openEdit = (item) => { setEditItem(item); setDialogOpen(true); };

    const generateInvite = () => {
        setInviteLoading(true);
        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Admin Generate Invite").uri +
            "/" + restaurant.id + "/invite";
        fetch(uri, {
            method: "POST",
            headers: {
                Accept: "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then((data) => {
                const fullUrl = window.location.origin + data.invite_url;
                setInviteUrl(fullUrl);
                setInviteExpires(data.expires_at || "");
                setInviteOpen(true);
                setInviteLoading(false);
            })
            .catch(() => {
                setInviteLoading(false);
                setSnack({ open: true, message: "Failed to generate invite link." });
            });
    };

    const copyInviteUrl = () => {
        navigator.clipboard.writeText(inviteUrl).then(() => {
            setSnack({ open: true, message: "Invite link copied!" });
        });
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <IconButton onClick={onBack}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {restaurant.restaurant_name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Menu Items
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<LinkIcon />}
                    onClick={generateInvite}
                    disabled={inviteLoading}
                >
                    {inviteLoading ? "Generating..." : "Generate Invite Link"}
                </Button>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
                    Add Item
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Typography sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                                                No menu items yet. Add the first one!
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.item_name}</TableCell>
                                            <TableCell>{"₹"}{item.price}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={item.item_type || item.type}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: (item.item_type || item.type) === "VEG" ? "#4CAF5014" : "#E2374414",
                                                        color: (item.item_type || item.type) === "VEG" ? "#4CAF50" : "#E23744",
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" onClick={() => openEdit(item)} title="Edit">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDeleteItem(item)} title="Delete"
                                                    sx={{ color: "error.main" }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <ItemFormDialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditItem(null); }}
                onSave={editItem ? handleEditItem : handleAddItem}
                editItem={editItem}
            />

            <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>Invite Link</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Share this link with the restaurant owner so they can claim and manage this restaurant.
                    </Typography>
                    <TextField
                        fullWidth size="small" value={inviteUrl} InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={copyInviteUrl} title="Copy">
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {inviteExpires && (
                        <Typography variant="caption" sx={{ mt: 1, display: "block", color: "text.secondary" }}>
                            Expires: {new Date(inviteExpires).toLocaleDateString()}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setInviteOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack({ open: false, message: "" })}
                message={snack.message}
            />
        </Box>
    );
}
