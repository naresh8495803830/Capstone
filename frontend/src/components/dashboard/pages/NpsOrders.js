import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";

export default function NpsOrders(props) {
  console.log("inside npsorder:", props.data);
  if (props.data.msg === "No active NPS forms found") {
    return (
      <React.Fragment>
        <Title>{props.data.msg}</Title>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>End Date</TableCell>
              <TableCell>NPS Type</TableCell>
              <TableCell>Program | Domain | Batch</TableCell>
              <TableCell>Response %</TableCell>
              <TableCell>Responses Sent</TableCell>
              <TableCell>Pending Responses</TableCell>
              <TableCell>Target 60%</TableCell>
              <TableCell>NPS Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((d) => (
              <TableRow>
                <TableCell>{d.npsEndDate}</TableCell>
                <TableCell>{d.npsType}</TableCell>
                <TableCell>
                  {d.programName}- {d.domainName} -{d.batchName}
                </TableCell>
                <TableCell>{d.responsePercentage}</TableCell>
                <TableCell>{d.totalResponsesCreated}</TableCell>
                <TableCell>
                  {d.totalResponsesCreated - d.totalCompletedResponses}
                </TableCell>
                <TableCell>
                  {Math.round(
                    d.totalResponsesCreated * 0.6 - d.totalCompletedResponses
                  )}
                </TableCell>
                <TableCell>{d.npsScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <Link color="primary" href="/npsresult" sx={{ mt: 3 }}>
          See all NPS
        </Link> */}
      </React.Fragment>
    );
  }
}
