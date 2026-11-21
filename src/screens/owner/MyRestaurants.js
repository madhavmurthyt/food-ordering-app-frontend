import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Header from "../../common/header/Header";
import Footer from "../../common/footer/Footer";
import Config from "../../common/utils/Config";
import { isLoggedIn, getRole, getAccessToken } from "../../common/utils/AuthGuard";
import OwnerRestaurantForm from "./OwnerRestaurantForm";
import OwnerMenuPanel from "./OwnerMenuPanel";

const statusChipColors = (status) => {
    switch (status) {
        case "ACTIVE": return { bgcolor: "#4CAF5014", color: "#4CAF50" };
        case "PENDING": return { bgcolor: "#FF980014", color: "#FF9800" };
        case "SUSPENDED": return { bgcolor: "#E2374414", color: "#E23744" };
        default: return { bgcolor: "#9E9E9E14", color: "#9E9E9E" };
    }
};

export default function MyRestaurants() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("list");
    const [editRestaurant, setEditRestaurant] = useState(null);
    const [menuRestaurant, setMenuRestaurant] = useState(null);
    const [snack, setSnack] = useState({ open: false, message: "" });

    useEffect(() => {
        if (!isLoggedIn()) { navigate("/login"); return; }
        if (getRole() !== "RESTAURANT_OWNER") { navigate("/"); return; }
    }, [navigate]);

    const fetchMyRestaurants = useCallback(() => {
        setLoading(true);
        const uri = Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Owner My Restaurants").uri;
        fetch(uri, {
            headers: {
                Accept: "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then((data) => { setRestaurants(data.restaurants || []); setLoading(false); })
            .catch(() => { setRestaurants([]); setLoading(false); });
    }, []);

    useEffect(() => { fetchMyRestaurants(); }, [fetchMyRestaurants]);

    if (view === "create" || view === "edit") {
        return (
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Header showSearch={false} />
                <Box sx={{ flex: 1, px: { xs: 2, md: 4 }, py: 3, maxWidth: 720, mx: "auto", width: "100%" }}>
                    <OwnerRestaurantForm
                        restaurant={view === "edit" ? editRestaurant : null}
                        onSaved={() => {
                            setView("list");
                            setEditRestaurant(null);
                            setSnack({ open: true, message: view === "edit" ? "Restaurant updated!" : "Restaurant created!" });
                            fetchMyRestaurants();
                        }}
                        onCancel={() => { setView("list"); setEditRestaurant(null); }}
                    />
                </Box>
                <Footer />
                <Snackbar open={snack.open} autoHideDuration={3000}
                    onClose={() => setSnack({ open: false, message: "" })} message={snack.message} />
            </Box>
        );
    }

    if (view === "menu") {
        return (
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Header showSearch={false} />
                <Box sx={{ flex: 1, px: { xs: 2, md: 4 }, py: 3 }}>
                    <OwnerMenuPanel
                        restaurant={menuRestaurant}
                        onBack={() => { setView("list"); setMenuRestaurant(null); }}
                    />
                </Box>
                <Footer />
            </Box>
        );
    }

    const pendingCount = restaurants.filter((r) => r.status === "PENDING").length;

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header showSearch={false} />
            <Box sx={{ flex: 1, px: { xs: 2, md: 4 }, py: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>My Restaurants</Typography>
                    <Button variant="contained" startIcon={<AddIcon />}
                        onClick={() => setView("create")}>
                        Add Restaurant
                    </Button>
                </Box>

                {pendingCount > 0 && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        {pendingCount} restaurant{pendingCount > 1 ? "s are" : " is"} pending admin approval.
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : restaurants.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: "center" }}>
                        <Typography variant="h6" sx={{ color: "text.secondary", mb: 2 }}>
                            You haven't added any restaurants yet.
                        </Typography>
                        <Button variant="contained" startIcon={<AddIcon />}
                            onClick={() => setView("create")}>
                            Create Your First Restaurant
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {restaurants.map((r) => (
                            <Grid item xs={12} sm={6} md={4} key={r.id}>
                                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                    {r.photo_url ? (
                                        <CardMedia component="img" height="160" image={r.photo_url}
                                            alt={r.restaurant_name} sx={{ objectFit: "cover" }} />
                                    ) : (
                                        <Box sx={{ height: 160, bgcolor: "#f5f5f5", display: "flex",
                                            alignItems: "center", justifyContent: "center" }}>
                                            <Typography variant="h4" sx={{ color: "#ccc" }}>
                                                {r.restaurant_name.charAt(0)}
                                            </Typography>
                                        </Box>
                                    )}
                                    <CardContent sx={{ flex: 1 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {r.restaurant_name}
                                            </Typography>
                                            <Chip label={r.status} size="small"
                                                sx={{ ...statusChipColors(r.status), fontWeight: 600 }} />
                                        </Box>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            Avg. {"₹"}{r.average_price_for_two} for two
                                        </Typography>
                                        {r.customer_rating > 0 && (
                                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                Rating: {r.customer_rating.toFixed(1)} ({r.number_of_customers_rated})
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <CardActions sx={{ px: 2, pb: 2 }}>
                                        <Button size="small" startIcon={<EditIcon />}
                                            onClick={() => { setEditRestaurant(r); setView("edit"); }}>
                                            Edit
                                        </Button>
                                        <Button size="small" startIcon={<MenuBookIcon />}
                                            onClick={() => { setMenuRestaurant(r); setView("menu"); }}>
                                            Menu
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
            <Footer />
            <Snackbar open={snack.open} autoHideDuration={3000}
                onClose={() => setSnack({ open: false, message: "" })} message={snack.message} />
        </Box>
    );
}
