var Config = {
    "endpointPrefix": process.env.REACT_APP_API_URL || "http://localhost:8080",
    "endpoints":
        [
            {
                "name": "Get Addresses",
                "uri": "/api/address/customer"
            },
            {
                "name": "Get States",
                "uri": "/api/states"
            },
            {
                "name": "Save Address",
                "uri": "/api/address"
            },
            {
                "name": "Get Payment Modes",
                "uri": "/api/payment"
            },
            {
                "name": "Save Order",
                "uri": "/api/order"
            },
            {
                "name" : "Login",
                "uri" : "/api/customer/login"
            },
            {
                "name" : "Sign up",
                "uri" : "/api/customer/signup"
            },
            {
                "name": "Get Orders",
                "uri": "/api/order"
            },
            {
                "name": "Update Customer",
                "uri": "/api/customer"
            },
            {
                "name": "Change Password",
                "uri": "/api/customer/password"
            },
            {
                "name": "Delete Address",
                "uri": "/api/address"
            },
            {
                "name": "Google Login",
                "uri": "/api/customer/google-login"
            },
            {
                "name": "Admin Dashboard",
                "uri": "/api/admin/dashboard"
            },
            {
                "name": "Admin Users",
                "uri": "/api/admin/users"
            },
            {
                "name": "Admin User Role",
                "uri": "/api/admin/users"
            },
            {
                "name": "Admin Restaurants",
                "uri": "/api/admin/restaurants"
            },
            {
                "name": "Admin Restaurant Status",
                "uri": "/api/admin/restaurants"
            },
            {
                "name": "Admin Orders",
                "uri": "/api/admin/orders"
            }
        ]
}

export default Config;