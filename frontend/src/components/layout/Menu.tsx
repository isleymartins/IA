import React, { useContext, useEffect } from "react";
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
} from '@mui/material'
import MuiAppBar from '@mui/material/AppBar';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  TransformSharp,
} from '@mui/icons-material'
import { CardComponent } from '../layout/Card';
import { FormUploadFile } from '../pages/Form/FormUploud';   
import FormComponent from "../pages/Form/Conteiner"; 
import QualityMetricsComponent from '../pages/QualityMetrics/Conteiner';
import { FileInformation, Form } from "../../model/model";
import { fetchUpload } from "../../service/axios";
import { AuthContext } from "../../context/AuthContext";

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
  const [fileUploadForm, setTempFormData] = React.useState<Form>({ testCase: 0, feature: '', file: null })

  const { fileData, setFileData, formData, setFormData, setDirectory } = authContext
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    if (loading) {
      handleFormSubmit()
    }

  }, [loading])

  const toggleDrawer = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleToggleCard = () => {
    setShowCard(!showCard);
  };

  const handleFormChange = (updatedData: Form) => {
    setTempFormData(updatedData);
  };

  const handleFormSubmit = async () => {
    // Atualiza formData somente no submit
    const data = new FormData()
    for (const key in fileUploadForm) {
      if (fileUploadForm[key as keyof Form] !== null) {
        data.append(key, fileUploadForm[key as keyof Form] as string | Blob);
      }
    }

    await fetchUpload(data).then((response: FileInformation | undefined) => {
      if (response !== undefined) {
        setFileData(response);
        setDirectory(response.models)
        setFormData(fileUploadForm)
      }


    }).finally(() => { setLoading(false) })

    // handleToggleCard(); // Fechar o card após submissão
  };

  const pages = (value: number) => {
    switch (value) {
      case 0:
        return <FormComponent index={value} />;
      case 1:
        return <FormComponent index={value} />;
      /*case 2:
        return <QualityMetricsComponent />;*/
      default:
        return 'Não encontrado';
    }
  };

  const titulo = [
    { label: "Distancia Minima", icon: <TransformSharp /> },
    { label: "Classificador de Bayes", icon: <TransformSharp /> },
    { label: 'Metricas de Qualidade', icon: <TransformSharp /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Project Artificial Intelligence
          </Typography>
          <Button color="inherit" variant="outlined" onClick={handleToggleCard}>
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
          <IconButton onClick={toggleDrawer}>
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
              // handleFormSubmit={handleFormSubmit(fileUploadForm)}
              formData={fileUploadForm} // Usando fileUploadFrom
              loading={loading}
              setLoading={setLoading}
            >
              <FormUploadFile handleFormChange={handleFormChange} formData={fileUploadForm} />
            </CardComponent>
          </Box>
        )}
        <Paper>{pages(pagesNumber)}</Paper>
      </Main>
    </Box>
  );
};

export default Menu;
