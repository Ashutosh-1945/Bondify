import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid #ccc',
  marginLeft: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(255 255 255 / 0.15)', // Slight transparent white for input background
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#f0f0f0', // lighter icon color
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#f0f0f0',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: theme.spacing(2),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function Header() {
  const navigate = useNavigate();

  function create_event() {
    navigate('/create');
  }

  function profile() {
    navigate('/profile');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#D35400', // rich orange background
          color: '#ccc', // light grey text/icons
          borderBottom: '2px solid #BF5700', // darker orange border
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              mr: 10,
              fontFamily: '"Comic Sans MS", "Comic Neue", cursive',
              color: '#f0f0f0', // lighter text color for contrast
              textShadow: '2px 2px #873800', // subtle darker orange shadow for depth
              letterSpacing: '2px',
            }}
          >
            Bondify
          </Typography>
          <Box sx={{ display: 'flex', ml: 10 }}>
            <Search sx={{ ml: 1, width: '300px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <StyledInputBase placeholder="Search events" inputProps={{ 'aria-label': 'search events' }} />
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
            </Search>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'end', gap: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton sx={{ '& svg': { fontSize: 34 }, color: '#ccc' }}>
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Typography variant="body2" sx={{ mt: '-6px', fontWeight: 500, color: '#ccc' }}>
                Notifications
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={create_event}
            >
              <IconButton sx={{ '& svg': { fontSize: 34 }, color: '#ccc' }}>
                <AddCircleOutlineIcon />
              </IconButton>
              <Typography variant="body2" sx={{ mt: '-6px', fontWeight: 500, color: '#ccc' }}>
                Create
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={profile}
            >
              <IconButton sx={{ '& svg': { fontSize: 34 }, color: '#ccc' }}>
                <AccountCircle />
              </IconButton>
              <Typography variant="body2" sx={{ mt: '-6px', fontWeight: 500, color: '#ccc' }}>
                Profile
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
