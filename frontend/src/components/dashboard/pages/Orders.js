import * as React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { npsServiceUrl } from "../../../api/url";
import axios from "axios";
import { postMethod } from "../../../api/common";
import { useAuth } from "../../../hooks/useAuth";
import FilterDrawer from "../../common/filterDrawer/filterDrawer";
import { Box } from "@mui/material";

export default function Orders(props) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [mailSendMsg, setMailSendMsg] = React.useState("");
  const [filters, setFilters] = React.useState([]);
  const [ogRows, setOgRows] = React.useState([]);
  const [tempRows, setTempRows] = React.useState([]);
  const [appliedFilters, setAppliedFilters] = React.useState({});
  const { userType } = useAuth();
  // Update handleRowClick to use navigate method
  React.useEffect(() => {
    const rows = props.data;
    setTempRows(rows);
    setOgRows(rows);
  }, []);
  const handleRowClick = (id) => {
    if (userType == "admin") navigate(`/userresponse/${id}`);
  };

  const sendEmail = async (resid, usrid) => {
    let respData = {
      responseId: resid,
      userId: usrid,
    };
    let resD = await postMethod(
      `${npsServiceUrl}/npsresponse/resend`,
      respData
    );
    setMailSendMsg(resD.data.msg);
  };
  const processOptions = (name, option) => {
    if (name == "batch") {
      return { label: option.batchName, value: option["_id"] };
    } else if (name == "program") {
      return { label: option.programName, value: option["_id"] };
    }
    return { label: option, value: option };
  };
  const processFilterOptions = () => {
    let filters = {};

    for (let row of ogRows) {
      for (let item in row) {
        if (!filters[item]) {
          filters[item] = {
            value: appliedFilters[item] || null,
            items: [processOptions(item, row[item])],
            name: item,
            key: item,
            multiSelect: true,
          };
        } else {
          if (
            !filters[item]?.items.find(
              (ele) => ele.value == processOptions(item, row[item])?.value
            )
          )
            filters[item]?.items.push(processOptions(item, row[item]));
        }
      }
    }
    // let processedFilters = Object(filters).values();
    setFilters(
      Object.values(filters).filter(
        (item) =>
          ![
            "batchId",
            "npsFormCode",
            "responseId",
            "npsFormId",
            "userId",
          ].includes(item.name)
      )
    );
  };
  // processFilterOptions();
  const updateFilters = (data, ogData = null) => {
    let obj = {
      ...appliedFilters,
      ...data,
    };
    setAppliedFilters(obj);
    let newData = applyFilters(ogRows, obj);
    console.log(newData);
    setTempRows(newData);
  };
  const applyFilters = (data, filters) => {
    return data.filter((item) => {
      return Object.keys(filters).every((filterKey) => {
        if (
          filters?.[filterKey]?.includes("all") ||
          filters?.[filterKey]?.includes(null) ||
          !filters?.[filterKey]
        ) {
          return true;
        } else {
          return filters[filterKey].includes(item[filterKey]);
        }
      });
    });
  };
  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex !important",
          justifyContent: "space-between !important",
        }}
      >
        <Title>{props.title}</Title>
        <FilterDrawer
          openFilters={processFilterOptions}
          filterDetails={filters}
          updateFilters={updateFilters}
        />
      </Box>
      <Box sx={{ overflow: "auto", maxWidth: "100%" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>End Date</TableCell>
              
              <TableCell>NPS Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone No.</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>NPS Status</TableCell>
              <TableCell>Resend</TableCell>
              <TableCell>Whatsapp No.</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>CurrentCTC</TableCell>
              <TableCell>Current Degree</TableCell>
              <TableCell>Highest Degree</TableCell>
              <TableCell>Current Company</TableCell>
              <TableCell>Current Industry</TableCell>
              <TableCell>Total Work Experience</TableCell>
              
              
              <TableCell>NPS Campaign</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tempRows.map((d, i) => (
              <TableRow key={d.userId + i}>
                <TableCell>{d.npsEndDate}</TableCell>
                
                <TableCell>{d.npsType}</TableCell>

                <TableCell
                  onClick={() => {
                    if (userType === "admin") {
                      window.open(`/userresponse/${d.responseId}`, "_blank");
                    } else {
                      handleRowClick(d.responseId);
                    }
                  }}
                  style={
                    userType === "admin"
                      ? { cursor: "pointer", color: "red" }
                      : {}
                  }
                >
                  {/* <TableCell
                  onClick={() => handleRowClick(d.responseId)}
                  style={
                    userType == "admin" 
                      ? { cursor: "pointer", color: "red" }
                      : {}
                  }
                > */}
                  {d.name}
                </TableCell>
                <TableCell>{d.phoneNo}</TableCell>
                <TableCell>{d.programName}</TableCell>
                <TableCell>{d.domainName}</TableCell>
                <TableCell>{d.batchName}</TableCell>
                <TableCell>{d.completionStatus}</TableCell>
                
                {d.completionStatus != "completed" ? (
                  <TableCell
                    onClick={() => sendEmail(d.responseId, d.userId)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    R
                  </TableCell>
                ) : (
                  <TableCell>NA</TableCell>
                )}
                <TableCell>{d.whatsappNo}</TableCell>
                <TableCell>{d.city}</TableCell>
                <TableCell>{d.state}</TableCell>
                <TableCell>{d.country}</TableCell>
                <TableCell>{d.currentCTC}</TableCell>
                <TableCell>{d.currentDegree}</TableCell>
                <TableCell>{d.highestDegree}</TableCell>
                <TableCell>{d.currentCompany}</TableCell>
                <TableCell>{d.currentIndustry}</TableCell>
                <TableCell>{d.totalWorkExperience}</TableCell>
                
                
                <TableCell>{d.npsFormCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Link color="primary" sx={{ mt: 3 }}>
        {mailSendMsg}
      </Link>
    </React.Fragment>
  );
}
