import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InsightsIcon from "@mui/icons-material/Insights";
import Header from "../../common/header/Header";
import Footer from "../../common/footer/Footer";
import brand from "../../theme/brand";

const benefits = [
    {
        icon: <TrendingUpIcon sx={{ fontSize: 48, color: "primary.main" }} />,
        title: "More Orders",
        description: "Get discovered by thousands of hungry customers in your area. Our platform drives traffic to your restaurant so you can focus on what you do best — cooking great food.",
    },
    {
        icon: <MenuBookIcon sx={{ fontSize: 48, color: "secondary.main" }} />,
        title: "Easy Menu Management",
        description: "Update your menu in real-time. Add new items, change prices, mark items as unavailable — all from your owner dashboard. No phone calls, no delays.",
    },
    {
        icon: <InsightsIcon sx={{ fontSize: 48, color: "#4CAF50" }} />,
        title: "Real-Time Insights",
        description: "Track your orders, revenue, and customer ratings in one place. Understand what sells and when, so you can optimize your offerings and grow your business.",
    },
];

export default function ForRestaurants() {
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header showSearch={false} />

            <Box sx={{
                background: "linear-gradient(135deg, #E23744 0%, #FF6B6B 50%, #FF9800 100%)",
                py: { xs: 8, md: 12 },
                px: 2,
                textAlign: "center",
            }}>
                <Typography variant="h3" sx={{
                    fontWeight: 800, color: "#fff",
                    fontSize: { xs: "2rem", md: "3rem" },
                    mb: 2,
                }}>
                    Reach more hungry customers
                </Typography>
                <Typography variant="h6" sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 400, maxWidth: 600, mx: "auto", mb: 1,
                }}>
                    Partner with {brand.appName} and grow your restaurant business
                </Typography>
                <Typography variant="h5" sx={{
                    color: "#fff", fontWeight: 700, mb: 4,
                    bgcolor: "rgba(0,0,0,0.15)", display: "inline-block",
                    px: 3, py: 1, borderRadius: 2,
                }}>
                    Zero commission for first 3 months
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/login?role=restaurant_owner")}
                        sx={{
                            bgcolor: "#fff", color: "#E23744",
                            fontWeight: 700, px: 5, py: 1.5,
                            fontSize: "1.1rem",
                            "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                    >
                        Get Started
                    </Button>
                </Box>
            </Box>

            <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 6, md: 10 } }}>
                <Typography variant="h4" sx={{
                    fontWeight: 700, textAlign: "center", mb: 6,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                }}>
                    Why partner with us?
                </Typography>
                <Grid container spacing={4} sx={{ maxWidth: 1000, mx: "auto" }}>
                    {benefits.map((b, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Paper sx={{
                                p: 4, textAlign: "center", height: "100%",
                                display: "flex", flexDirection: "column", alignItems: "center",
                            }}>
                                <Box sx={{ mb: 2 }}>{b.icon}</Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                                    {b.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                                    {b.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={{
                bgcolor: "#1A1A2E", py: { xs: 6, md: 8 }, px: 2,
                textAlign: "center",
            }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff", mb: 2 }}>
                    Ready to grow your business?
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", mb: 4, maxWidth: 500, mx: "auto" }}>
                    Join hundreds of restaurants already using {brand.appName} to reach more customers and increase their revenue.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/login?role=restaurant_owner")}
                    sx={{ px: 5, py: 1.5, fontWeight: 700 }}
                >
                    Get Started Now
                </Button>
            </Box>

            <Footer />
        </Box>
    );
}
