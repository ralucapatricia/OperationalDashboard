import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Button from "@mui/material/Button";
import Notifications from "./Notifications";

import { Link } from "react-router-dom";
import "./ToolBar.css";

export default function ToolBar({ onExportClick, removeOptions, notifications }) {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="/img/nokia_logo.png"
              alt=" "
              style={{ width: "70px", height: "40px", marginTop: "10px" }}
            />
            <img
              src="/img/logo.png"
              alt=" "
              style={{ width: "50px", height: "50px", marginTop: "10px" }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "block" },
                textAlign: "center",
              }}
            >
              <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=LXGW+WenKai+Mono+TC&display=swap');
              </style>
              <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=LXGW+WenKai+Mono+TC&family=Monoton&display=swap');
              </style>
              <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bungee+Shade&family=LXGW+WenKai+Mono+TC&family=Monoton&display=swap');
              </style>
              <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Bungee+Shade&family=LXGW+WenKai+Mono+TC&family=Monoton&display=swap');
              </style>
              <h4 className="app_name">KPI Guardian</h4>
            </Typography>
            <div sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <Link to="/homepage">
                  <HomeIcon style={{ color: "#001F67" }} />
                </Link>
              </IconButton>
              {!removeOptions && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                >
                  <Link to="/grafice">
                  <BarChartIcon style={{ color: "#001F67" }} />
                  </Link>
                </IconButton>
              )}
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <Notifications notifications={notifications} />
              </IconButton>
              <IconButton
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
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <Link to="/">
                  <ExitToAppIcon style={{ color: "white" }} />
                </Link>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
