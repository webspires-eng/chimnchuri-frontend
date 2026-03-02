"use client"

import { createSlice } from '@reduxjs/toolkit';



const initialState = {
    items: [], // Array of cart items
    totalItems: 0,
    totalPrice: 0,
    isCartOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { item, selectedSize, selectedAddons, quantity, addonGroups } = action.payload;

            // Process addons into a structured array
            let processedAddons = [];
            let addonTotal = 0;

            if (selectedAddons && addonGroups) {
                Object.entries(selectedAddons).forEach(([groupId, addonQtys]) => {
                    const group = addonGroups.find(g => g.id === parseInt(groupId));
                    if (group) {
                        Object.entries(addonQtys).forEach(([addonId, qty]) => {
                            const addon = group.items.find(a => a.id === parseInt(addonId));
                            if (addon) {
                                let price = parseFloat(addon.price);
                                if (!price || price === 0) {
                                    price = parseFloat(addon.addon_item?.price) || 0;
                                }
                                processedAddons.push({
                                    id: addon.id,
                                    name: addon.addon_item.name,
                                    price: price,
                                    qty: qty,
                                    category: group.addon_category.name,
                                    groupId: group.id
                                });
                                addonTotal += price * qty;
                            }
                        });
                    }
                });
            }

            // Calculate total price for this item
            const itemTotal = (parseFloat(selectedSize.price) + addonTotal) * quantity;

            // Create cart item object
            const cartItem = {
                id: `${item.id}-${selectedSize.id}-${Date.now()}`, // Unique ID for cart item
                productId: item.id,
                name: item.name,
                description: item.description,
                image: item.media?.[0]?.original_url || '',
                selectedSize: {
                    id: selectedSize.id,
                    name: selectedSize.name,
                    price: selectedSize.price,
                },
                selectedAddons: processedAddons, // Store the structured array
                quantity,
                itemTotal,
            };

            // Add to cart
            const maxItems = process.env.NEXT_PUBLIC_MAX_CART_ITEMS ? parseInt(process.env.NEXT_PUBLIC_MAX_CART_ITEMS) : 5;
            if (state.totalItems + quantity > maxItems) {
                return state;
            }

            state.items.push(cartItem);
            state.totalItems += quantity;
            state.totalPrice += itemTotal;
            // state.isCartOpen = true; // Open cart when adding


            localStorage.setItem("cartItems", JSON.stringify({
                items: state.items,
                totalItems: state.totalItems,
                totalPrice: state.totalPrice
            }));
        },

        removeFromCart: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find(item => item.id === itemId);

            if (item) {
                state.totalItems -= item.quantity;
                state.totalPrice -= item.itemTotal;
                state.items = state.items.filter(item => item.id !== itemId);

                localStorage.setItem("cartItems", JSON.stringify({
                    items: state.items,
                    totalItems: state.totalItems,
                    totalPrice: state.totalPrice
                }));
            }
        },

        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);

            if (item && quantity > 0) {
                const maxItems = process.env.NEXT_PUBLIC_MAX_CART_ITEMS ? parseInt(process.env.NEXT_PUBLIC_MAX_CART_ITEMS) : 5;
                const newTotalItems = state.totalItems - item.quantity + quantity;

                if (newTotalItems > maxItems) {
                    return state;
                }

                const oldTotal = item.itemTotal;
                const pricePerItem = oldTotal / item.quantity;
                const newTotal = pricePerItem * quantity;

                state.totalItems = newTotalItems;
                state.totalPrice = state.totalPrice - oldTotal + newTotal;

                item.quantity = quantity;
                item.itemTotal = newTotal;

                localStorage.setItem("cartItems", JSON.stringify({
                    items: state.items,
                    totalItems: state.totalItems,
                    totalPrice: state.totalPrice
                }));
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
            localStorage.removeItem("cartItems");
        },

        incrementQuantity: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find(item => item.id === itemId);

            if (item) {
                const maxItems = process.env.NEXT_PUBLIC_MAX_CART_ITEMS ? parseInt(process.env.NEXT_PUBLIC_MAX_CART_ITEMS) : 5;
                if (state.totalItems >= maxItems) {
                    return state;
                }

                const pricePerItem = item.itemTotal / item.quantity;
                item.quantity += 1;
                item.itemTotal += pricePerItem;
                state.totalItems += 1;
                state.totalPrice += pricePerItem;

                localStorage.setItem("cartItems", JSON.stringify({
                    items: state.items,
                    totalItems: state.totalItems,
                    totalPrice: state.totalPrice
                }));
            }
        },


        decrementQuantity: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find(item => item.id === itemId);

            if (item && item.quantity > 1) {
                const pricePerItem = item.itemTotal / item.quantity;
                item.quantity -= 1;
                item.itemTotal -= pricePerItem;
                state.totalItems -= 1;
                state.totalPrice -= pricePerItem;

                localStorage.setItem("cartItems", JSON.stringify({
                    items: state.items,
                    totalItems: state.totalItems,
                    totalPrice: state.totalPrice
                }));
            }
        },
        initializeCart: (state, action) => {
            state.items = action.payload.items;
            state.totalItems = action.payload.totalItems;
            state.totalPrice = action.payload.totalPrice;
        },
        toggleCart: (state, action) => {
            state.isCartOpen = action.payload !== undefined ? action.payload : !state.isCartOpen;
        }

    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    incrementQuantity,
    decrementQuantity,
    initializeCart,
    toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;
