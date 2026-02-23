

// LOGIN

import { apiClient } from "./apiClient";


export const registerApi = async (data) => {
    const res = await apiClient("/register", {
        method: "POST",
        body: JSON.stringify(data)

    });

    return res;
}

export async function login(data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.message || "Failed to login");
    }
    return res.json();
}
// PROFILE
export const fetchProfile = () => apiClient("/profile");

export const logoutApi = () => apiClient("/logout", {
    method: "POST",
});

export const updateProfile = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
        }
    });


    return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile`, {
        method: "POST",
        body: formData,
        credentials: "include",

        headers: {
            "Accept": "application/json",
        },
    }).then(res => res.json());
};


// GET ALL CATEGORIES
export async function fetchCategories() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/categories`);

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    return res.json();
}

export async function fetchCategory(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/categories/${slug}`);
    if (!res.ok) {
        throw new Error("Failed to fetch category");
    }

    return res.json();
}

// CHECKCOUT 
export const createOrder = (data) => apiClient("/process-checkout", {
    method: "POST",
    body: JSON.stringify(data)
});


// ORDERS
export const fetchOrders = () => apiClient("/orders");

export const fetchOrder = (id) => apiClient(`/orders/${id}`);




// SETTINGS
export const settings = () => apiClient("/settings");

// GET PAYMENTS SETTINGS
export const paymentSettings = () => apiClient("/payment-settings");

// time slots
export const timeSlots = () => apiClient("/time-slots");


// PASSWORD RESET
export const forgotPasswordApi = (data) => apiClient("/forgot-password", {
    method: "POST",
    body: JSON.stringify(data)
});

export const resetPasswordApi = (data) => apiClient("/reset-password", {
    method: "POST",
    body: JSON.stringify(data)
});


// OFFER
export const fetchOffer = () => apiClient("/offer");

// CONTACT
export const sendContactEmailApi = (data) => apiClient("/contact", {
    method: "POST",
    body: JSON.stringify(data)
});

// TEAM
export const fetchTeamApi = () => apiClient("/teams");


