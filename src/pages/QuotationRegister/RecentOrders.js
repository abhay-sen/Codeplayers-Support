import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Col } from "reactstrap";




const RecentOrders = () => {
  const navigate = useNavigate(); // Using useNavigate for redirection

  // Function to assign the correct class based on the status
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "won":
        return "badge bg-success-subtle text-success";
      case "expired":
        return "badge bg-danger-subtle text-danger";
      case "lost":
        return "badge bg-light-subtle text-muted";
      default:
        return "badge bg-warning-subtle text-warning";
    }
  };

  // Handle row click to navigate to order details page
  const handleRowClick = (order) => {
    navigate(`/Order-details?${order.rfqNo}`, { state: { order } });
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Recent Orders</h4>
        </CardHeader>

        <CardBody>
          <div className="table-responsive table-card">
            <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
              <thead className="text-muted table-light">
                <tr>
                  <th scope="col">RFQ DATE</th>
                  <th scope="col">Products</th>
                  <th scope="col">Vendor</th>
                  <th scope="col">RFQ NO</th>
                  <th scope="col">Status</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(recentOrders || []).map((order, key) => (
                  <tr
                    key={key}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(order)}
                  >
                    <td>{order.rfqDate}</td>

                    <td>
                      {/* Show first product and indicate more items if available */}
                      {order.items.length > 1 ? (
                        <span>
                          {order.items[0].name} + {order.items.length - 1}{" "}
                          more items
                        </span>
                      ) : (
                        <span>{order.items[0].name}</span>
                      )}
                    </td>

                    <td>{order.vendor}</td>

                    <td>
                      <span>{order.rfqNo}</span>
                    </td>
                    <td>
                      <span className={getStatusClass(order.status)}>
                        {order.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      {/* Calculate total RequiredQuantity for the order */}
                      <span>
                        {order.items.reduce(
                          (total, product) => total + product.RequiredQuantity,
                          0
                        )}
                      </span>
                    </td>

                    <td>
                      {/* Calculate total amount for the order */}
                      <span className="text-success">
                        ₹{" "}
                        {order.items.reduce(
                          (total, product) => total + product.amount,
                          0
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default RecentOrders;