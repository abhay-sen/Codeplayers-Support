import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import IconsForVoucherType from "../../../Components/CPComponents/CPIcons/IconsForVoucherType";
import SimpleBar from "simplebar-react";
import moment from "moment";
import { useNavigate } from "react-router-dom"; // For navigation
import ApprovalPendingModal from "./ApprovalPending";
import Not_Available from "../../../assets/Not_Available.png"; // Import the Not_Available image

const ApprovalPending = ({ queries }) => {
    const navigate = useNavigate();
    const userRole=localStorage.getItem("userRole");
    // State to manage modal visibility and selected row data
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Filter queries to exclude those with status "Done"
    const filteredQueries = (queries || []).filter(
        (query) => query.CurrentStatus === "Approval Pending"
    ).sort((a, b) => new Date(b.ReportDateTime) - new Date(a.ReportDateTime)) || [];;
      

    // Handle card click: Set data to localStorage and navigate to the ticket details page
    const handleCardClick = (queryData) => {
        if(userRole==="Client Manager"){
            setSelectedRow(queryData); // Set selected row data
            setModalOpen(true);
        }
         // Open the modal
    };

    return (
        <Col xxl={12}>
            <Card className="card-height-100">
                <CardHeader className="card-header align-items-center d-flex border-bottom border-1">
                    {IconsForVoucherType("Currently Active Queries")}
                    <h4 className="card-title mb-0 flex-grow-1">Review By Approval Pending</h4>
                    <div className="fs-16 fw-bold">{filteredQueries.length}</div>
                </CardHeader>
                <CardBody className="p-0">
                    {filteredQueries.length === 0 ? (
                        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "435px" }}>
                            <img
                                src={Not_Available}
                                alt="No Data Available"
                                style={{ height: "auto", width: "20%" }}
                            />
                            <p className="text-muted mt-3">No recent queries available.</p>
                        </div>
                    ) : (
                        <SimpleBar style={{ height: "435px" }}>
                            <div className="p-0">
                                {filteredQueries.map((individualData, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleCardClick(individualData)} // Open modal on card click
                                        style={{
                                            cursor: "pointer", // Add hover pointer
                                            borderBottom: "1px solid #e9ecef",
                                            backgroundColor:
                                                index % 2 === 0
                                                    ? "rgba(208, 233, 255, 0.2)" // Light blue shade
                                                    : "rgba(208, 255, 214, 0.2)", // Light green shade
                                        }}
                                        className="text-muted px-3 py-2" // Add padding and margin for consistency
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-xs flex-shrink-0">
                                                <span className="avatar-title bg-light rounded-circle">
                                                    {IconsForVoucherType(
                                                        individualData.Module !== "NULL"
                                                            ? individualData.Module
                                                            : "N/A"
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex-grow-1 ms-2">
                                                <h6 className="fs-14 mb-1">
                                                    {individualData.Module !== "NULL"
                                                        ? individualData.Module
                                                        : "N/A"}
                                                </h6>
                                                <Row>
                                                    <span className="text-muted fs-12 mb-0">
                                                        <i className="mdi mdi-circle-medium text-success fs-15 me-1"></i>
                                                        Date:{" "}
                                                        {moment
                                                            .utc(individualData.ReportDateTime)
                                                            .local()
                                                            .format("DD MMM - hh:mm A")}
                                                    </span>

                                                    <span className="text-muted fs-12 mb-0">
                                                        <i className="mdi mdi-circle-medium text-success fs-15 me-1"></i>
                                                        User: {individualData.TicketUser}
                                                    </span>
                                                    <span className="text-muted fs-12 mb-0">
                                                        <i className="mdi mdi-circle-medium text-success fs-15 me-1"></i>
                                                        Subject: {individualData.QuerySubject}
                                                    </span>
                                                    <span className="text-muted fs-12 mb-0">
                                                        <i className="mdi mdi-circle-medium text-success fs-15 me-1"></i>
                                                        Support User: {individualData.SupportUser}
                                                    </span>
                                                    <span className="text-muted fs-12 mb-0">
                                                        <i className="mdi mdi-circle-medium text-success fs-15 me-1"></i>
                                                        Status: {individualData.Status}
                                                    </span>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SimpleBar>
                    )}
                </CardBody>
            </Card>

            {/* Pass modal state and data to the ApprovalPendingModal */}
            <ApprovalPendingModal
                modalOpen={modalOpen}
                modalData={selectedRow} // Pass selected row data to modal
                selectedRow={selectedRow} // Also pass for form submission
                onClose={() => { setModalOpen(false) }}
            />
        </Col>
    );
};

export default ApprovalPending;
