import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const VITE_API = 'http://localhost:5000';

const initialState = {
    auctions: null,
    loading: false,
    error: null,
    userData: null,
    userProducts: [],
    auctionById: [],
};

// Fetch all auctions
export const fetchAuctions = createAsyncThunk(
    'auctions/fetchAuctions',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const response = await axios.get(`${VITE_API}/api/auction/show`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch auctions.");
        }
    }
);

// Fetch user data and products
export const fetchUserAndProducts = createAsyncThunk(
    'auctions/fetchUserAndProducts',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const response = await axios.get(`${VITE_API}/api/user/${userId}/products`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch user and products.");
        }
    }
);

// Fetch auction by product ID
export const fetchAuctionById = createAsyncThunk(
    'auctions/fetchAuctionById',
    async (productId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            const response = await axios.get(`${VITE_API}/api/auction/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch auction by ID.");
        }
    }
);

// Auction slice
const auctionSlice = createSlice({
    name: 'auctions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all auctions
            .addCase(fetchAuctions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuctions.fulfilled, (state, action) => {
                state.loading = false;
                state.auctions = action.payload.auctions;
            })
            .addCase(fetchAuctions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch user and products
            .addCase(fetchUserAndProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserAndProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload.user;
                state.userProducts = action.payload.products;
            })
            .addCase(fetchUserAndProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch auction by ID
            .addCase(fetchAuctionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuctionById.fulfilled, (state, action) => {
                state.loading = false;
                state.auctionById = action.payload.auction;
            })
            .addCase(fetchAuctionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default auctionSlice.reducer;
