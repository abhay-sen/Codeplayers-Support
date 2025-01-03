import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  
  const [isMultiLevel, setIsMultiLevel] = useState(false);
  
  const userType = localStorage.getItem("userType");
  
  const [iscurrentState, setIscurrentState] = useState("Support");
  
  
  const [isSupport,setIsSupport]=useState(false);
  const [isTraining,setIsTraining]=useState(false);
  const [isUser,setIsUser]=useState(false);
  const [isProducts,setIsProducts]=useState(false);
  const [isLicense,setIsLicense]=useState(false);


  const userRole=localStorage.getItem("userRole");
  
  
  
  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }
  useEffect(()=>{
    document.body.classList.remove("twoColumnPanel");
    if(iscurrentState!=="Support"){
      setIsSupport(false);
    }
    if (iscurrentState !== "Training") {
      setIsTraining(false);
    }
    if (iscurrentState !== "User") {
      setIsUser(false);
    }
    if (iscurrentState !== "License") {
      setIsLicense(false);
    }
    if (iscurrentState !== "Product") {
      setIsProducts(false);
    }
  },[isUser,isLicense,isProducts,isSupport,isTraining,iscurrentState,isMultiLevel])

  const commonMenuItems = {
    support: {
      id: "Support",
      label: "Support",
      icon: "las la-headset",
      link: "/#",
      click: (e) => {
        e.preventDefault();
        setIsSupport(!isSupport);
        setIscurrentState("Support");
        updateIconSidebar(e);
      },
      stateVariables: isSupport,
      subItems: [
        { id: "Support.Dashboard", label: "Dashboard", link: "/support-dashboard" },
        { id: "Support.Register", label: "Register", link: "/support-register" },
       
      ],
    },
    training: {
      id: "Training",
      label: "Training",
      icon: "las la-graduation-cap",
      link: "/#",
      click: (e) => {
        e.preventDefault();
        setIsTraining(!isTraining);
        setIscurrentState("Training");
        updateIconSidebar(e);
      },
      stateVariables: isTraining,
      subItems: [
        { id: "Training.Dashboard", label: "Dashboard", link: "/training-dashboard" },
        { id: "Training.Register", label: "Register", link: "/training-register" },
      ],
    },
    user: {
      id: "User",
      label: "User",
      icon: "las la-user-circle",
      link: "/#",
      click: (e) => {
        e.preventDefault();
        setIsUser(!isUser);
        setIscurrentState("User");
        updateIconSidebar(e);
      },
      stateVariables: isUser,
      subItems: [
        { id: "Users", label: "User List", link: "/users" },
        { id: "User.AllotTraining", label: "Allot Training", link: "/training-allotment" },
      ],
    },
    products: {
      id: "Products",
      label: "Products",
      icon: "las la-shopping-cart",
      link: "/#",
      click: (e) => {
        e.preventDefault();
        setIsProducts(!isProducts);
        setIscurrentState("Product");
        updateIconSidebar(e);
      },
      stateVariables: isProducts,
      subItems: [
        { id: "Products.Buy", label: "Buy", link: "/Products-buy" },
        { id: "Products.History", label: "History", link: "/Products-history" },
      ],
    },
    license:{
      id: "License", label: "License", icon: "las la-award", link: "/license-history"
    },
    
  };

  let menuItems;
  
  

  
    if (userRole === "Client Admin") {
      menuItems = [
        commonMenuItems.license,
        commonMenuItems.support,
        commonMenuItems.training,
        commonMenuItems.user,
        commonMenuItems.products,


      ];
    }
    else if (userRole === "Client Manager") {
      menuItems = [
        
        commonMenuItems.support,
        commonMenuItems.training,
        commonMenuItems.user,
        


      ];
    }
    else if (userRole === "Client User") {
      menuItems = [
        
        commonMenuItems.support,
        commonMenuItems.training,
        


      ];
    }
  
    if (userRole === "Support Admin") {
      menuItems = [
        
        commonMenuItems.support,
        commonMenuItems.training,
        commonMenuItems.user,
        


      ];
    } else if (userRole === "Support Manager") {
      menuItems = [
        
        commonMenuItems.support,
        commonMenuItems.training,
        commonMenuItems.user,
        


      ];
    }
    else if (userRole === "Support User") {
      menuItems = [
        
        commonMenuItems.support,
        commonMenuItems.training,
        


      ];
   
    } else if (userType === "Vend-X") {
      menuItems = [
        { id: "Quotation", label: "Quotation Register", icon: "ri-calculator-fill", link: "/Quotation-register" },
        { id: "Vendor.Dashboard", label: "Dashboard", icon: "ri-calculator-fill", link: "/vendor-dashboard" },
      ];
    }
  

  return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;
