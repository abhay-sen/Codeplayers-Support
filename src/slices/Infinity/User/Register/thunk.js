import { User_Post_Register, User_Patch_Register } from "../../../../helpers/fakebackend_helper";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

// Register User
export const POST_USER_Register = createAsyncThunk(
    "userRegister/post",
    async (user, thunkAPI) => {
        try {
            const subscriberID = JSON.parse(localStorage.getItem("vendorUser")).subscriberID;
            console.log({
                SubUserName: user.name,
                Password: user.password,
                WhatsappNumber: user.mobile,
                EmailID: user.email,
                UserType: JSON.parse(localStorage.getItem("vendorUser")).userType,
                SubscriberID: subscriberID,
                UserRole: user.userRole,
                IsActive: user.isActive,
            })
            const response = User_Post_Register({
                SubUserName: user.name,
                Password: user.password,
                WhatsappNumber: user.mobile,
                EmailID: user.email,
                UserType: JSON.parse(localStorage.getItem("vendorUser")).userType,
                SubscriberID: subscriberID,
                UserRole:user.userRole,
                IsActive: user.isActive,
            });

            const data = await response;

            // Show success toast
            toast.success("User registered successfully!");
            return data;
        } catch (error) {
            // Show error toast
            toast.error(error.response?.data || "Error during sign up");
            return thunkAPI.rejectWithValue(error.response?.data || "Error during sign up");
        }
    }
);

// Update User Details
export const PATCH_USER_Data = createAsyncThunk(
    "userRegister/update",
    async (user, thunkAPI) => {
        try {
            const extractAndValidateBase64 = (base64String) => {
                if (!base64String || typeof base64String !== "string") {
                    return { isValid: false, sanitizedString: null };
                }

                // Remove the `data:image/...;base64,` prefix if present
                const sanitizedString = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

                // Validate the remaining string as Base64 (A-Z, a-z, 0-9, +, /, and = for padding)
                const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
                const isValid = base64Pattern.test(sanitizedString);

                return { isValid, sanitizedString: isValid ? sanitizedString : null };
            };

            if (user === undefined || user === null) {
                toast.error("Invalid user data provided.");
                return;
            }

            console.log(user);

            let { SubUserProfileImage } = user;

            if (SubUserProfileImage) {
                const { isValid, sanitizedString } = extractAndValidateBase64(SubUserProfileImage);

                if (!isValid) {
                    toast.error("Invalid profile image. Please upload a valid Base64 encoded image.");
                    return;
                }

                // Use the sanitized Base64 string
                SubUserProfileImage = sanitizedString;
            }

            const response = await User_Patch_Register({
                SubUserName: user.Name,
                SubUserProfileImage: SubUserProfileImage, // Now contains only the Base64 string
                IsActive: user?.IsActive,
            });

            const data = response;

            // Show success toast
            toast.success("User updated successfully!");

            // Update vendorUser data in localStorage
            const vendorUser = JSON.parse(localStorage.getItem("vendorUser"));
            if (vendorUser) {
                vendorUser.subUserName = user.Name;
                vendorUser.subUserProfileImage = SubUserProfileImage; // Update the profile image
                localStorage.setItem("vendorUser", JSON.stringify(vendorUser)); // Save updated data to localStorage
            }

            return data;
        } catch (error) {
            // Show error toast
            toast.error(error.response?.data || "Error during user update.");
            return thunkAPI.rejectWithValue(error.response?.data || "Error during Update User");
        }
    }
);
