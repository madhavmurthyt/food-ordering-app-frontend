import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Config from "../../common/utils/Config";
import { getAccessToken } from "../../common/utils/AuthGuard";

export default function CreateRestaurantDialog({ open, onClose, onCreated }) {
    const [name, setName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [avgPrice, setAvgPrice] = useState("");
    const [flat, setFlat] = useState("");
    const [locality, setLocality] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [stateUuid, setStateUuid] = useState("");
    const [states, setStates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        fetch(Config.endpointPrefix + Config.endpoints.find((e) => e.name === "Get States").uri, {
            headers: { Accept: "application/json" },
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then((data) => setStates(data.states || []))
            .catch(() => {});

        fetch(Config.endpointPrefix + Config.endpoints.find((e) => e.name === "Get Categories").uri, {
            headers: { Accept: "application/json" },
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then((data) => setCategories(data.categories || []))
            .catch(() => {});
    }, [open]);

    const handleClose = () => {
        setName(""); setPhotoUrl(""); setAvgPrice(""); setFlat(""); setLocality("");
        setCity(""); setPincode(""); setStateUuid(""); setSelectedCategories([]);
        setError(""); setSubmitting(false);
        onClose();
    };

    const toggleCategory = (cat) => {
        setSelectedCategories((prev) =>
            prev.find((c) => c.id === cat.id)
                ? prev.filter((c) => c.id !== cat.id)
                : [...prev, cat]
        );
    };

    const handleSubmit = () => {
        if (!name.trim()) { setError("Restaurant name is required."); return; }
        if (!avgPrice || Number(avgPrice) <= 0) { setError("Average price must be greater than 0."); return; }
        if (!stateUuid) { setError("Please select a state."); return; }
        setError("");
        setSubmitting(true);

        const body = {
            restaurant_name: name.trim(),
            photo_url: photoUrl.trim() || null,
            average_price_for_two: Number(avgPrice),
            address: {
                flat_building_name: flat.trim(),
                locality: locality.trim(),
                city: city.trim(),
                pincode: pincode.trim(),
                state_uuid: stateUuid,
            },
            category_uuids: selectedCategories.map((c) => c.id),
        };

        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Admin Create Restaurant").uri;
        fetch(uri, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
            body: JSON.stringify(body),
        })
            .then((res) => {
                if (!res.ok) throw res;
                return res.json();
            })
            .then((data) => {
                setSubmitting(false);
                handleClose();
                if (onCreated) onCreated(data);
            })
            .catch((err) => {
                setSubmitting(false);
                if (err.text) {
                    err.text().then((msg) => {
                        try { setError(JSON.parse(msg).message); } catch { setError("Failed to create restaurant."); }
                    });
                } else {
                    setError("Failed to create restaurant.");
                }
            });
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>Add Restaurant</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                    {error && (
                        <Typography variant="caption" color="error">{error}</Typography>
                    )}
                    <TextField label="Restaurant Name" size="small" required fullWidth
                        value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Photo URL" size="small" fullWidth
                        value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
                    <TextField label="Avg Price for Two" size="small" required fullWidth type="number"
                        value={avgPrice} onChange={(e) => setAvgPrice(e.target.value)} />

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>Address</Typography>
                    <TextField label="Flat / Building" size="small" fullWidth
                        value={flat} onChange={(e) => setFlat(e.target.value)} />
                    <TextField label="Locality" size="small" fullWidth
                        value={locality} onChange={(e) => setLocality(e.target.value)} />
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="City" size="small" fullWidth
                            value={city} onChange={(e) => setCity(e.target.value)} />
                        <TextField label="Pincode" size="small" fullWidth
                            value={pincode} onChange={(e) => setPincode(e.target.value)} />
                    </Box>
                    <TextField label="State" size="small" select required fullWidth
                        value={stateUuid} onChange={(e) => setStateUuid(e.target.value)}>
                        {states.map((s) => (
                            <MenuItem key={s.id} value={s.id}>{s.state_name}</MenuItem>
                        ))}
                    </TextField>

                    {categories.length > 0 && (
                        <>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>Categories</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {categories.map((cat) => {
                                    const selected = selectedCategories.find((c) => c.id === cat.id);
                                    return (
                                        <Chip
                                            key={cat.id}
                                            label={cat.category_name}
                                            onClick={() => toggleCategory(cat)}
                                            variant={selected ? "filled" : "outlined"}
                                            color={selected ? "primary" : "default"}
                                            sx={{ cursor: "pointer" }}
                                        />
                                    );
                                })}
                            </Box>
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Creating..." : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
