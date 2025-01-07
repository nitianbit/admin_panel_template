import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useThemeStore } from "./store/themeStore";
import { useCompanyStore } from "./services/company";

//const Theme = createTheme(themeOptions);

export default function App() {
  const { theme } = useThemeStore();

  const { data, fetchGrid, setGlobalCompanyId } = useCompanyStore()
  React.useEffect(() => {
    if(data.length === 0){
      fetchGrid()
    }
  }, [data])


  return (
    <ThemeProvider theme={createTheme(theme)}>
      <CssBaseline />
      <React.Suspense
        fallback={
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        }
      >
        <RouterProvider router={router} />
        {/* <StickyFooter /> */}
      </React.Suspense>
    </ThemeProvider>
  );
}
