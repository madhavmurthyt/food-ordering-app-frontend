import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Header from "../../common/header/Header";
import Footer from "../../common/footer/Footer";
import Config from "../../common/utils/Config";
import { getAccessToken } from "../../common/utils/AuthGuard";

const ORDER_STEPS = ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];
const STEP_LABELS = ["Order Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

export default function OrderTracking() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const intervalRef = useRef(null);

    const fetchStatus = useCallback(() => {
        const uri = Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Order Status").uri +
            "/" + orderId + "/status";
        fetch(uri, {
            headers: {
                Accept: "application/json",
                authorization: "Bearer " + getAccessToken(),
            },
        })
            .then((r) => { if (!r.ok) throw r; return r.json(); })
            .then((data) => { setOrder(data); setLoading(false); })
            .catch(() => { setError("Unable to load order status."); setLoading(false); });
    }, [orderId]);

    useEffect(() => {
        fetchStatus();
        intervalRef.current = setInterval(fetchStatus, 30000);
        return () => clearInterval(intervalRef.current);
    }, [fetchStatus]);

    useEffect(() => {
        if (order && order.status === "DELIVERED") {
            clearInterval(intervalRef.current);
        }
    }, [order]);

    const activeStep = order ? ORDER_STEPS.indexOf(order.status) : 0;

    if (loading) {
        return (
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
                <Header showSearch={false} />
                <Box sx={{ display: "flex", justifyContent: "center", py: 16 }}>
                    <CircularProgress />
                </Box>
                <Footer />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
                <Header showSearch={false} />
                <Box sx={{ textAlign: "center", py: 16 }}>
                    <Typography variant="h6" sx={{ color: "text.secondary", mb: 2 }}>{error}</Typography>
                    <Button variant="contained" onClick={() => navigate("/")}>Go Home</Button>
                </Box>
                <Footer />
            </Box>
        );
    }

    const isDelivered = order.status === "DELIVERED";

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header showSearch={false} />
            <Box sx={{ flex: 1, maxWidth: 700, mx: "auto", width: "100%", px: { xs: 2, md: 4 }, py: 4 }}>
                <Paper sx={{ p: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Order Tracking
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Order #{orderId.substring(0, 8)}...
                            </Typography>
                        </Box>
                        <Chip
                            icon={isDelivered ? <CheckCircleIcon /> : <LocalShippingIcon />}
                            label={isDelivered ? "Delivered" : "In Progress"}
                            color={isDelivered ? "success" : "primary"}
                            variant="outlined"
                        />
                    </Box>

                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel
                        sx={{ mb: 4 }}
                    >
                        {STEP_LABELS.map((label, index) => {
                            const stepTimestamps = order.timestamps || {};
                            const stepKey = ORDER_STEPS[index];
                            const timestamp = stepTimestamps[stepKey.toLowerCase()] || stepTimestamps[stepKey];
                            return (
                                <Step key={label} completed={index <= activeStep}>
                                    <StepLabel
                                        sx={{
                                            "& .MuiStepLabel-label": {
                                                fontWeight: index === activeStep ? 700 : 400,
                                            },
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ display: "block", fontWeight: index === activeStep ? 700 : 400 }}>
                                            {label}
                                        </Typography>
                                        {timestamp && (
                                            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem" }}>
                                                {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </Typography>
                                        )}
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>

                    {order.restaurant_name && (
                        <Box sx={{ bgcolor: "#f5f5f5", borderRadius: 2, p: 2, mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {order.restaurant_name}
                            </Typography>
                            {order.items && order.items.length > 0 && (
                                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                                    {order.items.map((i) => `${i.item_name} x${i.quantity}`).join(", ")}
                                </Typography>
                            )}
                            {order.bill != null && (
                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                    Total: {"₹"}{order.bill}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {!isDelivered && (
                        <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                            Status updates every 30 seconds
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Button variant="outlined" onClick={() => navigate("/profile")}>
                            View All Orders
                        </Button>
                    </Box>
                </Paper>
            </Box>
            <Footer />
        </Box>
    );
}
