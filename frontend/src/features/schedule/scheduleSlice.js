import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchScheduleData } from "../../services/scheduleService";

const initialState = {
  data: {
    firstYear: [],
    secondYear: [],
    thirdYear: [],
  },
  isLoading: false,
  error: null,
};

export const fetchSchedule = createAsyncThunk(
  "schedule/fetchSchedule",
  async (year) => {
    try {
      const data = await fetchScheduleData(year);
      return { year, data };
    } catch (err) {
      throw new Error(err);
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        // console.log("Payload:", action.payload)
        state.isLoading = false;
        if (action.payload && action.payload.data && action.payload.year) {
          state.data[action.payload.year] = action.payload.data;
        } else {
          state.error = "Invalid data format received";
        }
      })
      .addCase(fetchSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch schedule";
      });
  },
});

export default scheduleSlice.reducer;
