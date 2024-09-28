import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) {
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder="Search for books"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleSearch}
      sx={{
        flexGrow: 1,
        mr: 1,
        "& .MuiOutlinedInput-root": {
          backgroundColor: "background.paper",
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleSearch} edge="end">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
