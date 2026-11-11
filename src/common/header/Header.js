import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import * as EmailValidator from "email-validator";
import Notification from "../notification/Notification";
import Config from "../utils/Config";
import brand from "../../theme/brand";

const withMediaQuery = () => (Component) => (props) => {
    const isSmallScreen = useMediaQuery("(max-width:650px)");
    return <Component isSmallScreen={isSmallScreen} {...props} />;
};

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            value: 0,
            contactno: "",
            contactnoRequired: false,
            loginContactInvalid: false,
            password: "",
            passwordRequired: false,
            loginError: {},
            loginErrorSpan: false,
            loggedIn: sessionStorage.getItem("access-token") != null,

            firstName: "",
            firstNameRequired: false,
            lastName: "",
            email: "",
            emailRequired: false,
            emailInvalid: false,
            signUpContactno: "",
            signUpcontactnoRequired: false,
            signUpcontactInvalid: false,
            signUpPassword: "",
            signUpPasswordRequired: false,
            signUpPasswordInvalid: false,
            signUpError: {},
            signUpErrorSpan: false,

            messageText: null,
            notificationOpen: false,
            anchorEl: null,
        };
        this.loggedinMessage = "Logged in successfully!";
        this.signedUpMessage = "Registered successfully! Please login now!";
        this.closeNotification = this.closeNotification.bind(this);
    }

    openModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            value: 0,
            contactno: "",
            contactnoRequired: false,
            loginContactInvalid: false,
            password: "",
            passwordRequired: false,
            signUpPassword: "",
            signUpPasswordRequired: false,
            signUpPasswordInvalid: false,
            signUpContactno: "",
            signUpcontactnoRequired: false,
            signUpcontactInvalid: false,
            firstName: "",
            firstNameRequired: false,
            lastName: "",
            email: "",
            emailRequired: false,
            emailInvalid: false,
            signUpError: {},
            signUpErrorSpan: false,
            loginError: {},
            loginErrorSpan: false,
        });
    };

    goHomeHandler = () => {
        window.location.href = "/";
    };

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    };

    onTabChange = (event, value) => {
        this.setState({ value });
    };

    openMenuHandler = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
    };

    logout = () => {
        const accessToken = sessionStorage.getItem("access-token");
        if (accessToken) {
            const headers = {
                Accept: "application/json",
                authorization: "Bearer " + accessToken,
            };
            fetch(Config.endpointPrefix + "/api/customer/logout", {
                method: "POST",
                headers,
            }).catch(() => {});
        }
        sessionStorage.removeItem("access-token");
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("first-name");
        this.setState({ loggedIn: false });
        this.handleMenuClose();
    };

    onLoginClick = () => {
        let isAnyRequiredFieldEmpty = false;
        if (this.isContactNumberEmptyForLogin(this.state.contactno)) {
            isAnyRequiredFieldEmpty = true;
        }
        if (this.isPasswordEmptyForLogin(this.state.password)) {
            isAnyRequiredFieldEmpty = true;
        }
        if (isAnyRequiredFieldEmpty === false) {
            if (this.isValidContactNoForLogin(this.state.contactno)) {
                let that = this;
                const headers = {
                    Accept: "application/json",
                    authorization:
                        "Basic " +
                        window.btoa(
                            this.state.contactno + ":" + this.state.password
                        ),
                };
                let uri =
                    Config.endpointPrefix +
                    Config.endpoints.find(
                        (endpoint) => endpoint.name === "Login"
                    ).uri;
                fetch(uri, { method: "POST", headers })
                    .then(function (response) {
                        if (response.status === 200) {
                            sessionStorage.setItem(
                                "access-token",
                                response.headers.get("access-token")
                            );
                            return response.json();
                        } else {
                            throw response;
                        }
                    })
                    .then(function (data) {
                        sessionStorage.setItem("uuid", data.id);
                        sessionStorage.setItem("first-name", data.first_name);
                        that.showNotification(that.loggedinMessage);
                        that.setState({ loginErrorSpan: false });
                        that.setState({ value: 0 });
                        that.setState({ loggedIn: true });
                        that.closeModal();
                    })
                    .catch((err) => {
                        err.text().then((errorMessage) => {
                            that.setState({ loginErrorSpan: true });
                            that.setState({
                                loginError: JSON.parse(errorMessage),
                            });
                        });
                    });
            }
        }
    };

    onSignUpClick = () => {
        let isAnyRequiredFieldEmpty = false;
        let isAnyValidationFailed = false;
        if (this.isFirstNameEmpty(this.state.firstName)) {
            isAnyRequiredFieldEmpty = true;
        }
        if (this.isPasswordEmpty(this.state.signUpPassword)) {
            isAnyRequiredFieldEmpty = true;
        }
        if (this.isContactNumberEmpty(this.state.signUpContactno)) {
            isAnyRequiredFieldEmpty = true;
        }
        if (this.isEmailEmpty(this.state.email)) {
            isAnyRequiredFieldEmpty = true;
        }
        if (!this.isEmailIdValid(this.state.email)) {
            isAnyValidationFailed = true;
        }
        if (!this.isPasswordValid(this.state.signUpPassword)) {
            isAnyValidationFailed = true;
        }
        if (!this.isValidContactNo(this.state.signUpContactno)) {
            isAnyValidationFailed = true;
        }
        if (
            isAnyValidationFailed === false &&
            isAnyRequiredFieldEmpty === false
        ) {
            let that = this;
            let dataSignUp = JSON.stringify({
                email_address: this.state.email,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                contact_number: this.state.signUpContactno,
                password: this.state.signUpPassword,
            });
            const headers = {
                Accept: "application/json",
                "Content-Type": "application/json",
            };
            let uri =
                Config.endpointPrefix +
                Config.endpoints.find(
                    (endpoint) => endpoint.name === "Sign up"
                ).uri;
            fetch(uri, { method: "POST", headers, body: dataSignUp })
                .then(function (response) {
                    if (response.status === 201) {
                        that.setState({ signUpErrorSpan: false });
                        that.setState({ signUpError: {} });
                        that.setState({ value: 0 });
                        that.showNotification(that.signedUpMessage);
                        return response.json();
                    } else {
                        throw response;
                    }
                })
                .catch((err) => {
                    err.text().then((errorMessage) => {
                        that.setState({ signUpErrorSpan: true });
                        that.setState({
                            signUpError: JSON.parse(errorMessage),
                        });
                    });
                });
        }
    };

    isFirstNameEmpty = (firstname) => {
        const empty = firstname === "";
        this.setState({ firstNameRequired: empty });
        return empty;
    };
    isEmailEmpty = (email) => {
        const empty = email === "";
        this.setState({ emailRequired: empty });
        return empty;
    };
    isContactNumberEmpty = (contactno) => {
        const empty = contactno === "";
        this.setState({ signUpcontactnoRequired: empty });
        return empty;
    };
    isContactNumberEmptyForLogin = (contactno) => {
        const empty = contactno === "";
        this.setState({ contactnoRequired: empty });
        return empty;
    };
    isPasswordEmpty = (password) => {
        const empty = password === "";
        this.setState({ signUpPasswordRequired: empty });
        return empty;
    };
    isPasswordEmptyForLogin = (password) => {
        const empty = password === "";
        this.setState({ passwordRequired: empty });
        return empty;
    };
    isEmailIdValid = (email) => {
        let isValid = EmailValidator.validate(email);
        if (!isValid && !this.isEmailEmpty(email)) {
            this.setState({ emailInvalid: true });
            return false;
        } else {
            this.setState({ emailInvalid: false });
            return true;
        }
    };
    isValidContactNo = (contactno) => {
        const isValidContactNo = new RegExp("^\\d{10}$");
        if (
            !isValidContactNo.test(contactno) &&
            !this.isContactNumberEmpty(contactno)
        ) {
            this.setState({ signUpcontactInvalid: true });
            return true;
        } else {
            this.setState({ signUpcontactInvalid: false });
            return false;
        }
    };
    isValidContactNoForLogin = (contactno) => {
        const isValidContactNo = new RegExp("^\\d{10}$");
        if (isValidContactNo.test(contactno)) {
            this.setState({ loginContactInvalid: false });
            return true;
        } else {
            this.setState({ loginContactInvalid: true });
            return false;
        }
    };
    isPasswordValid = (password) => {
        const isValidPassword = new RegExp(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        );
        if (
            !isValidPassword.test(password) &&
            !this.isPasswordEmpty(password)
        ) {
            this.setState({ signUpPasswordInvalid: true });
            return false;
        } else {
            this.setState({ signUpPasswordInvalid: false });
            return true;
        }
    };

    onContactNumberChange = (e) => {
        this.setState({ contactno: e.target.value });
    };
    onSignUpContactNumberChange = (e) => {
        this.setState({ signUpContactno: e.target.value });
    };
    onPasswordChange = (e) => {
        this.setState({ password: e.target.value });
    };
    onSignUpPasswordChange = (e) => {
        this.setState({ signUpPassword: e.target.value });
    };
    onChangeOfFirstName = (e) => {
        this.setState({ firstName: e.target.value });
    };
    onChangeOfLastName = (e) => {
        this.setState({ lastName: e.target.value });
    };
    onChangeOfEmail = (e) => {
        this.setState({ email: e.target.value });
    };

    showNotification = (message) =>
        this.setState({ messageText: message, notificationOpen: true });
    closeNotification = () =>
        this.setState({ messageText: null, notificationOpen: false });

    render() {
        const firstName = sessionStorage.getItem("first-name") || "";
        const initial = firstName.charAt(0).toUpperCase();

        return (
            <Box>
                <AppBar position="sticky" elevation={0}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            flexDirection: this.props.isSmallScreen
                                ? "column"
                                : "row",
                            alignItems: this.props.isSmallScreen
                                ? "flex-start"
                                : "center",
                            justifyContent: "space-between",
                            gap: 1,
                            py: 1,
                        }}
                    >
                        {/* Logo + Brand */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                            onClick={this.goHomeHandler}
                        >
                            <IconButton edge="start" color="primary" size="large">
                                <FastfoodIcon fontSize="large" />
                            </IconButton>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: "primary.main",
                                    ml: -0.5,
                                }}
                            >
                                {brand.appName}
                            </Typography>
                        </Box>

                        {/* Search Bar */}
                        {this.props.showSearch === true && (
                            <Paper
                                elevation={0}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "24px",
                                    bgcolor: "#F0F0F0",
                                    px: 2,
                                    py: 0.5,
                                    width: this.props.isSmallScreen
                                        ? "100%"
                                        : 400,
                                    transition: "width 0.3s",
                                }}
                            >
                                <SearchIcon
                                    sx={{ color: "text.secondary", mr: 1 }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search by Restaurant Name"
                                    onChange={this.props.searchHandler}
                                    style={{
                                        border: "none",
                                        outline: "none",
                                        background: "transparent",
                                        width: "100%",
                                        fontSize: "14px",
                                        fontFamily: "'Poppins', sans-serif",
                                        color: "#1A1A2E",
                                    }}
                                />
                            </Paper>
                        )}

                        {/* Auth Section */}
                        {this.state.loggedIn === false ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.openModalHandler}
                                sx={{
                                    borderRadius: "24px",
                                    px: 3,
                                    textTransform: "none",
                                }}
                            >
                                Login
                            </Button>
                        ) : (
                            <Box>
                                <Button
                                    onClick={this.openMenuHandler}
                                    sx={{
                                        textTransform: "none",
                                        color: "text.primary",
                                        gap: 1,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: "primary.main",
                                            width: 36,
                                            height: 36,
                                            fontSize: 16,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {initial}
                                    </Avatar>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        {firstName}
                                    </Typography>
                                </Button>
                                <Menu
                                    anchorEl={this.state.anchorEl}
                                    open={Boolean(this.state.anchorEl)}
                                    onClose={this.handleMenuClose}
                                    transformOrigin={{
                                        horizontal: "right",
                                        vertical: "top",
                                    }}
                                    anchorOrigin={{
                                        horizontal: "right",
                                        vertical: "bottom",
                                    }}
                                    slotProps={{
                                        paper: {
                                            sx: {
                                                borderRadius: 2,
                                                mt: 1,
                                                minWidth: 160,
                                                boxShadow:
                                                    "0 4px 20px rgba(0,0,0,0.1)",
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem
                                        component={Link}
                                        to="/profile"
                                        onClick={this.handleMenuClose}
                                        sx={{ py: 1.5 }}
                                    >
                                        My Profile
                                    </MenuItem>
                                    <MenuItem
                                        onClick={this.logout}
                                        sx={{ py: 1.5 }}
                                    >
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </Box>
                        )}
                    </Toolbar>
                </AppBar>

                {/* Login/Signup Dialog */}
                <Dialog
                    open={this.state.modalIsOpen}
                    onClose={this.closeModal}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogContent sx={{ p: 0 }}>
                        <Tabs
                            value={this.state.value}
                            onChange={this.onTabChange}
                            variant="fullWidth"
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{ borderBottom: 1, borderColor: "divider" }}
                        >
                            <Tab label="LOGIN" />
                            <Tab label="SIGNUP" />
                        </Tabs>

                        {/* Login Tab */}
                        {this.state.value === 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    p: 3,
                                }}
                            >
                                <TextField
                                    label="Contact No."
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    value={this.state.contactno}
                                    onChange={this.onContactNumberChange}
                                    error={
                                        this.state.contactnoRequired ||
                                        this.state.loginContactInvalid
                                    }
                                    helperText={
                                        this.state.contactnoRequired
                                            ? "required"
                                            : this.state.loginContactInvalid
                                            ? "Invalid Contact"
                                            : ""
                                    }
                                />
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.onPasswordChange}
                                    error={this.state.passwordRequired}
                                    helperText={
                                        this.state.passwordRequired
                                            ? "required"
                                            : ""
                                    }
                                />
                                {this.state.loginErrorSpan && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                    >
                                        {this.state.loginError.message}
                                    </Typography>
                                )}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={this.onLoginClick}
                                    sx={{ mt: 1 }}
                                >
                                    Login
                                </Button>
                            </Box>
                        )}

                        {/* Signup Tab */}
                        {this.state.value === 1 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    p: 3,
                                }}
                            >
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    value={this.state.firstName}
                                    onChange={this.onChangeOfFirstName}
                                    error={this.state.firstNameRequired}
                                    helperText={
                                        this.state.firstNameRequired
                                            ? "required"
                                            : ""
                                    }
                                />
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={this.state.lastName}
                                    onChange={this.onChangeOfLastName}
                                />
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    type="email"
                                    value={this.state.email}
                                    onChange={this.onChangeOfEmail}
                                    error={
                                        this.state.emailRequired ||
                                        this.state.emailInvalid
                                    }
                                    helperText={
                                        this.state.emailRequired
                                            ? "required"
                                            : this.state.emailInvalid
                                            ? "Invalid Email"
                                            : ""
                                    }
                                />
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    type="password"
                                    value={this.state.signUpPassword}
                                    onChange={this.onSignUpPasswordChange}
                                    error={
                                        this.state.signUpPasswordRequired ||
                                        this.state.signUpPasswordInvalid
                                    }
                                    helperText={
                                        this.state.signUpPasswordRequired
                                            ? "required"
                                            : this.state.signUpPasswordInvalid
                                            ? "Password must contain at least one capital letter, one small letter, one number, and one special character"
                                            : ""
                                    }
                                />
                                <TextField
                                    label="Contact No."
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    value={this.state.signUpContactno}
                                    onChange={
                                        this.onSignUpContactNumberChange
                                    }
                                    error={
                                        this.state.signUpcontactnoRequired ||
                                        this.state.signUpcontactInvalid
                                    }
                                    helperText={
                                        this.state.signUpcontactnoRequired
                                            ? "required"
                                            : this.state.signUpcontactInvalid
                                            ? "Contact No. must contain only numbers and must be 10 digits long"
                                            : ""
                                    }
                                />
                                {this.state.signUpErrorSpan && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                    >
                                        {this.state.signUpError.message}
                                    </Typography>
                                )}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={this.onSignUpClick}
                                    sx={{ mt: 1 }}
                                >
                                    Signup
                                </Button>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>

                <Notification
                    messageText={this.state.messageText}
                    open={this.state.notificationOpen}
                    onClose={this.closeNotification}
                />
            </Box>
        );
    }
}

export default withMediaQuery()(Header);
