import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CartItem from "../order/CartItem";
import Config from "../utils/Config";
import { getAccessToken } from "../utils/AuthGuard";

export default function OrderSummaryCard({
    restaurantName,
    netAmount,
    orderItems,
    handlePlaceOrder,
    discount,
    couponName,
    onApplyCoupon,
    onRemoveCoupon,
}) {
    const [couponInput, setCouponInput] = useState("");
    const [couponError, setCouponError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleApply = () => {
        if (!couponInput.trim()) return;
        setCouponError("");
        setLoading(true);
        const uri =
            Config.endpointPrefix +
            "/api/order/coupon/" +
            encodeURIComponent(couponInput.trim());
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
                setLoading(false);
                if (onApplyCoupon) {
                    onApplyCoupon(couponInput.trim(), data.percent);
                }
            })
            .catch(() => {
                setLoading(false);
                setCouponError("Invalid or expired coupon code.");
            });
    };

    const handleRemove = () => {
        setCouponInput("");
        setCouponError("");
        if (onRemoveCoupon) onRemoveCoupon();
    };

    const finalAmount = discount ? netAmount - discount : netAmount;

    return (
        <Card>
            <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Summary
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 500, color: "primary.main", mb: 1.5 }}
                >
                    {restaurantName}
                </Typography>

                {orderItems &&
                    orderItems.length > 0 &&
                    orderItems.map((orderItem) => (
                        <CartItem
                            key={orderItem.id}
                            cartItem={orderItem}
                            editable={false}
                        />
                    ))}

                <Divider sx={{ my: 2 }} />

                {/* Coupon Section */}
                {couponName && discount ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Chip
                                label={couponName}
                                color="success"
                                size="small"
                                sx={{ fontWeight: 600 }}
                            />
                            <Typography variant="body2" sx={{ color: "success.main" }}>
                                Applied
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            onClick={handleRemove}
                            sx={{ color: "error.main", cursor: "pointer", fontWeight: 600 }}
                        >
                            Remove
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <TextField
                            size="small"
                            placeholder="Coupon code"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleApply(); }}
                            error={!!couponError}
                            helperText={couponError}
                            sx={{ flex: 1 }}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleApply}
                            disabled={loading || !couponInput.trim()}
                            sx={{ minWidth: 80 }}
                        >
                            Apply
                        </Button>
                    </Box>
                )}

                {discount > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Subtotal
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CurrencyRupeeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                {Number(netAmount).toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                )}
                {discount > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "success.main" }}>
                            Discount
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ color: "success.main" }}>
                                -{"₹"}{Number(discount).toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Net Amount
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CurrencyRupeeIcon sx={{ fontSize: 16 }} />
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700 }}
                        >
                            {Number(finalAmount).toFixed(2)}
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handlePlaceOrder}
                    sx={{ fontWeight: 600 }}
                >
                    Place Order
                </Button>
            </CardContent>
        </Card>
    );
}
