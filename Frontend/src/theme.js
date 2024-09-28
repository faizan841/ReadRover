import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

// Define custom color palette
const customPalette = (mode) => ({
  primary: {
    main: mode === "light" ? "#3A506B" : "#5C7A99",
    light: mode === "light" ? "#5C7A99" : "#7B9AB9",
    dark: mode === "light" ? "#1C2B3A" : "#2C3E50",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: mode === "light" ? "#6FFFE9" : "#4ECDC4",
    light: mode === "light" ? "#A3FFEF" : "#7EEEE7",
    dark: mode === "light" ? "#3DCCB4" : "#2E8B57",
    contrastText: "#000000",
  },
  background: {
    default: mode === "light" ? "#F0F4F8" : "#121212",
    paper: mode === "light" ? "#FFFFFF" : "#1E1E1E",
  },
  text: {
    primary: mode === "light" ? "#1A1A1A" : "#FFFFFF",
    secondary: mode === "light" ? "#4A4A4A" : "#B0B0B0",
  },
  error: {
    main: mode === "light" ? "#D64045" : "#FF6B6B",
  },
  warning: {
    main: mode === "light" ? "#FFB800" : "#FFA000",
  },
  success: {
    main: mode === "light" ? "#06D6A0" : "#00C853",
  },
  info: {
    main: mode === "light" ? "#0CB0D1" : "#03A9F4",
  },
});

// Create the theme
const createAppTheme = (mode) => {
  let theme = createTheme({
    palette: {
      mode,
      ...customPalette(mode),
    },
    typography: {
      fontFamily: "'Raleway', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: {
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700,
      },
      h2: {
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700,
      },
      h3: {
        fontFamily: "'Playfair Display', serif",
        fontWeight: 600,
      },
      h4: {
        fontFamily: "'Playfair Display', serif",
        fontWeight: 600,
      },
      h5: {
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 600,
      },
      h6: {
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 600,
      },
      subtitle1: {
        fontFamily: "'Merriweather', serif",
        fontStyle: "italic",
      },
      body1: {
        fontFamily: "'Raleway', sans-serif",
      },
      button: {
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 600,
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      "none",
      "0px 2px 4px rgba(0,0,0,0.1)",
      "0px 4px 8px rgba(0,0,0,0.1)",
      "0px 8px 16px rgba(0,0,0,0.1)",
      "0px 16px 24px rgba(0,0,0,0.1)",
      "0px 24px 32px rgba(0,0,0,0.1)",
      ...Array(19).fill("none"), // Fill the rest with 'none' to match MUI's 25 levels
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "all 0.3s linear",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 30,
            padding: "10px 24px",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
          },
          contained: {
            background: `linear-gradient(45deg, ${
              customPalette(mode).primary.main
            }, ${customPalette(mode).primary.light})`,
            "&:hover": {
              background: `linear-gradient(45deg, ${
                customPalette(mode).primary.light
              }, ${customPalette(mode).primary.main})`,
            },
          },
          outlined: {
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: `linear-gradient(90deg, ${
              customPalette(mode).primary.main
            }, ${customPalette(mode).primary.dark})`,
            boxShadow: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: alpha(customPalette(mode).primary.main, 0.3),
                transition: "all 0.3s ease-in-out",
              },
              "&:hover fieldset": {
                borderColor: customPalette(mode).primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: customPalette(mode).primary.main,
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
  });

  // Apply responsive font sizes
  theme = responsiveFontSizes(theme);

  return theme;
};

export default createAppTheme;
