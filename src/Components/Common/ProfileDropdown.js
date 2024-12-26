import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import { logoutERPUser, logoutLicenseUser } from "../../slices/thunks";
//import images
import { FaUserCircle } from "react-icons/fa";
import { createSelector } from "reselect";

const ProfileDropdown = () => {
  const userName=JSON.parse(localStorage.getItem("vendorUser"))?.subUserName;

  const userRole=JSON.parse(localStorage.getItem("vendorUser"))?.userRole
  

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn shadow-none">
          <span className="d-flex align-items-center">
            <FaUserCircle size={40} color="#ccc" />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userName}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {userRole}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* Change Password Section */}
          <DropdownItem href="/ChangePassword">
            <i className="mdi mdi-key-outline text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle">Change Password</span>
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              logoutLicenseUser();
            }}
          >
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span
              style={{ fontSize: "13px" }}
              className="align-middle"
              data-key="t-logout"
            >
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
