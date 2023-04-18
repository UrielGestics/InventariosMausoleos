//Tema
import { createTheme } from '@mui/material/styles';

export const apiURL = 'https://inventariosmausoleos.com/InventariosMausoleosBackEnd/';

let obscuro = '';

if (localStorage.oscuro == 'true') {
    localStorage.oscuro = 'true'
    obscuro = 'dark'
} else {
    localStorage.oscuro = 'false'
    obscuro = 'light'
}

export const darkTheme = createTheme({
    palette: {
        mode: obscuro,
    },
});