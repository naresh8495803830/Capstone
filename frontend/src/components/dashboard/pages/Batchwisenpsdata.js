import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
export default function BatchWiseNpsOrders(props) {
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title>{props.title}</Title>
        </div>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Program | Domain | Batch</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>Mid</TableCell>
              <TableCell>End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((d) => (
              <TableRow
                key={d.programName + "-" + d.domainName + "-" + d.batchName}
              >
                <TableCell>
                  {d.programName}-{d.domainName}-{d.batchName}
                </TableCell>
                <TableCell>{d.start}</TableCell>
                <TableCell>{d.mid}</TableCell>
                <TableCell>{d.end}</TableCell>
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
