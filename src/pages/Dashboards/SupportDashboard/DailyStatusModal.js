// Updated imports
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Accordion,
  AccordionItem,
  Collapse,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import {
  GET_SupportDashboard,
  GET_SUPPORTUSER,
  GET_SUPPORTSTATUSLIST,
  POST_DailyStatus,
  PATCH_DailyStatus,
} from "../../../slices/thunks";
import moment from "moment";
import classnames from "classnames";
const DailyStatusModal = ({ modalOpen, modalData, selectedRow, onClose }) => {
  const dispatch = useDispatch();
  const SupportUserData = useSelector((state) => state.SupportUser.data);
  const SupportStatusData = useSelector((state) => state.SupportStatuses.data);
  const userType = localStorage.getItem("userType");
  // Synchronize modal state with the prop
  const [modal, setModal] = useState(modalOpen);

  useEffect(() => {
    setModal(modalOpen); // Sync modal state with parent
  }, [modalOpen]);

  useEffect(() => {
    dispatch(GET_SupportDashboard());
    dispatch(GET_SUPPORTUSER());
    dispatch(GET_SUPPORTSTATUSLIST());
  }, [dispatch]);

  const toggleModal = () => {
    setModal(!modal);
    if (onClose) onClose(); // Notify parent about closing
  };

  const validationSchema = Yup.object({
    TicketNumber: Yup.string().required("Ticket Number is required"),
    SupportUser: Yup.string().required("Support User is required"),
    CurrentStatus: Yup.string().required("Status is required"),
    statusDate: Yup.date().required("Status Date is required"),
    DueDate: Yup.date().required("Due Date is required"),
    solutionDetails: Yup.string().required("Solution Details are required"),
    dailyID: Yup.string(),
    ShareStatus: Yup.bool(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      values.SupportID = selectedRow?.SupportID;
      if (!values.dailyID) {
        await dispatch(POST_DailyStatus({ body: values }));
      } else {
        await dispatch(PATCH_DailyStatus({ body: values }));
      }
      toggleModal(); // Close modal after submission
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const extractOptions = (data, idKey, nameKey) =>
    data ? data.map((item) => ({ id: item[idKey], name: item[nameKey] })) : [];

  const SupportUser = extractOptions(SupportUserData, "SubUserID", "Name");
  const statusOptions = extractOptions(SupportStatusData, "StatusID", "Status");
  //col
  const vendorUser = JSON.parse(localStorage.getItem("vendorUser"));
  const formatLocalDateTime = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };
  const [clientName, setClientName] = useState("");
  const dummyData = {
    name: vendorUser.subUserName,
    mobile: localStorage.getItem("mobileNumber"),
    email: localStorage.getItem("userName"),
    ticketNo: parent === "Dashboard" ? ticketData : selectedRow?.TicketNumber,
    clientName: clientName,
    dateTime: formatLocalDateTime(new Date()),
  };

  useEffect(() => {
    const storedClientName = vendorUser.subscriberName;
    setClientName(
      storedClientName ||
        `${vendorUser.subscriberCode} - ${vendorUser.subscriberName}`
    );
  }, [vendorUser]);
  const [col1, setCol1] = useState(true);
  const [col2, setCol2] = useState(false);
  const [col3, setCol3] = useState(false);

  const toggleCol1 = () => {
    setCol1(!col1);
    setCol2(false);
    setCol3(false);
  };

  const toggleCol2 = () => {
    setCol2(!col2);
    setCol1(false);
    setCol3(false);
  };
  const formControlSm = {
    height: "30px",
    fontSize: "12px",
    padding: "5px",
  };
  const toggleCol3 = () => {
    setCol3(!col3);
    setCol1(false);
    setCol2(false);
  };
  return (
    <Modal isOpen={modal} toggle={toggleModal} size="lg">
      <ModalHeader toggle={toggleModal}>Update Query Details</ModalHeader>
      <ModalBody>
        {modalData || selectedRow ? (
          <Formik
            initialValues={{
              TicketNumber:
                modalData?.TicketNumber || selectedRow?.TicketNumber || "",
              SupportUser:
                modalData?.SupportUser || selectedRow?.SupportUser || "",
              CurrentStatus:
                modalData?.SupportStatus || selectedRow?.SupportStatus || "",
              statusDate: modalData?.StatusDate
                ? new Date(moment.utc(modalData.StatusDate).local()) // Convert modalData.StatusDate to local timezone
                : selectedRow?.StatusDate // Check selectedRow?.StatusDate
                ? (() => {
                    const [datePart, timePart] =
                      selectedRow?.StatusDate.split(" ");
                    const [day, month, year] = datePart.split("/").map(Number);
                    const [hours, minutes, seconds] = timePart
                      .split(":")
                      .map(Number);
                    return new Date(
                      year,
                      month - 1,
                      day,
                      hours,
                      minutes,
                      seconds
                    ); // Default to selectedRow?.StatusDate in local timezone
                  })()
                : new Date(), // Default to current date if none is available

              DueDate:
                modalData?.DueDate &&
                modalData.DueDate !== "0001-01-01T00:00:00"
                  ? new Date(moment.utc(modalData.DueDate).local()) // Convert modalData.DueDate to local timezone
                  : selectedRow?.DueDate &&
                    selectedRow?.DueDate !== "0001-01-01T00:00:00"
                  ? new Date(moment.utc(selectedRow?.DueDate).local()) // Convert selectedRow?.DueDate to local timezone
                  : new Date(new Date().setDate(new Date().getDate() + 7)), // Default to current date + 7 days in local timezone

              solutionDetails: modalData?.Remarks || "",
              dailyID: modalData?.DailyID || "",
              ShareStatus: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Row classname="gy-3">
                  <Accordion id="query-details-accordion" flush>
                    <AccordionItem
                      className="material-shadow"
                      style={{ border: "1px solid #dee2e6" }}
                    >
                      <h2 className="accordion-header" id="headingSubject">
                        <button
                          className={classnames("accordion-button", {
                            collapsed: !col1,
                          })}
                          type="button"
                          onClick={toggleCol1}
                          style={{ cursor: "pointer" }}
                        >
                          Query Details
                        </button>
                      </h2>
                      <Collapse isOpen={col1} className="accordion-collapse">
                        <div className="accordion-body">
                          <Row
                            style={{
                              margin: "0",
                              padding: "10px",
                              border: "1px solid #dee2e6",
                              borderRadius: "5px",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            <Col xs={12} style={{ fontSize: "12px" }}>
                              {/* Name and Ticket No */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span style={{ fontWeight: "bold" }}>
                                  {dummyData.name}
                                </span>
                                <div>
                                  <span style={{ fontWeight: "bold" }}>
                                    {dummyData.ticketNo}
                                  </span>
                                </div>
                              </div>

                              {/* Mobile No & Email */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center", // Align vertically for better appearance
                                }}
                              >
                                <span
                                  style={{
                                    color: "#6c757d",
                                    maxWidth: "50%", // Set a maximum width
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                  title={`${dummyData.mobile} | ${dummyData.email}`} // Tooltip for full data
                                >
                                  {dummyData.mobile} | {dummyData.email}
                                </span>
                                <span
                                  style={{
                                    maxWidth: "50%", // Set a maximum width
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                  title={new Date(
                                    dummyData.dateTime
                                  ).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })} // Tooltip for full date and time
                                >
                                  {new Date(dummyData.dateTime).toLocaleString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>

                              {/* Client Name */}
                              <div>
                                <span>{dummyData.clientName}</span>
                              </div>
                            </Col>
                          </Row>
                          {/* Query Menu */}
                          {/* Query Menu */}
                          {/* Query Menu */}
                          {/* Query Menu */}
                          <div style={{ marginTop: "10px" }}>
                            <label
                              htmlFor="QueryMenu"
                              style={{ fontWeight: "bold" }}
                            >
                              Query Menu:
                            </label>
                            <input
                              type="text"
                              id="QueryMenu"
                              style={{
                                ...formControlSm,
                                backgroundColor: "#f8f9fa", // Light gray background for disabled look
                                color: "#6c757d", // Muted text color
                                cursor: "not-allowed", // Change cursor to indicate non-editable
                              }}
                              className="form-control"
                              value={selectedRow?.MenuCode || "N/A"}
                              readOnly
                            />
                          </div>

                          {/* Query Subject */}
                          <div style={{ marginTop: "10px" }}>
                            <label
                              htmlFor="QuerySubject"
                              style={{ fontWeight: "bold" }}
                            >
                              Query Subject:
                            </label>
                            <input
                              type="text"
                              id="QuerySubject"
                              style={{
                                ...formControlSm,
                                backgroundColor: "#f8f9fa", // Light gray background for disabled look
                                color: "#6c757d", // Muted text color
                                cursor: "not-allowed", // Change cursor to indicate non-editable
                              }}
                              className="form-control"
                              value={selectedRow?.QuerySubject || "N/A"}
                              readOnly
                            />
                          </div>

                          {/* Query Description */}
                          <div style={{ marginTop: "10px" }}>
                            <label
                              htmlFor="QueryDescription"
                              style={{ fontWeight: "bold" }}
                            >
                              Query Description:
                            </label>
                            <textarea
                              id="QueryDescription"
                              style={{
                                ...formControlSm,
                                backgroundColor: "#f8f9fa", // Light gray background for disabled look
                                color: "#6c757d", // Muted text color
                                height: "100px", // Adjust height as needed
                                resize: "none", // Disable resizing if required
                                cursor: "not-allowed", // Change cursor to indicate non-editable
                              }}
                              className="form-control"
                              value={selectedRow?.QueryDescription || "N/A"}
                              readOnly
                            />
                          </div>
                        </div>
                      </Collapse>
                    </AccordionItem>
                  </Accordion>
                </Row>
                <Row className="gy-3">
                  <Col md={6} xs={12}>
                    <Label for="SupportUser">Support User:</Label>
                    <Field
                      name="SupportUser"
                      as="select"
                      className="form-control"
                      disabled={userType === "Infinity-ERP"}
                    >
                      <option value="">Select</option>
                      {SupportUser.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="SupportUser"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={6} xs={12}>
                    <Label for="CurrentStatus">Status:</Label>
                    <Field
                      name="CurrentStatus"
                      as="select"
                      className="form-control"
                      disabled={userType === "Infinity-ERP"}
                    >
                      <option value="">Select</option>
                      {statusOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="CurrentStatus"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={6} xs={12}>
                    <Label for="statusDate">Status Date:</Label>
                    <Flatpickr
                      id="statusDate"
                      className="form-control"
                      value={values.statusDate}
                      onChange={(dates) =>
                        setFieldValue("statusDate", dates[0])
                      }
                      options={{ dateFormat: "d-m-Y" }}
                      disabled={userType === "Infinity-ERP"}
                    />
                    <ErrorMessage
                      name="statusDate"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={6} xs={12}>
                    <Label for="DueDate">Due Date:</Label>
                    <Flatpickr
                      id="DueDate"
                      className="form-control"
                      value={values.DueDate}
                      onChange={(dates) => setFieldValue("DueDate", dates[0])}
                      options={{ dateFormat: "d-m-Y" }}
                      disabled={userType === "Infinity-ERP"}
                    />
                    <ErrorMessage
                      name="DueDate"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col xs={12}>
                    <Label for="solutionDetails">Solution Details:</Label>
                    <Field
                      name="solutionDetails"
                      as="textarea"
                      rows="4"
                      className="form-control"
                      disabled={userType === "Infinity-ERP"}
                    />
                    <ErrorMessage
                      name="solutionDetails"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  {/* ShareStatus Checkbox */}
                  <Col xs={12}>
                    <div className="form-check">
                      <Field
                        type="checkbox"
                        name="ShareStatus"
                        className="form-check-input"
                        id="ShareStatus"
                      />
                      <Label for="ShareStatus" className="form-check-label">
                        Share Status
                      </Label>
                    </div>
                    <ErrorMessage
                      name="ShareStatus"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                </Row>

                <ModalFooter>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={userType === "Infinity-ERP"}
                  >
                    Submit
                  </Button>
                  <Button color="secondary" onClick={toggleModal}>
                    Close
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        ) : (
          <p>No data available.</p>
        )}
      </ModalBody>
    </Modal>
  );
};

export default DailyStatusModal;
