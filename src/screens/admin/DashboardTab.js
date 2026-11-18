import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Config from "../../common/utils/Config";
import { getAccessToken } from "../../common/utils/AuthGuard";

const tiles = [
    { key: "total_orders", label: "Total Orders", icon: ShoppingCartIcon, color: "#E23744" },
    { key: "total_revenue", label: "Total Revenue", icon: AttachMoneyIcon, color: "#4CAF50", prefix: "₹" },
    { key: "active_users", label: "Active Users", icon: PeopleIcon, color: "#2196F3" },
    { key: "total_restaurants", label: "Restaurants", icon: RestaurantIcon, color: "#FF9800" },
];

export default function DashboardTab() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Admin Dashboard").uri;
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
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!stats) {
        return (
            <Typography color="error" sx={{ py: 4, textAlign: "center" }}>
                Failed to load dashboard data.
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
                gap: 3,
            }}
        >
            {tiles.map((tile) => {
                const Icon = tile.icon;
                const value = stats[tile.key];
                return (
                    <Paper
                        key={tile.key}
                        sx={{
                            p: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: tile.color + "14",
                            }}
                        >
                            <Icon sx={{ fontSize: 28, color: tile.color }} />
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                {tile.label}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {tile.prefix || ""}
                                {typeof value === "number"
                                    ? value.toLocaleString("en-IN")
                                    : value}
                            </Typography>
                        </Box>
                    </Paper>
                );
            })}
        </Box>
    );
}
