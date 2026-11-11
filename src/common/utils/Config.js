var Config = {
    "endpointPrefix": "http://localhost:8080",
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
            }
        ]
}

export default Config;