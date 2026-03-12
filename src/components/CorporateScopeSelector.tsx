import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import { useCompanyStore } from "../services/company";
import { useCorporateStore } from "../services/corporates";

type ScopeMode = "general" | "corporate";

const CorporateScopeSelector: React.FC = () => {
  const { globalCompanyId, setGlobalCompanyId } = useCompanyStore();
  const { allData: corporateData, fetchAll } = useCorporateStore();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ScopeMode>("general");
  const [selectedCorporateId, setSelectedCorporateId] = useState<string>("");

  // Initialize local state from globalCompanyId
  useEffect(() => {
    if (globalCompanyId && globalCompanyId !== "general") {
      setMode("corporate");
      setSelectedCorporateId(globalCompanyId);
    } else {
      setMode("general");
      setSelectedCorporateId("");
    }
  }, [globalCompanyId]);

  // Load corporates when modal opens (fetch all, no limit)
  useEffect(() => {
    if (open) {
      fetchAll();
    }
  }, [open, fetchAll]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApply = () => {
    if (mode === "general") {
      setGlobalCompanyId("general");
    } else if (mode === "corporate" && selectedCorporateId) {
      setGlobalCompanyId(selectedCorporateId);
    }
    setOpen(false);
  };

  const currentLabel =
    globalCompanyId && globalCompanyId !== "general"
      ? (() => {
          const selected = corporateData.find((c: any) => c._id === globalCompanyId);
          if (!selected) return "Select Corporate Scope";
          return `${selected.name} — ${selected.companyName || ""}`;
        })()
      : "General (Non-Corporate)";

  return (
    <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        sx={{ textTransform: "none" }}
      >
        {currentLabel}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Select Data Scope</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Choose how you want to view data:
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={mode}
                onChange={(e) => setMode(e.target.value as ScopeMode)}
              >
                <FormControlLabel
                  value="general"
                  control={<Radio />}
                  label="General (without corporate data)"
                />
                <FormControlLabel
                  value="corporate"
                  control={<Radio />}
                  label="Corporate"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {mode === "corporate" && (
            <Box sx={{ mt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="scope-corporate-select-label">
                  Select Corporate
                </InputLabel>
                <Select
                  labelId="scope-corporate-select-label"
                  label="Select Corporate"
                  value={selectedCorporateId}
                  onChange={(e) => setSelectedCorporateId(e.target.value)}
                >
                  {corporateData.map((corporate: any) => (
                    <MenuItem key={corporate._id} value={corporate._id}>
                      {corporate.name}{" "}
                      {corporate.companyName
                        ? `— ${corporate.companyName}`
                        : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleApply}
            variant="contained"
            disabled={mode === "corporate" && !selectedCorporateId}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CorporateScopeSelector;

