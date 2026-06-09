import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  PersonAdd,
  Grade,
  EventNote,
  CalendarMonth,
  Message,
  Assessment,
  Settings,
  Logout,
  School,
  Mail,
  EmojiEvents
} from '@mui/icons-material';

const drawerWidth = 260;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    // Estudiantes solo ven su avatar
    if (user?.role === 'student') {
      return [
        { text: 'Mi Avatar Matemático', icon: <EmojiEvents />, path: '/dashboard/avatar' },
        { text: 'Mensajes', icon: <Mail />, path: '/dashboard/messages', badge: 0 },
        { text: 'Calendario', icon: <CalendarMonth />, path: '/dashboard/calendar' },
      ];
    }

    const commonItems = [
      { text: 'Panel Principal', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Avatar Matemático', icon: <EmojiEvents />, path: '/dashboard/avatar' },
      { text: 'Mensajes', icon: <Mail />, path: '/dashboard/messages', badge: 2 },
      { text: 'Calendario', icon: <CalendarMonth />, path: '/dashboard/calendar' },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { text: 'Gestión de Usuarios', icon: <People />, path: '/dashboard/users' },
        { text: 'Matrícula', icon: <PersonAdd />, path: '/dashboard/enrollment' },
        { text: 'Reportes', icon: <Assessment />, path: '/dashboard/reports' }
      ];
    } else if (user?.role === 'teacher') {
      return [
        ...commonItems,
        { text: 'Calificaciones', icon: <Grade />, path: '/dashboard/grades' },
        { text: 'Asistencia', icon: <EventNote />, path: '/dashboard/attendance' }
      ];
    } else {
      return [
        ...commonItems,
        { text: 'Notas de mis Hijos', icon: <Grade />, path: '/dashboard/student-grades' }
      ];
    }
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <School sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap component="div">
          SGA
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión Académica
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {user?.name} ({user?.role === 'admin' ? 'Administrador' : user?.role === 'teacher' ? 'Docente' : user?.role === 'student' ? 'Estudiante' : 'Padre/Tutor'})
            </Typography>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Configuración
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'grey.50'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
