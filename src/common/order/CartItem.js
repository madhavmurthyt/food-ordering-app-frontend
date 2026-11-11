import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function CartItem({
    cartItem,
    handleAddCartItem,
    handleRemoveCartItem,
    editable,
}) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                py: 1,
                gap: 1,
            }}
        >
            <FiberManualRecordIcon
                sx={{
                    fontSize: 10,
                    color:
                        cartItem.type === "VEG" || cartItem.type === "0"
                            ? "success.main"
                            : "error.main",
                }}
            />
            <Typography
                variant="body2"
                sx={{
                    flex: 1,
                    textTransform: "capitalize",
                    color: "text.secondary",
                    fontWeight: 500,
                }}
            >
                {cartItem.name}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                }}
            >
                {editable && (
                    <IconButton
                        size="small"
                        onClick={() => handleRemoveCartItem(cartItem)}
                        sx={{
                            width: 24,
                            height: 24,
                            "&:hover": { bgcolor: "secondary.light" },
                        }}
                    >
                        <RemoveIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                )}
                <Typography
                    variant="body2"
                    sx={{
                        minWidth: 20,
                        textAlign: "center",
                        fontWeight: 600,
                    }}
                >
                    {cartItem.quantity}
                </Typography>
                {editable && (
                    <IconButton
                        size="small"
                        onClick={() => handleAddCartItem(cartItem)}
                        sx={{
                            width: 24,
                            height: 24,
                            "&:hover": { bgcolor: "secondary.light" },
                        }}
                    >
                        <AddIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                )}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: 60,
                    justifyContent: "flex-end",
                    color: "text.secondary",
                }}
            >
                <CurrencyRupeeIcon sx={{ fontSize: 12 }} />
                <Typography variant="body2">
                    {cartItem.price.toFixed(2)}
                </Typography>
            </Box>
        </Box>
    );
}
