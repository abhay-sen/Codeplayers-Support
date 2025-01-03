import { ERP_GET_VendorDashboard } from "../../../helpers/fakebackend_helper";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const GET_VendorDashboard = createAsyncThunk(
  "vendorDashboard/get",
  async ( thunkAPI) => {
    try {
      

      const response = ERP_GET_VendorDashboard();
      const data = await response;
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const applyFilters = (existingData, filterArray) => {
  let result = existingData;

  if (filterArray.Accounts.length > 0) {
    result = result.filter((item) => filterArray.Accounts.includes(item.party));
  }

  return result;
};
