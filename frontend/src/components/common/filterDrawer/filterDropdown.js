import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const FilterDropdown = ({
  items,
  multiSelect,
  name,
  filterValue,
  filterkey,
  updateLocalFilters,
}) => {
  const [selectedItems, setSelectedItems] = React.useState(
    filterValue ? filterValue : []
  );

  const handleChange = (event) => {
    const { value } = event.target;

    if (value.includes("all")) {
      handleClear();
      updateLocalFilters(multiSelect ? null : [], filterkey);
    } else {
      setSelectedItems(multiSelect ? value : [value]);
      updateLocalFilters(multiSelect ? value : [value], filterkey);
    }
  };

  const handleClear = () => {
    setSelectedItems([]);
    updateLocalFilters([], filterkey);
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel sx={{ fontWeight: 600, fontSize: "1rem" }}>{name}</InputLabel>
      <Select
        multiple={multiSelect}
        value={selectedItems}
        onChange={handleChange}
        renderValue={(selected) => {
          if (!multiSelect) {
            const selectedItem = items.find(
              (item) => item.value === selected[0]
            );
            return selectedItem ? selectedItem.label || "All" : "All";
          }

          return (
            selected
              ?.map((value) => {
                const selectedItem = items.find((item) => item.value === value);
                return selectedItem ? selectedItem.label || "All" : "";
              })
              ?.join(", ") || "All"
          );
        }}
      >
        <MenuItem value="all">{"All"}</MenuItem>
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterDropdown;
