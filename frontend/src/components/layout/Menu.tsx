import React, { useContext } from "react";
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
  AppBarProps as MuiAppBarProps,
  Paper,
  Button
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  TransformSharp,
} from '@mui/icons-material';
import { apiUrl } from '../../../config'
import CardComponent from '../layout/Card';
import FormComponent from '../pages/Form/Conteiner';
import QualityMetricsComponent from '../pages/QualityMetrics/Conteiner';
import { Form } from "../../model/model";
import { AuthContext } from "../../context/AuthContext"

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Menu: React.FC = () => {
  const theme = useTheme();
  const authContext = useContext(AuthContext);

  const [open, setOpen] = React.useState(false);
  const [pagesNumber, setPagesNumber] = React.useState(0);
  const [showCard, setShowCard] = React.useState(false);

  if (!authContext) {
    console.error("Deu ruim");
    return null;
  }

  const { formData, setFormData, directory, setDirectory } = authContext;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleToggleCard = () => {
    setShowCard(!showCard);
  };

  const handleFormChange = (updatedData: Form) => {
    setFormData(updatedData);
  };

  const handleFormSubmit = async () => {
    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key as keyof Form] !== null) {
          data.append(key, formData[key as keyof Form] as string | Blob);
        }
      }

      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form Data Submitted:', formData);
        setDirectory(result.models);
        console.log('Response Data:', directory);
      } else {
        console.error('Erro ao submeter os dados:', response.statusText);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const pages = (value: number) => {
    switch (value) {
      case 0:
        return <FormComponent />;
      case 1:
        return <QualityMetricsComponent />;
      default:
        return 'Não encontrado';
    }
  };

  const titulo = [
    { label: 'Predição', icon: <TransformSharp /> },
    { label: 'Metricas de Qualidade', icon: <TransformSharp /> }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Project Artificial Intelligence
          </Typography>
          <Button color="inherit" onClick={handleToggleCard}>
            Adicionar dados
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {titulo.map((text, index) => (
            <ListItem key={text.label} disablePadding>
              <ListItemButton onClick={() => setPagesNumber(index)}>
                <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText primary={text.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {showCard && (
          <Box
            sx={{
              position: 'absolute',
              top: '64px',
              right: '16px',
              zIndex: 1300,
            }}
          >
            <CardComponent
              handleClose={handleToggleCard}
              handleFormChange={handleFormChange}
              handleFormSubmit={handleFormSubmit}
              formData={formData}
            />
          </Box>
        )}
        <Paper>{pages(pagesNumber)}</Paper>
      </Main>
    </Box>
  );
};

export default Menu;
