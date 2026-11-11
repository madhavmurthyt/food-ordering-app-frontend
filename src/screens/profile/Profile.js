import React, { Component } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Header from "../../common/header/Header";
import OrderHistory from "../../common/profile/OrderHistory";
import AddressManager from "../../common/profile/AddressManager";
import Notification from "../../common/notification/Notification";
import Config from "../../common/utils/Config";
import { GetEndpointURI, GetHttpHeaders, CallApi } from "../../common/utils/ApiHelper";
import withRouter from "../../common/utils/withRouter";
import Footer from "../../common/footer/Footer";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            orders: [],
            addresses: [],
            firstName: sessionStorage.getItem("first-name") || "",
            lastName: "",
            editFirstName: "",
            editLastName: "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            messageText: null,
            notificationOpen: false,
        };
    }

    componentDidMount() {
        if (!sessionStorage.getItem("access-token")) {
            this.props.navigate("/");
            return;
        }
        this.fetchOrders();
        this.fetchAddresses();
    }

    fetchOrders = () => {
        const headers = {
            Accept: "application/json",
            authorization: "Bearer " + sessionStorage.getItem("access-token"),
        };
        let uri = Config.endpointPrefix + "/api/order";
        fetch(uri, { method: "GET", headers })
            .then((r) => r.json())
            .then((data) => {
                this.setState({ orders: data.orders || [] });
            })
            .catch(() => {});
    };

    fetchAddresses = () => {
        CallApi(
            GetEndpointURI("Get Addresses"),
            GetHttpHeaders("GET", "Bearer " + sessionStorage.getItem("access-token")),
            (result, response) => {
                this.setState({ addresses: result ? response.addresses || [] : [] });
            }
        );
    };

    handleDeleteAddress = (addressId) => {
        const headers = {
            Accept: "application/json",
            authorization: "Bearer " + sessionStorage.getItem("access-token"),
        };
        let uri = Config.endpointPrefix + "/api/address/" + addressId;
        fetch(uri, { method: "DELETE", headers })
            .then((r) => {
                if (r.ok) {
                    this.showNotification("Address deleted successfully!");
                    this.fetchAddresses();
                } else {
                    this.showNotification("Unable to delete address.");
                }
            })
            .catch(() => this.showNotification("Unable to delete address."));
    };

    handleUpdateName = () => {
        if (!this.state.editFirstName) {
            this.showNotification("First name is required.");
            return;
        }
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + sessionStorage.getItem("access-token"),
        };
        const body = JSON.stringify({
            first_name: this.state.editFirstName,
            last_name: this.state.editLastName,
        });
        let uri = Config.endpointPrefix + "/api/customer";
        fetch(uri, { method: "PUT", headers, body })
            .then((r) => {
                if (r.ok) {
                    sessionStorage.setItem("first-name", this.state.editFirstName);
                    this.setState({ firstName: this.state.editFirstName });
                    this.showNotification("Name updated successfully!");
                    return r.json();
                } else {
                    throw r;
                }
            })
            .catch(() => this.showNotification("Unable to update name."));
    };

    handleChangePassword = () => {
        if (!this.state.oldPassword || !this.state.newPassword) {
            this.showNotification("All password fields are required.");
            return;
        }
        if (this.state.newPassword !== this.state.confirmPassword) {
            this.showNotification("New passwords do not match.");
            return;
        }
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + sessionStorage.getItem("access-token"),
        };
        const body = JSON.stringify({
            old_password: this.state.oldPassword,
            new_password: this.state.newPassword,
        });
        let uri = Config.endpointPrefix + "/api/customer/password";
        fetch(uri, { method: "PUT", headers, body })
            .then((r) => {
                if (r.ok) {
                    this.setState({ oldPassword: "", newPassword: "", confirmPassword: "" });
                    this.showNotification("Password changed successfully!");
                    return r.json();
                } else {
                    throw r;
                }
            })
            .catch(() => this.showNotification("Unable to change password. Check your old password."));
    };

    showNotification = (message) =>
        this.setState({ messageText: message, notificationOpen: true });
    closeNotification = () =>
        this.setState({ messageText: null, notificationOpen: false });

    render() {
        const firstName = this.state.firstName;
        const initial = firstName ? firstName.charAt(0).toUpperCase() : "?";

        return (
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
                <Header showSearch={false} />

                {/* Profile Header */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 4,
                        bgcolor: "background.paper",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            fontSize: 32,
                            fontWeight: 700,
                            bgcolor: "primary.main",
                            mb: 1.5,
                        }}
                    >
                        {initial}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {firstName}
                    </Typography>
                </Box>

                {/* Tabs */}
                <Box sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                        value={this.state.activeTab}
                        onChange={(e, v) => this.setState({ activeTab: v })}
                        centered
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab label="Orders" sx={{ textTransform: "none" }} />
                        <Tab label="Addresses" sx={{ textTransform: "none" }} />
                        <Tab label="Settings" sx={{ textTransform: "none" }} />
                    </Tabs>
                </Box>

                <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 3 }}>
                    {/* Orders Tab */}
                    {this.state.activeTab === 0 && (
                        <OrderHistory orders={this.state.orders} />
                    )}

                    {/* Addresses Tab */}
                    {this.state.activeTab === 1 && (
                        <AddressManager
                            addresses={this.state.addresses}
                            onDeleteAddress={this.handleDeleteAddress}
                        />
                    )}

                    {/* Settings Tab */}
                    {this.state.activeTab === 2 && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, py: 2 }}>
                            {/* Update Name */}
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Update Name
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
                                    <TextField
                                        label="First Name"
                                        variant="outlined"
                                        size="small"
                                        required
                                        value={this.state.editFirstName}
                                        onChange={(e) =>
                                            this.setState({ editFirstName: e.target.value })
                                        }
                                    />
                                    <TextField
                                        label="Last Name"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.editLastName}
                                        onChange={(e) =>
                                            this.setState({ editLastName: e.target.value })
                                        }
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleUpdateName}
                                        sx={{ alignSelf: "flex-start" }}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Change Password */}
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Change Password
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
                                    <TextField
                                        label="Current Password"
                                        variant="outlined"
                                        size="small"
                                        type="password"
                                        required
                                        value={this.state.oldPassword}
                                        onChange={(e) =>
                                            this.setState({ oldPassword: e.target.value })
                                        }
                                    />
                                    <TextField
                                        label="New Password"
                                        variant="outlined"
                                        size="small"
                                        type="password"
                                        required
                                        value={this.state.newPassword}
                                        onChange={(e) =>
                                            this.setState({ newPassword: e.target.value })
                                        }
                                    />
                                    <TextField
                                        label="Confirm New Password"
                                        variant="outlined"
                                        size="small"
                                        type="password"
                                        required
                                        value={this.state.confirmPassword}
                                        onChange={(e) =>
                                            this.setState({ confirmPassword: e.target.value })
                                        }
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleChangePassword}
                                        sx={{ alignSelf: "flex-start" }}
                                    >
                                        Change Password
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Notification
                    messageText={this.state.messageText}
                    open={this.state.notificationOpen}
                    onClose={this.closeNotification}
                />
                <Footer />
            </Box>
        );
    }
}

export default withRouter(Profile);
