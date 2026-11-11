import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CartItem from "../order/CartItem";

export default function OrderSummaryCard({
    restaurantName,
    netAmount,
    orderItems,
    handlePlaceOrder,
}) {
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
                            {Number(netAmount).toFixed(2)}
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
