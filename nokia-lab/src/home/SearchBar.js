import { styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#3e688a3', 
    '&:hover': {
      backgroundColor: '#3e688a3',
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchBar({ setSearchFunction }) {  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
  <IconButton
    size="large"
    edge="start"
    color="inherit"
    aria-label="open drawer"
    sx={{ mr: 2 }}
  >
    <Link to="/homepage"><HomeIcon style={{ fontSize: 30, color: '#001F67' }} /></Link>
  </IconButton>
  <IconButton
    size="large"
    edge="start"
    color="inherit"
    aria-label="open drawer"
    sx={{ mr: 2 }}
  >
    <Link to="/grafice"><BarChartIcon style={{ fontSize: 25, color: '#001F67' }} /></Link>
  </IconButton>
  <Typography
    variant="h6"
    noWrap
    component="div"
    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
  >
  </Typography>
  <Search>
    <SearchIconWrapper>
      <SearchIcon />
    </SearchIconWrapper>
    <StyledInputBase
       placeholder="Search…"
       inputProps={{ 'aria-label': 'search' }}
       onKeyUp={(event) => setSearchFunction(event)}
    />
  </Search>
  <div sx={{ display: 'flex', alignItems: 'center' }}>
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="open drawer"
      sx={{ mr: 2 }}
    >
      <Button variant="contained" color="success">
  Export
</Button>
    </IconButton>
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="open drawer"
      sx={{ mr: 2 }}
    >
      <Link to="/"><ExitToAppIcon style={{ fontSize: 30, color: 'white' }} /></Link>
    </IconButton>
  </div>
</Toolbar>
      </AppBar>
    </Box>
  );
}
