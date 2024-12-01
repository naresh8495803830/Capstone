import React, { useState } from "react";
import { Button, Drawer, Box, Typography } from "@mui/material";
import FilterDropdown from "./filterDropdown";
const FilterDrawer = (props) => {
  const [open, setOpen] = useState(false);
  let filterDetails = props.filterDetails;
  const updateGlobalFilters = props.updateFilters;
  let localFilters = {};
  const updateLocalFilters = (data, filterkey) => {
    localFilters[filterkey] = data;
    console.log(localFilters);
  };
  const handleOpen = () => {
    props.openFilters();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleApply = () => {
    // Perform actions when Apply is clicked
    updateGlobalFilters(localFilters);
    console.log("Applying filters...");
    handleClose(); // Close the drawer after applying filters
  };

  const handleCancel = () => {
    // Perform actions when Cancel is clicked
    console.log("Canceling...");
    handleClose(); // Close the drawer without applying filters
  };
  return (
    <>
      <Button onClick={handleOpen}>Filters</Button>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box
          sx={{
            width: "500px",
            padding: "20px 20px 100px 20px",
            marginTop: "50px",
          }}
          role="presentation"
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="h2">
              Filters
            </Typography>
            <p style={{ cursor: "pointer" }} onClick={handleClose}>
              X
            </p>
          </div>
          <Box
            sx={{
              gap: "1rem",
              flexDirection: "column",
              display: "flex",
            }}
          >
            {filterDetails.map((filter) => (
              <>
                <FilterDropdown
                  items={filter.items}
                  multiSelect={filter.multiSelect}
                  name={filter.name}
                  filterValue={filter.value}
                  filterkey={filter.key}
                  updateLocalFilters={updateLocalFilters}
                ></FilterDropdown>
              </>
            ))}
          </Box>
          <Box
            sx={{
              bottom: "0px",
              position: "fixed",
              width: "25vw",
              zIndex: "3",

              marginLeft: "-20px",
              padding: "1rem",
              gap: "1rem",
              display: "flex",
              justifyContent: "end",
              background: "aliceblue",
            }}
          >
            <Button onClick={handleCancel} color="error">
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              variant="contained"
              sx={{ marginLeft: "10px" }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
