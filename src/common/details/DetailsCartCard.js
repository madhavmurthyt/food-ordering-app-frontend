import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CartItem from "../order/CartItem";

export default function DetailsCartCard({
    cartItems,
    totalAmount,
    totalItems,
    handleAddCartItem,
    handleRemoveCartItem,
    handleCheckoutClick,
}) {
    return (
        <Card
            sx={{
                position: "sticky",
                top: 80,
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 2,
                    }}
                >
                    <Badge
                        badgeContent={totalItems}
                        color="primary"
                        showZero
                    >
                        <ShoppingCartOutlinedIcon />
                    </Badge>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        My Cart
                    </Typography>
                </Box>

                {cartItems.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        {cartItems.map((cartItem) => (
                            <CartItem
                                key={cartItem.id}
                                cartItem={cartItem}
                                handleAddCartItem={handleAddCartItem}
                                handleRemoveCartItem={handleRemoveCartItem}
                                editable={true}
                            />
                        ))}
                    </Box>
                )}

                <Divider sx={{ my: 1.5 }} />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        TOTAL AMOUNT
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 700,
                        }}
                    >
                        <CurrencyRupeeIcon sx={{ fontSize: 16 }} />
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700 }}
                        >
                            {totalAmount.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleCheckoutClick}
                    sx={{ fontWeight: 600 }}
                >
                    Checkout
                </Button>
            </CardContent>
        </Card>
    );
}
