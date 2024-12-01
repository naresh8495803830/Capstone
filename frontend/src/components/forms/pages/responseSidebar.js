// src/Sidebar.js
import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import "./responseSidebar.scss"; // Import custom CSS for additional styling

const ResponseSidebar = (props) => {
  let questions = props?.questions || [];
  const handleClick = (index) => {
    props.setActiveQuestion(index);
  };
  return (
    <div className="response-sidebar">
      <div className="sidebar">
        <Nav defaultActiveKey="/home" className="sidebar-view">
          {questions.map((question, index) => (
            <p
              onClick={() => {
                handleClick(index);
              }}
              className={props.activeQuestion == index ? "active" : ""}
            >
              Q{index + 1}
            </p>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default ResponseSidebar;
