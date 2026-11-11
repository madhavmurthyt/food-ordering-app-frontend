import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const getState = (length, index) => {
    let state = length > 0 ? new Array(length).fill(false) : [];
    if (index < length && index >= 0) {
        state[index] = true;
    }
    return state;
};

export default function AddressesGrid({ addresses, cols, setAddressId, selectedIndex }) {
    const [selected, setSelected] = React.useState(
        addresses !== null && addresses.length > 0
            ? [...getState(addresses.length, selectedIndex)]
            : []
    );

    const onClick = (e) => {
        if (e.currentTarget.value !== null) {
            setSelected(getState(addresses.length, e.currentTarget.value));
            setAddressId(e.currentTarget.id);
        }
    };

    return (
        <Box sx={{ textAlign: "left", py: 2 }}>
            {addresses !== null && addresses.length > 0 ? (
                <Grid container spacing={2}>
                    {addresses.map((address, index) => (
                        <Grid item xs={12} sm={6} md={4} key={address.id}>
                            <Card
                                sx={{
                                    borderLeft: selected[index]
                                        ? "4px solid"
                                        : "4px solid transparent",
                                    borderColor: selected[index]
                                        ? "primary.main"
                                        : "transparent",
                                    bgcolor: selected[index]
                                        ? "#FFF5F5"
                                        : "background.paper",
                                    transition: "all 0.2s",
                                    cursor: "pointer",
                                }}
                                elevation={selected[index] ? 3 : 1}
                            >
                                <CardContent sx={{ pb: 0 }}>
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
                                </CardContent>
                                <CardActions sx={{ justifyContent: "flex-end" }}>
                                    <IconButton
                                        id={address.id}
                                        value={index}
                                        onClick={onClick}
                                    >
                                        <CheckCircleRoundedIcon
                                            sx={{
                                                fontSize: 28,
                                                color: selected[index]
                                                    ? "primary.main"
                                                    : "grey.400",
                                            }}
                                        />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                        There are no saved addresses! You can save an address
                        using the &apos;New Address&apos; tab or using your
                        &apos;Profile&apos; menu option.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
