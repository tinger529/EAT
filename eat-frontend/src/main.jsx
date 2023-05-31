import React from 'react'
import {ChakraProvider, extendTheme, ColorModeScript, ThemeProvider, CSSReset} from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'


// Create a custom theme

const customTheme = extendTheme({
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
    styles: {
      global: {
        // Override the background color for the body
        body: {
          bg: "#000f0e",
          color: "#92adc1",
          text: "#92adc1",
          // background image
          backgroundImage: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 150%",
          colorScheme: "dark",
        },
      },
    },
  });


const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ChakraProvider theme={customTheme}>
            <App/>
        </ChakraProvider>
    </React.StrictMode>,
)
