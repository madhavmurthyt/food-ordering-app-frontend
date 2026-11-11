import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./screens/home/Home";
import Details from "./screens/details/Details";
import Checkout from "./screens/checkout/Checkout";
import Profile from "./screens/profile/Profile"

const baseUrl = "http://localhost:8080/api/";

export default function FoodOrderingApp() {
    return (
        <Routes>
            <Route path="/" element={<Home baseUrl={baseUrl}/>}/>
            <Route path="/restaurant/:restaurantId" element={<Details baseUrl={baseUrl}/>}/>
            <Route path="/checkout" element={<Checkout baseUrl={baseUrl}/>}/>
            <Route path="/profile" element={<Profile/>}/>
        </Routes>
    );
}
