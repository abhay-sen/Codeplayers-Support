import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import { useLocation } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TicketDetailsCard from "../../../../Components/Common/TicketDetailsCard.js";
import moment from "moment";
// import CPVoucherNumAttachmentsCard from "../../../../Components/Common/CPVoucherNumAttachmentsCard.js";
import TicketRatingsCard from "../../../../Components/Common/TicketRatingsCard.js";
import CPStepsTracking from "../../../../Components/Common/CPStepsTracking.js";
import DailyStatusModal from "../DailyStatusModal.js";
import { GET_TicketDetails } from "../../../../slices/Dashboards/TicketDetails/thunk.js";
import { POST_Rating } from "../../../../slices/Dashboards/TicketDetails/Rating/thunk.js";
import { useSelector, useDispatch } from "react-redux";
import RaiseTicketModal from "../raiseticket/RaiseTicketModal.js";
import { GET_DailyStatusDetails } from "../../../../slices/thunks.js";
import CPVoucherNumCameraCaptures from "../../../../Components/CPComponents/CPVouchers/CPVoucherNumCameraCaptures.js";

const TicketDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  // const { SupportID } = location.state || {};


  // Extract query parameters from the URL
  const query = JSON.parse(localStorage.getItem('query'));
  

  //ticket ID
  const url = window.location.href;
  const queryParams = new URL(url).searchParams;
  const queryID = queryParams.get("QueryID");



  const SupportID = queryID;
  const data = useSelector((state) => state.TicketDetail.data) || [];
  const loading = useSelector((state) => state.TicketDetail.loading);
  const error = useSelector((state) => state.TicketDetail.error);
  const success = useSelector((state) => state.TicketDetail.success);
  const [modal, setModal] = useState(false);
  const [modelOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(data[0]);
  const [modalData, setModalData] = useState(null);
  const DailyStatusData = useSelector((state) => state.DailyStatus.data);
  const SupportStatusData = useSelector((state) => state.SupportStatuses.data);
  const DailyStatusByIdData = useSelector((state) => state.DailyStatusById.data);
  const DailyStatusByIdError = useSelector((state) => state.DailyStatusById.error);
  const DailyStatusError = useSelector((state) => state.DailyStatus.error);
  const ratingData = useSelector((state) => state.Rating.data);
  const [showRaiseTicketModal, setShowRaiseTicketModal] = useState(false);
 
  const [IDdailyStatus,setIDdailyStatus]=useState([]);
  const [ticketData,setTicketData]=useState([]);

  useEffect(()=>{
    dispatch(GET_TicketDetails(queryID));
  },[dispatch])
  useEffect(() => {
    dispatch(GET_TicketDetails(queryID));
    setTicketData(data)
  }, [dispatch,SupportID]);
  useEffect(() => {
    if (queryID) {
      dispatch(GET_DailyStatusDetails(queryID));
    }
    else if(SupportID){
      dispatch(GET_DailyStatusDetails(SupportID));
    }
  }, [SupportID, dispatch]);

  useEffect(() => {
    if (DailyStatusByIdData) {
      setIDdailyStatus(DailyStatusByIdData); // Update the state only when data changes
    }
  }, [DailyStatusByIdData]);



  const handleCloseModal = () => {
    // Any specific logic to handle when the modal closes
    setModal(false);
    // dispatch(GET_TicketDetails(SupportID)); // Ensure the parent modalOpen state is updated
  };

  const openModal = (dailyID) => {
    if (dailyID) {
     
      // Open a modal or perform other actions using the dailyID
      setModalData(dailyID); // Example: Set state for the modal
      setModal(true); // Example: Open the modal
    } else {
      setModal(true);
      setModalData(null);

      // Handle the generic "Today's Status" action if required
    }
  };
  const ticketDetails = {
    Subject: data.QuerySubject,
    Description: data.QueryDescription,
    Module: `${data.Module} → ${data.SubModule}`,
    Menu: data.Menu,
  };

  const userDetails = {
    "Contact Person": data[0]?.TicketUser,
    Mobile: data[0]?.TicketUserMobile,
    Email: data[0]?.TicketUserEmail,
  };
  const clientDetails = {
    "Licensed To": data[0]?.LicensedTo,
    "Client Code": data[0]?.ClientCode,
  };
  const supportDetails = {
    Name: data[0]?.SupportUser,
  };

  const statusDetails = {
    "Reported On": data[0]?.ReportDateTime
      ? moment.utc(data[0]?.ReportDateTime).local().calendar()
      : "Not reported",
    "Current Status": data[0]?.CurrentStatus || "Not updated",
    "Today's Status": data[0]?.TodaysStatus || "Not updated",
    "Due Date": data[0]?.DueDate
      ? moment.utc(data[0]?.DueDate).local().format("MMMM Do, YYYY")
      : "Not specified",
    "Completed On":
      data[0]?.CompletedOn === "0001-01-01T00:00:00"
        ? "Not completed"
        : moment.utc(data[0]?.CompletedOn).local().calendar(),
  };

  document.title = `Ticket Details | ${data[0]?.TicketNumber}`;
  const calculateTimeDifference = (reportDateTime, completedOn) => {
    // Check if completedOn is the default invalid time
    if (completedOn === "0001-01-01T00:00:00") {
      return `Time Passed: ${moment
        .duration(moment().diff(moment.utc(data.ReportDateTime).local()))
        .humanize()}`;
    }

    const reportDate = moment.utc(reportDateTime).local();
    const completedDate = moment.utc(completedOn).local();

    // Calculate the duration between the two dates
    const duration = moment.duration(completedDate.diff(reportDate));

    // Format the duration to hours and minutes
    const hours = Math.floor(duration.asHours()); // Total hours
    const minutes = duration.minutes(); // Remaining minutes

    // Construct a readable string
    return `${hours} hrs ${minutes} mins`;
  };

  const toggleModal = () => {
    setShowRaiseTicketModal(!showRaiseTicketModal);
  };
  const handleModalSubmit = () => {
    setShowRaiseTicketModal(false); // Close the modal
    dispatch(GET_TicketDetails(SupportID));// Refresh the page
    
  };
  const timeTaken = calculateTimeDifference(
    data[0]?.ReportDateTime,
    data[0]?.CompletedOn
  );
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [remarks, setRemarks] = useState("");

  // Function that handles the submission of the rating and remarks
  const handleRatingSubmit = (userRating, userRemarks) => {
    if (!userRating || userRemarks === undefined) {
      console.error("Rating or remarks are missing.");
      return;
    }

    setRating(userRating);
    setRemarks(userRemarks);
    setRated(true);

    const body = {
      SupportID: SupportID, // Ensure SupportID is available in the component's scope
      Rating: userRating,
      RatingRemarks: userRemarks,
    };
    

    dispatch(POST_Rating(body));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Ticket Details" pageTitle={data[0]?.TicketNumber} />

          <Row>
            <Col xl={9}>
              <Card className="ribbon-box border shadow-none right">
                {data[0]?.IsCritical && (
                  <span className="ribbon-three ribbon-three-danger">
                    <span>Critical</span>
                  </span>
                )}
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <i className="ri-ticket-2-line align-bottom me-1 text-muted"></i>
                    <h5
                      className="card-title flex-grow-1 mb-0"
                      style={{
                        fontWeight: 700,
                        fontSize: "15px",
                      }}
                    >
                      Ticket Details
                    </h5>
                  </div>
                  <div
                    style={{
                      marginRight: data[0]?.IsCritical ? "100px" : "0", // Shifts the ticket number to the left when critical
                    }}
                  >
                    <h6 className="mb-0 text-muted">{data[0]?.TicketNumber}</h6>
                  </div>
                </CardHeader>
                <CardBody>
                  <table className="table table-borderless table-sm mb-0 w-100">
                    <tbody>
                      <tr>
                        <span
                          className="fw-semibold"
                          style={{
                            whiteSpace: "nowrap",  // Keeps the text on a single line
                            width: "auto",         // Adjust to content width
                            paddingRight: "10px",         // Remove any default padding
                            textAlign: "left",     // Ensure left alignment for both cells
                          }}
                        >
                          Subject:
                        </span>
                        <span
                          style={{
                            padding: "0",          // Remove padding for this cell as well
                            textAlign: "left",     // Left-align the text for consistency
                          }}
                        >
                          {data[0]?.QuerySubject}
                        </span>
                      </tr>


                      <tr>
                        <td
                          className="fw-semibold"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          Query Description:
                        </td>

                      </tr>
                      <tr>
                        <td colSpan="2">
                          <div
                            style={{
                              border: "1px solid #ced4da",
                              borderRadius: "5px",
                              padding: "10px",
                              backgroundColor: "#f8f9fa",
                              minHeight: "100px",
                              maxWidth: "100%", // Makes the div take up the full width of the container
                              width: "100%", // Ensures the div fills available space
                              boxSizing: "border-box", // Prevents overflow by including padding in width calculation
                            }}
                          >
                            {data[0]?.QueryDescription ? (
                              data[0]?.QueryDescription.split("\n").map((line, index) => (
                                <React.Fragment key={index}>
                                  {line}
                                  <br />
                                </React.Fragment>
                              ))
                            ) : (
                              <p>No description available</p>
                            )}
                          </div>

                        </td>
                      </tr>
                      <tr>
                        <td
                          className="fw-semibold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Solution:
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <div
                            style={{
                              border: "1px solid #ced4da",
                              borderRadius: "5px",
                              padding: "10px",
                              backgroundColor: "#f8f9fa",
                              minHeight: "100px",
                              maxWidth: "100%", // Makes the div take up the full width of the container
                              width: "100%", // Ensures the div fills available space
                              boxSizing: "border-box", // Prevents overflow by including padding in width calculation
                            }}
                          >
                            {data[0]?.Solution}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <Button
                    className="btn btn-primary btn-sm w-100 "
                    onClick={toggleModal} // Trigger modal open
                  >
                    Edit
                  </Button>
                </CardBody>
              </Card>

              <CPStepsTracking
                Page="DailyStatus"
                statuses={IDdailyStatus || []}
                labelTitle={IDdailyStatus?.TicketNumber || ""}
                onClick={openModal}
                SupportID={SupportID}
              />
              <DailyStatusModal modalOpen={modal} modalData={modalData} selectedRow={selectedRow} onClose={handleCloseModal} />
              <RaiseTicketModal isOpen={showRaiseTicketModal}
                toggle={toggleModal}
                onClose={handleModalSubmit}
                parent="TicketDetails" />
            </Col>

            <Col xl={3}>
              <div className="mb-3 text-center">
                <Button color="primary" className="btn-sm me-2">
                  <i className="ri-notification-3-line align-middle me-1"></i>
                  Send Reminder
                </Button>
                <Button color="secondary" className="btn-sm">
                  <i className="ri-phone-line align-middle me-1"></i>
                  Request Call Back
                </Button>
              </div>

              <TicketDetailsCard
                labelTitle="Status"
                details={statusDetails}
                icon="ri-checkbox-circle-line"
              />
              <TicketDetailsCard
                labelTitle="Support User Details"
                details={supportDetails}
                icon="ri-user-settings-line"
              />
              <TicketDetailsCard
                labelTitle="User Details"
                details={userDetails}
                icon="ri-user-line"
              />
              <TicketDetailsCard
                labelTitle="Client Details"
                details={clientDetails}
                icon="ri-user-3-line"
              />
              <CPVoucherNumCameraCaptures voucherdata={data[0]?.SupportID}/>
              {query?.CompletedOn !== "0001-01-01T00:00:00" && (
                <TicketRatingsCard
                  onSubmitRating={handleRatingSubmit}
                  rated={rated}
                />
              )}

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className=" ri-flag-2-fill align-bottom me-1 text-muted"></i>{" "}
                    Time Taken
                  </h5>
                </CardHeader>
                <CardBody>
                  <div className="mb-2 text-center">
                    <lord-icon
                      src="https://cdn.lordicon.com/kbtmbyzy.json"
                      trigger="loop"
                      colors="primary:#405189,secondary:#02a8b5"
                      style={{ width: "90px", height: "90px" }}
                    ></lord-icon>
                  </div>
                  <h3 className="mb-1 text-center">{timeTaken}</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default TicketDetails;
