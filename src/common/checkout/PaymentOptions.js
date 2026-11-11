import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const iconMap = {
    "Credit Card": <PaymentIcon />,
    "Debit Card": <PaymentIcon />,
    "Debit/Credit Card": <PaymentIcon />,
    "Wallet": <AccountBalanceWalletIcon />,
    "Net Banking": <AccountBalanceIcon />,
    "Cash on Delivery": <LocalAtmIcon />,
    "COD": <LocalAtmIcon />,
};

export default function PaymentOptions({ paymentModes, setPaymentModeId, selectedPaymentMode }) {
    const [selected, setSelected] = React.useState(selectedPaymentMode);

    const handleSelect = (id) => {
        setSelected(id);
        setPaymentModeId(id);
    };

    return (
        <Box sx={{ py: 2 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Select Mode of Payment
            </Typography>
            <Grid container spacing={2}>
                {paymentModes.map((mode) => (
                    <Grid item xs={12} sm={6} key={mode.id}>
                        <Card
                            sx={{
                                cursor: "pointer",
                                borderLeft: selected === mode.id
                                    ? "4px solid"
                                    : "4px solid transparent",
                                borderColor: selected === mode.id
                                    ? "primary.main"
                                    : "transparent",
                                bgcolor: selected === mode.id
                                    ? "#FFF5F5"
                                    : "background.paper",
                                transition: "all 0.2s",
                            }}
                            elevation={selected === mode.id ? 3 : 1}
                            onClick={() => handleSelect(mode.id)}
                        >
                            <CardContent
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    py: 2,
                                    "&:last-child": { pb: 2 },
                                }}
                            >
                                <Box sx={{ color: selected === mode.id ? "primary.main" : "text.secondary" }}>
                                    {iconMap[mode.payment_name] || <PaymentIcon />}
                                </Box>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        flex: 1,
                                        fontWeight: selected === mode.id ? 600 : 400,
                                    }}
                                >
                                    {mode.payment_name}
                                </Typography>
                                {selected === mode.id && (
                                    <CheckCircleIcon color="primary" />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
