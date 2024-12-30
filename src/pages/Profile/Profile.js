import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert, Card, CardBody, Container, Row, Col, Form, Input, Label, Button, FormFeedback } from "reactstrap";
import avatar from "../../assets/images/users/avatar-1.jpg"; // Default avatar

import { PATCH_USER_Data } from "../../slices/thunks"; // Adjust the import path as needed
import { FaUserCircle } from "react-icons/fa";
const UserProfile = () => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [role, setRole] = useState("");
    const [image, setImage] = useState(null); // Profile picture (Base64)

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // Resolve the Base64 string
            reader.onerror = reject; // Reject on error
            reader.readAsDataURL(file); // Read file as Base64
        });
    };
    const getImageSrc = (base64String, mimeType = "image/png") => {
        if (!base64String) return "";
        return `data:${mimeType};base64,${base64String}`;
    };

    useEffect(() => {
        const vendorUser = JSON.parse(localStorage.getItem("vendorUser"));
        if (vendorUser) {
            setEmail(localStorage.getItem("userName") || "");
            setUserName(vendorUser.subUserName || "");
            setMobileNumber(vendorUser.mobileNumber || "");
            setRole(vendorUser.userRole || "");
            setImage(vendorUser.SubUserProfileImage || "");
            setImage(getImageSrc(vendorUser.subUserProfileImage, "image/png")||"");
        }
    }); // Added missing dependency array to prevent repeated executions.

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            Name: userName || "Admin",
            SubUserProfileImage: image || "",
        },
        validationSchema: Yup.object({
            Name: Yup.string().required("Please Enter Your UserName"),
        }),
        onSubmit: (values) => {
            const updatedValues = {
                ...values,
                IsActive: true,
            };
            dispatch(PATCH_USER_Data(updatedValues));
        },
    });

    const handleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64Image = await convertToBase64(file);
            setImage(base64Image);
            validation.setFieldValue("SubUserProfileImage", base64Image);
        }
    };

    document.title = "Profile | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content mt-lg-5">
                <Container fluid>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <div className="d-flex">
                                        <div className="mx-3">
                                            {image ? (
                                                          <img
                                                            src={image}
                                                            alt="User Avatar"
                                                            className="avatar-md rounded-circle img-thumbnail"
                                                            style={{ width: "40px", height: "40px" }} // Same size as FaUserCircle icon
                                                          />
                                                        ) : (
                                                          <FaUserCircle size={40} color="#ccc" />
                                                        )}
                                            
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
                                <div className="form-group">
                                    <Label className="form-label">Profile Picture</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        className="form-control"
                                    />
                                </div>

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

                                <Input
                                    name="SubUserProfileImage"
                                    value={validation.values.SubUserProfileImage || ""}
                                    type="hidden"
                                />

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
