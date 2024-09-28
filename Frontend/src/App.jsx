import React, { useState, useMemo, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CircularProgress, Box } from "@mui/material";

import Auth from "./components/Auth";
import { useAuth } from "./hooks/useAuth";
import NavBar from "./components/NavBar";
import createAppTheme from "./theme";

// Lazy load components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BrowseResults = lazy(() => import("./components/BrowseResults"));
const Bookshelf = lazy(() => import("./pages/Bookshelf"));
const ReviewBook = lazy(() => import("./pages/ReviewBook"));
const Books = lazy(() => import("./components/Books"));
const BookDetail = lazy(() => import("./components/BookDetail"));
const Friends = lazy(() => import("./components/Friends"));

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Layout({ children, toggleColorMode }) {
  return (
    <>
      <NavBar toggleColorMode={toggleColorMode} />
      <Suspense fallback={<CircularProgress />}>{children}</Suspense>
    </>
  );
}

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode || "light";
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode);
          return newMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout toggleColorMode={colorMode.toggleColorMode}>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/browse"
            element={
              <PrivateRoute>
                <Layout toggleColorMode={colorMode.toggleColorMode}>
                  <BrowseResults />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/bookshelf"
            element={
              <PrivateRoute>
                <Layout toggleColorMode={colorMode.toggleColorMode}>
                  <Bookshelf />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/review-book/:bookId"
            element={
              <PrivateRoute>
                <Layout toggleColorMode={colorMode.toggleColorMode}>
                  <ReviewBook />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <Layout toggleColorMode={colorMode.toggleColorMode}>
                  <Books />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/book/:bookId"
            element={
              <PrivateRoute>
                <Layout toggleColorMode={colorMode.toggleColorMode}>
                  <BookDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <PrivateRoute>
                <Layout toggleColorMode={colorMode.toggleColorMode}>
                  <Friends />
                </Layout>
              </PrivateRoute>
            }
          />
           <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
