import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert, Card, CardBody, Container, Row, Col, Form, Input, Label, Button, FormFeedback } from "reactstrap";
import avatar from "../../assets/images/users/avatar-1.jpg"; // Default avatar

// Actions
import { PATCH_USER_Data } from "../../slices/thunks"; // Adjust the import path as needed

const UserProfile = () => {
    const dispatch = useDispatch();

    // State variables
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [role, setRole] = useState("");
    const [image, setImage] = useState(null); // Profile picture (Base64)

    // const { error, success } = useSelector((state) => state.profile); // Adjust based on your store structure

    useEffect(() => {
        // Fetch user data from localStorage
        const vendorUser = JSON.parse(localStorage.getItem("vendorUser"));
        console.log(vendorUser);
        if (vendorUser) {
            setEmail(localStorage.getItem("userName") || ""); // Set email from localStorage
            setUserName(vendorUser.subUserName || ""); // Set username
            setMobileNumber(vendorUser.mobileNumber || ""); // Set mobile number
            setRole(vendorUser.userRole || ""); // Set role
            setImage(vendorUser.SubUserProfileImage || avatar); // Set profile image
        }
    });

    // Function to convert image to Base64 string
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // Resolve the Base64 string
            reader.onerror = reject; // Reject on error
            reader.readAsDataURL(file); // Read file as Base64
        });
    };

    // Formik validation and submission
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            Name: userName || "Admin", // Username
            SubUserProfileImage: image || "", // Profile image (Base64)
        },
        validationSchema: Yup.object({
            Name: Yup.string().required("Please Enter Your UserName"), // Username validation
        }),
        onSubmit: (values) => {
            // Dispatch the action to update the profile with username and profile image
            dispatch(PATCH_USER_Data(values));
        },
    });

    // Handle profile image change
    const handleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Convert image to Base64 format
            const base64Image = await convertToBase64(file);
            setImage(base64Image); // Update image state with the Base64 string
            validation.setFieldValue("SubUserProfileImage", base64Image); // Set Base64 string in Formik
        }
    };

    document.title = "Profile | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content mt-lg-5">
                <Container fluid>
                    <Row>
                        <Col lg="12">
                            {/* {error && <Alert color="danger">{error}</Alert>}
                            {success && <Alert color="success">Username Updated To {userName}</Alert>} */}

                            {/* User Profile Info */}
                            <Card>
                                <CardBody>
                                    <div className="d-flex">
                                        <div className="mx-3">
                                            <img
                                                src={image || avatar} // Use profile image or default avatar
                                                alt="User Avatar"
                                                className="avatar-md rounded-circle img-thumbnail"
                                            />
                                        </div>
                                        <div className="flex-grow-1 align-self-center">
                                            <div className="text-muted">
                                                <h5>{userName || "Admin"}</h5>
                                                <p className="mb-1">Email: {email || "Not available"}</p>
                                                <p className="mb-1">Mobile: {mobileNumber || "Not available"}</p>
                                                <p className="mb-0">Role: {role || "Not available"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <h4 className="card-title mb-4">Change User Name</h4>

                    {/* Form to Update Username and Profile Image */}
                    <Card>
                        <CardBody>
                            <Form
                                className="form-horizontal"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validation.handleSubmit();
                                    return false;
                                }}
                            >
                                {/* Profile Image Upload */}
                                <div className="form-group">
                                    <Label className="form-label">Profile Picture</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        className="form-control"
                                    />
                                </div>

                                {/* Username Input */}
                                <div className="form-group">
                                    <Label className="form-label">User Name</Label>
                                    <Input
                                        name="Name"
                                        className="form-control"
                                        placeholder="Enter User Name"
                                        type="text"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.Name || ""}
                                        invalid={validation.touched.Name && validation.errors.Name ? true : false}
                                    />
                                    {validation.touched.Name && validation.errors.Name ? (
                                        <FormFeedback type="invalid">{validation.errors.Name}</FormFeedback>
                                    ) : null}
                                </div>

                                {/* Hidden Field for Profile Image */}
                                <Input name="SubUserProfileImage" value={image} type="hidden" />

                                <div className="text-center mt-4">
                                    <Button type="submit" color="danger">
                                        Update Profile
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default UserProfile;
