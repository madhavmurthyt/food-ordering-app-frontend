import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export default function OrderHistory({ orders }) {
    if (!orders || orders.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                    No orders placed yet.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}>
            {orders.map((order) => (
                <Card key={order.id}>
                    <CardContent sx={{ p: 2.5 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 1.5,
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {order.restaurant_name || "Restaurant"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(order.date).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CurrencyRupeeIcon sx={{ fontSize: 16 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {Number(order.bill).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {order.item_quantities &&
                            order.item_quantities.map((iq, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        py: 0.5,
                                    }}
                                >
                                    <FiberManualRecordIcon
                                        sx={{
                                            fontSize: 10,
                                            color:
                                                iq.item && (iq.item.type === "VEG" || iq.item.type === "0")
                                                    ? "success.main"
                                                    : "error.main",
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ flex: 1, textTransform: "capitalize" }}>
                                        {iq.item ? iq.item.item_name : "Item"} x {iq.quantity}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                                        <CurrencyRupeeIcon sx={{ fontSize: 12 }} />
                                        <Typography variant="body2">{Number(iq.price).toFixed(2)}</Typography>
                                    </Box>
                                </Box>
                            ))}

                        {order.payment && (
                            <Box sx={{ mt: 1.5 }}>
                                <Chip
                                    label={order.payment.payment_name}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: "0.75rem" }}
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
