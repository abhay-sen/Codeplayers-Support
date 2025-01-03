import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, CardBody,CardHeader } from "reactstrap";
import CPBreadCrumbReporting from "../../../Components/CPComponents/CPLayouts/CPBreadCrumbReporting";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper styles
import { Autoplay, Mousewheel } from "swiper/modules";
import FeatherIcon from "feather-icons-react";
import CountUp from "react-countup";
import { GET_VendorDashboard } from "../../../slices/Dashboards/VendorDashboard/thunk.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import RecentOrders from "../../QuotationRegister/RecentOrders.js";
import ModuleCharts from "./ModuleCharts.js";
import ModuleData from "./ModuleData.js";
const VendorDashboard = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.VendorDashboard.data);
  const loading = useSelector((state) => state.VendorDashboard.loading);
  const error = useSelector((state)=>state.VendorDashboard.error);
  const success = useSelector((state)=>state.VendorDashboard.success)
  const navigate = useNavigate();
// console.log(data);
  const recentOrders=data?.record;  // Set initial range

  // State to hold the selected date range
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const totalCount = recentOrders.length || 0;

  const countByStatus = recentOrders.reduce((acc, order) => {
    const status = order.status || "No Status";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const dateChange = (newRange) => {
    if (newRange.length === 2) {
      setSelectedRange(newRange);
      sessionStorage.setItem("selectedRange", JSON.stringify(newRange));
      dispatch(
        GET_VendorDashboard({
          FromDate: moment(newRange[0]).format("yyyy-MM-DD"),
          ToDate: moment(newRange[1]).format("yyyy-MM-DD"),
        })
      );
    }
  };

  useEffect(() => {
    const storedRange = JSON.parse(sessionStorage.getItem("selectedRange"));
    const initialRange = storedRange
      ? [new Date(storedRange[0]), new Date(storedRange[1])]
      : [new Date(), new Date()];

    if (!selectedRange[0] && !selectedRange[1]) {
      dateChange(initialRange);
    }
  }, [selectedRange]);

  


  //chart
  const chartLabels = Object.keys(countByStatus); 
  const chartData = Object.values(countByStatus); 



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <CPBreadCrumbReporting
            title="Vendor Dashboard"
            pageTitle="Data"
            selectedRange={selectedRange}
            onDateRangeChange={dateChange}
          />
          <Row>
            <Col xs="12">
              <div style={{ overflowX: "auto", padding: "10px" }}>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={24}
                  mousewheel={true}
                  autoplay={false}
                  breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    576: { slidesPerView: 1, spaceBetween: 15 },
                    768: { slidesPerView: 2, spaceBetween: 20 },
                    992: { slidesPerView: 3, spaceBetween: 24 },
                  }}
                  modules={[Autoplay, Mousewheel]}
                  direction="horizontal"
                  className="querySwiper"
                >
                  <SwiperSlide>
                    <Card className="card-animate">
                      <CardBody>
                        <div className="d-flex justify-content-between">
                          <div>
                            <p className="fw-medium text-muted mb-0">Total </p>
                            <h2 className="mt-4 ff-secondary fw-semibold">
                              <span className="counter-value">
                                <CountUp start={0} end={totalCount} duration={4} />
                              </span>
                            </h2>
                          </div>
                          <div>
                            <div className="avatar-sm flex-shrink-0">
                              <span className="avatar-title bg-primary rounded-circle fs-2">
                                <FeatherIcon icon="list" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                  {Object.keys(countByStatus).map((status, index) => (
                    <SwiperSlide key={index}>
                      <Card className="card-animate">
                        <CardBody>
                          <div className="d-flex justify-content-between">
                            <div>
                              <p className="fw-medium text-muted mb-0">{status} </p>
                              <h2 className="mt-4 ff-secondary fw-semibold">
                                <span className="counter-value">
                                  <CountUp start={0} end={countByStatus[status]} duration={4} />
                                </span>
                              </h2>
                            </div>
                            <div>
                              <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-info rounded-circle fs-2">
                                  <FeatherIcon icon="clock" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <RecentOrders />
            </Col>
            <Col lg={4}>
              <ModuleData data={recentOrders}/>
            </Col>
          </Row>
          
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VendorDashboard;