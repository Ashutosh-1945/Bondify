import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Navigate, useNavigate } from 'react-router';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border: 1,
  borderColor: 'black',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  display: 'flex',
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
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function Header() {
  const navigate = useNavigate();

  function create_event(){
    navigate('/create');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'red' }}>
        <Toolbar>
          <IconButton size="medium" edge="start" color="inherit" sx={{ mr: 0 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            Bondify
          </Typography>
          <Box sx={{ display: 'flex', ml: 15 }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search by location" inputProps={{ 'aria-label': 'search' }} />
            </Search>
            <Search sx={{ ml: 0 }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search event" inputProps={{ 'aria-label': 'search' }} />
            </Search>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
            <IconButton size="small" color="inherit">
              <Badge badgeContent={5} color="error">
                <MailIcon fontSize="medium" />
              </Badge>
            </IconButton>
            <Typography variant="caption">Messages</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
            <IconButton size="small" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon fontSize="medium" />
              </Badge>
            </IconButton>
            <Typography variant="caption">Notifications</Typography>
          </Box>
          <Box onClick={create_event} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
            <IconButton size="small" color="inherit">
              <AddCircleOutlineIcon fontSize="medium" />
            </IconButton>
            <Typography variant="caption">Create</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
            <IconButton size="small" edge="end" color="inherit">
              <AccountCircle fontSize="medium" />
            </IconButton>
            <Typography variant="caption">Profile</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
