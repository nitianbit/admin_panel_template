import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Search, SearchIconWrapper, StyledInputBase } from "../styles";
import { Button } from "@mui/material";

export default function SearchInput({ handleChange }: any) {
  return (
    <>
      <Search style={{width:'300px',margin:'0 10px'}}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
          onChange={handleChange}
        />
      </Search>
    </>
  );
}
