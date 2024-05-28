import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function ToolBar({ onExportClick, removeOptions }) {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <Link to="/homepage">
                <HomeIcon style={{ fontSize: 30, color: "#001F67" }} />
              </Link>
            </IconButton>
            {!removeOptions && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <Link to="/grafice">
                  <BarChartIcon style={{ fontSize: 25, color: "#001F67" }} />
                </Link>
              </IconButton>
            )}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            ></Typography>
            <div sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                {!removeOptions && (
                  <Button
                    onClick={onExportClick}
                    variant="contained"
                    color="success"
                  >
                    Export
                  </Button>
                )}
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <Link to="/">
                  <ExitToAppIcon style={{ fontSize: 30, color: "white" }} />
                </Link>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <div>
        <div></div>
      </div>
    </div>
  );
}