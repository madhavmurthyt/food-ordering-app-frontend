import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function AddressManager({ addresses, onDeleteAddress }) {
    if (!addresses || addresses.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                    No saved addresses. Add one from the checkout page.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={2} sx={{ py: 2 }}>
            {addresses.map((address) => (
                <Grid item xs={12} sm={6} md={4} key={address.id}>
                    <Card
                        sx={{
                            transition: "box-shadow 0.2s",
                            "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.12)" },
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {address.flat_building_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {address.locality}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {address.city}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {address.state.state_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {address.pincode}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDeleteAddress(address.id)}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
