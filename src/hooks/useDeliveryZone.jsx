"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { fetchDeliveryZones, searchPostcodesApi, checkDeliveryApi } from "@/lib/api";

/**
 * Custom hook for delivery zone checking (two-step flow)
 *
 * Step 1: searchAddress(query) — searches postcodes via backend Postcoder API
 * Step 2: selectAddress(postcodeObj) — user picks a postcode, backend calculates zone
 *
 * All distance calculation and geocoding now happens on the backend using the Postcoder API.
 */
const useDeliveryZone = () => {
    const [deliveryZone, setDeliveryZone] = useState(null);
    const [distance, setDistance] = useState(null);
    const [isOutOfRange, setIsOutOfRange] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState(null);
    const [customerAddress, setCustomerAddress] = useState(null);
    const [zones, setZones] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Cache zones to avoid re-fetching
    const zonesCacheRef = useRef(null);

    const getZones = useCallback(async () => {
        if (zonesCacheRef.current) return zonesCacheRef.current;
        const response = await fetchDeliveryZones();
        const zonesData = response.data || response;
        zonesCacheRef.current = zonesData;
        setZones(zonesData);
        return zonesData;
    }, []);

    // Eagerly fetch zones on mount so info cards show immediately
    useEffect(() => {
        getZones().catch(() => { });
    }, [getZones]);

    /**
     * Step 1: Search postcodes — calls backend which uses Postcoder API
     */
    const searchAddress = useCallback(
        async (query) => {
            if (!query || query.trim().length < 2) {
                setError("Please enter at least 2 characters");
                return [];
            }

            setIsSearching(true);
            setError(null);
            setSearchResults([]);
            setShowDropdown(false);
            setDeliveryZone(null);
            setIsOutOfRange(false);
            setDistance(null);
            setCustomerAddress(null);

            try {
                const response = await searchPostcodesApi(query);

                if (!response.success) {
                    throw new Error(response.message || "Search failed");
                }

                const results = response.data || [];

                if (results.length === 0) {
                    setError("No postcodes found. Please check and try again.");
                    setIsSearching(false);
                    return [];
                }

                setSearchResults(results);
                setShowDropdown(true);
                setIsSearching(false);
                return results;
            } catch (err) {
                setError("No postcodes found. Please check and try again.");
                setIsSearching(false);
                setSearchResults([]);
                return [];
            }
        },
        []
    );

    /**
     * Step 2: User selects a postcode from dropdown — backend calculates distance & zone
     */
    const selectAddress = useCallback(
        async (postcodeObj) => {
            setShowDropdown(false);
            setSearchResults([]);
            setIsChecking(true);
            setError(null);
            setDeliveryZone(null);
            setIsOutOfRange(false);
            setDistance(null);

            try {
                // Ensure zones are loaded for local state
                await getZones();

                // Call backend to check delivery - it handles geocoding & distance calculation
                const response = await checkDeliveryApi(postcodeObj.postcode);

                if (!response.success) {
                    throw new Error(response.message || "Delivery check failed");
                }

                setCustomerAddress(postcodeObj);

                if (response.can_deliver && response.data) {
                    const roundedDist = response.data.distance;
                    setDistance(roundedDist);

                    // Build zone object matching what the rest of the app expects
                    const matchedZone = {
                        id: response.data.zone_id,
                        name: response.data.zone_name,
                        delivery_fee: response.data.delivery_fee,
                        minimum_order_amount: response.data.minimum_order_amount,
                    };

                    setDeliveryZone(matchedZone);
                    setIsOutOfRange(false);
                    setIsChecking(false);
                    return {
                        zone: matchedZone,
                        distance: roundedDist,
                        deliveryFee: matchedZone.delivery_fee,
                        minOrderAmount: matchedZone.minimum_order_amount,
                        customerAddress: postcodeObj,
                    };
                } else {
                    // Out of range
                    const dist = response.distance || 0;
                    setDistance(dist);
                    setIsOutOfRange(true);
                    setIsChecking(false);
                    return {
                        zone: null,
                        distance: dist,
                        deliveryFee: 0,
                        minOrderAmount: 0,
                        customerAddress: postcodeObj,
                    };
                }
            } catch (err) {
                setError(err.message || "Unable to verify delivery address. Please try again.");
                setIsChecking(false);
                return null;
            }
        },
        [getZones]
    );

    const reset = useCallback(() => {
        setDeliveryZone(null);
        setDistance(null);
        setIsOutOfRange(false);
        setIsSearching(false);
        setIsChecking(false);
        setError(null);
        setCustomerAddress(null);
        setSearchResults([]);
        setShowDropdown(false);
    }, []);

    return {
        searchAddress,
        selectAddress,
        deliveryZone,
        distance,
        deliveryFee: deliveryZone?.delivery_fee ?? 0,
        minOrderAmount: deliveryZone?.minimum_order_amount ?? 0,
        isOutOfRange,
        isSearching,
        isChecking,
        error,
        customerAddress,
        zones,
        searchResults,
        showDropdown,
        setShowDropdown,
        reset,
    };
};

export default useDeliveryZone;
