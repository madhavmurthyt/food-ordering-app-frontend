import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

export default function SaveAddressForm({ states, handleSaveAddressOK }) {
    const [flatname, setFlatname] = React.useState("");
    const [locality, setLocality] = React.useState("");
    const [city, setCity] = React.useState("");
    const [state, setState] = React.useState("");
    const [pincode, setPincode] = React.useState("");
    const [isSaveClicked, setSaveClicked] = React.useState(false);

    const showError = (field) => isSaveClicked && (field === null || field === "");
    const pincodeInvalid = isSaveClicked && pincode && (pincode.length !== 6 || isNaN(pincode));

    const reset = (isOK) => {
        if (isOK) {
            setFlatname("");
            setLocality("");
            setCity("");
            setState("");
            setPincode("");
            setSaveClicked(false);
        }
    };

    const onSave = () => {
        setSaveClicked(true);
        if (
            flatname &&
            locality &&
            city &&
            state &&
            pincode &&
            pincode.length === 6 &&
            !isNaN(pincode)
        ) {
            handleSaveAddressOK(
                {
                    city: city,
                    flat_building_name: flatname,
                    locality: locality,
                    pincode: pincode,
                    state_uuid: state,
                },
                reset
            );
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 400,
                py: 3,
                px: 1,
            }}
        >
            <TextField
                label="Flat / Building No"
                variant="outlined"
                size="small"
                required
                fullWidth
                value={flatname}
                onChange={(e) => setFlatname(e.target.value)}
                error={showError(flatname)}
                helperText={showError(flatname) ? "required" : ""}
            />
            <TextField
                label="Locality"
                variant="outlined"
                size="small"
                required
                fullWidth
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                error={showError(locality)}
                helperText={showError(locality) ? "required" : ""}
            />
            <TextField
                label="City"
                variant="outlined"
                size="small"
                required
                fullWidth
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={showError(city)}
                helperText={showError(city) ? "required" : ""}
            />
            <TextField
                label="State"
                variant="outlined"
                size="small"
                required
                fullWidth
                select
                value={state}
                onChange={(e) => setState(e.target.value)}
                error={showError(state)}
                helperText={showError(state) ? "required" : ""}
                SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 200 } } } }}
            >
                {states &&
                    states.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                            {s.state_name}
                        </MenuItem>
                    ))}
            </TextField>
            <TextField
                label="Pincode"
                variant="outlined"
                size="small"
                required
                fullWidth
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                error={showError(pincode) || pincodeInvalid}
                helperText={
                    showError(pincode)
                        ? "required"
                        : pincodeInvalid
                        ? "Pincode must contain only numbers and must be 6 digits long"
                        : ""
                }
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onSave}
                sx={{ mt: 1 }}
            >
                Save Address
            </Button>
        </Box>
    );
}
