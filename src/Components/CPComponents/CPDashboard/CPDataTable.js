import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody } from "reactstrap";

const DataTable = ({ data, columns, heading }) => {
    const renderHeaders = () => (
        <>
            {columns.map((col, index) => (
                <th key={index} scope="col">
                    {col.label}
                </th>
            ))}
        </>
    );

    const renderRows = () =>
        data.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                        {col.render ? col.render(row) : row[col.key]}
                    </td>
                ))}
            </tr>
        ));

    return (
        <React.Fragment>
            <Card>
                <CardHeader className="align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">{heading}</h4>
                </CardHeader>
                <CardBody>
                    <div className="table-responsive table-card">
                        <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                            <thead className="text-muted table-light">
                                <tr>{renderHeaders()}</tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    renderRows()
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="text-center">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

DataTable.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
            render: PropTypes.func,
        })
    ).isRequired,
    heading: PropTypes.string.isRequired,
};

export default DataTable;
