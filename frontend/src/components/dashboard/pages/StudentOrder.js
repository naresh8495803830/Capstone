import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import FilterDrawer from "../../common/filterDrawer/filterDrawer";
import { Box } from "@mui/material";

// Generate Order Data
function createData(
  id,
  name,
  email,
  phoneno,
  batch,
  program,
  npstype,
  npsstatus,
  city,
  state,
  country,
  currentCTC,
  currentDegree,
  highestDegree,
  currentCompany,
  currentIndustry,
  totalWorkExperience,
  whatsappNo
) {
  return {
    id,
    name,
    email,
    phoneno,
    batch,
    program,
    npstype,
    npsstatus,
    city,
    state,
    country,
    currentCTC,
    currentDegree,
    highestDegree,
    currentCompany,
    currentIndustry,
    totalWorkExperience,
    whatsappNo,
  };
}

function preventDefault(event) {
  event.preventDefault();
}

export default function StudentOrders(props) {
  const [filters, setFilters] = React.useState([]);
  const [ogRows, setOgRows] = React.useState([]);
  const [tempRows, setTempRows] = React.useState([]);
  const [appliedFilters, setAppliedFilters] = React.useState({});
  // {
  //   value: filterValues["npsFormName"] || null,
  //   items: npsMonthItems,
  //   name: "Nps Month",
  //   key: "npsFormName",
  //   multiSelect: false,
  // }
  React.useEffect(() => {
    const rows = props.response.map((data) => {
      return createData(
        data._id,
        data.studentId.name,
        data.studentId.email,
        data.studentId.phoneNo,
        data.studentId.batchid, // Update with appropriate batch data
        data.studentId.batchid.programId, // Update with appropriate program data
        data.npsType,
        data.completionStatus,
        data.studentId.city,
        data.studentId.state,
        data.studentId.country,
        data.studentId.currentCTC,
        data.studentId.currentDegree,
        data.studentId.highestDegree,
        data.studentId.currentCompany,
        data.studentId.currentIndustry,
        data.studentId.totalWorkExperience,
        data.studentId.whatsappNo
      );
    });
    setTempRows(rows);
    setOgRows(rows);
  }, []);
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
    setFilters(Object.values(filters));
  };
  // processFilterOptions();
  const updateFilters = (data, ogData = null) => {
    let obj = {
      ...appliedFilters,
      ...data,
    };
    setAppliedFilters(obj);
    let newData = applyFilters(ogRows, obj);
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
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone no.</TableCell>
            <TableCell>Batch</TableCell>
            <TableCell>Program</TableCell>
            <TableCell>NPS Type</TableCell>
            <TableCell>NPS Status</TableCell>
            <TableCell>City</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>CurrentCTC</TableCell>
            <TableCell>Current Degree</TableCell>
            <TableCell>Highest Degree</TableCell>
            <TableCell>Current Company</TableCell>
            <TableCell>Current Industry</TableCell>
            <TableCell>Total Work Experience</TableCell>
            <TableCell>Whatsapp No.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tempRows.map((row) => {
            return (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phoneno}</TableCell>
                <TableCell>{row.batch.batchName}</TableCell>
                <TableCell>{row.program.programName}</TableCell>
                <TableCell>{row.npstype}</TableCell>
                <TableCell>{row.npsstatus}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.state}</TableCell>
                <TableCell>{row.country}</TableCell>
                <TableCell>{row.currentCTC}</TableCell>
                <TableCell>{row.currentDegree}</TableCell>
                <TableCell>{row.highestDegree}</TableCell>
                <TableCell>{row.currentCompany}</TableCell>
                <TableCell>{row.currentIndustry}</TableCell>
                <TableCell>{row.totalWorkExperience}</TableCell>
                <TableCell>{row.whatsappNo}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
