import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import Notification from "../../common/notification/Notification";
import Footer from "../../common/footer/Footer";
import Config from "../../common/utils/Config";
import brand from "../../theme/brand";
import * as EmailValidator from "email-validator";
import { isLoggedIn } from "../../common/utils/AuthGuard";

export default function Login() {
    const navigate = useNavigate();
    const googleBtnRef = useRef(null);

    const [mode, setMode] = useState("login");
    const [contactno, setContactno] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [signUpContactno, setSignUpContactno] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [notification, setNotification] = useState({ open: false, message: "" });

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/");
        }
    }, [navigate]);

    const handleGoogleResponse = useCallback(
        (response) => {
            const uri =
                Config.endpointPrefix +
                Config.endpoints.find((e) => e.name === "Google Login").uri;
            fetch(uri, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_token: response.credential }),
            })
                .then((res) => {
                    if (res.status === 200) {
                        sessionStorage.setItem(
                            "access-token",
                            res.headers.get("access-token")
                        );
                        return res.json();
                    }
                    throw res;
                })
                .then((data) => {
                    sessionStorage.setItem("uuid", data.id);
                    sessionStorage.setItem("first-name", data.first_name);
                    if (data.role) sessionStorage.setItem("role", data.role);
                    navigate("/");
                })
                .catch(() => {
                    setApiError("Google sign-in failed. Please try again.");
                });
        },
        [navigate]
    );

    useEffect(() => {
        const initGoogle = () => {
            if (window.google && googleBtnRef.current) {
                window.google.accounts.id.initialize({
                    client_id: brand.googleClientId,
                    callback: handleGoogleResponse,
                });
                window.google.accounts.id.renderButton(googleBtnRef.current, {
                    theme: "outline",
                    size: "large",
                    width: googleBtnRef.current.offsetWidth || 340,
                    text: "signin_with",
                });
            }
        };
        initGoogle();
        const timer = setTimeout(initGoogle, 1000);
        return () => clearTimeout(timer);
    }, [handleGoogleResponse, mode]);

    const handleLogin = () => {
        const errs = {};
        if (!contactno) errs.contactno = "required";
        else if (!/^\d{10}$/.test(contactno))
            errs.contactno = "Invalid Contact";
        if (!password) errs.password = "required";
        setErrors(errs);
        setApiError("");
        if (Object.keys(errs).length > 0) return;

        const headers = {
            Accept: "application/json",
            authorization: "Basic " + window.btoa(contactno + ":" + password),
        };
        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Login").uri;
        fetch(uri, { method: "POST", headers })
            .then((res) => {
                if (res.status === 200) {
                    sessionStorage.setItem(
                        "access-token",
                        res.headers.get("access-token")
                    );
                    return res.json();
                }
                throw res;
            })
            .then((data) => {
                sessionStorage.setItem("uuid", data.id);
                sessionStorage.setItem("first-name", data.first_name);
                if (data.role) sessionStorage.setItem("role", data.role);
                navigate("/");
            })
            .catch((err) => {
                if (err.text) {
                    err.text().then((msg) => {
                        try {
                            setApiError(JSON.parse(msg).message);
                        } catch {
                            setApiError("Login failed. Please try again.");
                        }
                    });
                } else {
                    setApiError("Login failed. Please try again.");
                }
            });
    };

    const handleSignUp = () => {
        const errs = {};
        if (!firstName) errs.firstName = "required";
        if (!email) errs.email = "required";
        else if (!EmailValidator.validate(email)) errs.email = "Invalid Email";
        if (!signUpPassword) errs.signUpPassword = "required";
        else if (
            !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
                signUpPassword
            )
        )
            errs.signUpPassword =
                "Must contain uppercase, lowercase, number, and special character";
        if (!signUpContactno) errs.signUpContactno = "required";
        else if (!/^\d{10}$/.test(signUpContactno))
            errs.signUpContactno = "Must be 10 digits";
        setErrors(errs);
        setApiError("");
        if (Object.keys(errs).length > 0) return;

        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        const body = JSON.stringify({
            email_address: email,
            first_name: firstName,
            last_name: lastName,
            contact_number: signUpContactno,
            password: signUpPassword,
        });
        const uri =
            Config.endpointPrefix +
            Config.endpoints.find((e) => e.name === "Sign up").uri;
        fetch(uri, { method: "POST", headers, body })
            .then((res) => {
                if (res.status === 201) {
                    setNotification({
                        open: true,
                        message: "Registered successfully! Please login now!",
                    });
                    setMode("login");
                    setErrors({});
                    setApiError("");
                    return res.json();
                }
                throw res;
            })
            .catch((err) => {
                if (err.text) {
                    err.text().then((msg) => {
                        try {
                            setApiError(JSON.parse(msg).message);
                        } catch {
                            setApiError("Sign up failed. Please try again.");
                        }
                    });
                } else {
                    setApiError("Sign up failed. Please try again.");
                }
            });
    };

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                    py: 4,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        maxWidth: 420,
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    {/* Brand Header */}
                    <Box
                        sx={{
                            background:
                                "linear-gradient(135deg, #E23744 0%, #FF6B6B 100%)",
                            py: 3.5,
                            px: 3,
                            textAlign: "center",
                        }}
                    >
                        <FastfoodIcon
                            sx={{ fontSize: 40, color: "#fff", mb: 0.5 }}
                        />
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: "#fff" }}
                        >
                            {brand.appName}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: "rgba(255,255,255,0.85)", mt: 0.5 }}
                        >
                            {brand.tagline}
                        </Typography>
                    </Box>

                    {/* Form Body */}
                    <Box sx={{ p: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 2.5, textAlign: "center" }}
                        >
                            {mode === "login" ? "Welcome back" : "Create an account"}
                        </Typography>

                        {/* Google Sign-In */}
                        {mode === "login" && (
                            <>
                                <Box
                                    ref={googleBtnRef}
                                    id="google-signin-btn"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mb: 2.5,
                                        "& > div": { width: "100% !important" },
                                    }}
                                />
                                <Divider sx={{ mb: 2.5 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary", px: 1 }}
                                    >
                                        or continue with phone number
                                    </Typography>
                                </Divider>
                            </>
                        )}

                        {apiError && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ display: "block", mb: 1.5, textAlign: "center" }}
                            >
                                {apiError}
                            </Typography>
                        )}

                        {mode === "login" ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="Contact No."
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    value={contactno}
                                    onChange={(e) => setContactno(e.target.value)}
                                    error={!!errors.contactno}
                                    helperText={errors.contactno || ""}
                                />
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={!!errors.password}
                                    helperText={errors.password || ""}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleLogin();
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleLogin}
                                    sx={{ mt: 0.5, py: 1.2 }}
                                >
                                    Login
                                </Button>
                                <Typography
                                    variant="body2"
                                    sx={{ textAlign: "center", mt: 1 }}
                                >
                                    Don't have an account?{" "}
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{
                                            color: "primary.main",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setMode("signup");
                                            setErrors({});
                                            setApiError("");
                                        }}
                                    >
                                        Sign up
                                    </Typography>
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName || ""}
                                />
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={!!errors.email}
                                    helperText={errors.email || ""}
                                />
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    type="password"
                                    value={signUpPassword}
                                    onChange={(e) =>
                                        setSignUpPassword(e.target.value)
                                    }
                                    error={!!errors.signUpPassword}
                                    helperText={errors.signUpPassword || ""}
                                />
                                <TextField
                                    label="Contact No."
                                    variant="outlined"
                                    size="small"
                                    required
                                    fullWidth
                                    value={signUpContactno}
                                    onChange={(e) =>
                                        setSignUpContactno(e.target.value)
                                    }
                                    error={!!errors.signUpContactno}
                                    helperText={errors.signUpContactno || ""}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleSignUp}
                                    sx={{ mt: 0.5, py: 1.2 }}
                                >
                                    Sign Up
                                </Button>
                                <Typography
                                    variant="body2"
                                    sx={{ textAlign: "center", mt: 1 }}
                                >
                                    Already have an account?{" "}
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{
                                            color: "primary.main",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setMode("login");
                                            setErrors({});
                                            setApiError("");
                                        }}
                                    >
                                        Login
                                    </Typography>
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>
            <Footer />
            <Notification
                messageText={notification.message}
                open={notification.open}
                onClose={() => setNotification({ open: false, message: "" })}
            />
        </Box>
    );
}
