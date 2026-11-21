import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Config from "../../common/utils/Config";
import { getAccessToken } from "../../common/utils/AuthGuard";

export default function OwnerRestaurantForm({ restaurant, onSaved, onCancel }) {
    const isEdit = !!restaurant;
    const [name, setName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [avgPrice, setAvgPrice] = useState("");
    const [flat, setFlat] = useState("");
    const [locality, setLocality] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [stateUuid, setStateUuid] = useState("");
    const [states, setStates] = useState([]);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(Config.endpointPrefix + Config.endpoints.find((e) => e.name === "Get States").uri, {
            headers: { Accept: "application/json" },
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then((data) => setStates(data.states || []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (restaurant) {
            setName(restaurant.restaurant_name || "");
            setPhotoUrl(restaurant.photo_url || "");
            setAvgPrice(String(restaurant.average_price_for_two || ""));
            if (restaurant.address) {
                setFlat(restaurant.address.flat_building_name || "");
                setLocality(restaurant.address.locality || "");
                setCity(restaurant.address.city || "");
                setPincode(restaurant.address.pincode || "");
                setStateUuid(restaurant.address.state?.id || "");
            }
        }
    }, [restaurant]);

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
        };

        const baseUri = Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === (isEdit ? "Owner Restaurant" : "Owner Create Restaurant")).uri;
        const uri = isEdit ? baseUri + "/" + restaurant.id : baseUri;
        const method = isEdit ? "PUT" : "POST";

        fetch(uri, {
            method,
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
            .then(() => { setSubmitting(false); onSaved(); })
            .catch((err) => {
                setSubmitting(false);
                if (err.text) {
                    err.text().then((msg) => {
                        try { setError(JSON.parse(msg).message); } catch { setError("Failed to save restaurant."); }
                    });
                } else {
                    setError("Failed to save restaurant.");
                }
            });
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <IconButton onClick={onCancel}><ArrowBackIcon /></IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {isEdit ? "Edit Restaurant" : "Create Restaurant"}
                </Typography>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {error && <Typography variant="caption" color="error">{error}</Typography>}
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

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Saving..." : (isEdit ? "Update" : "Create")}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
