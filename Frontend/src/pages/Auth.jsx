import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { BookOpen, Feather, Users, TrendingUp } from "lucide-react";
import {
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  "& > svg": {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate("/dashboard");
      } else {
        await api.post(`/api/auth/register`, { username, email, password });
        await login(email, password);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "An error occurred. Please try again."
      );
      console.error("Error details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackground>
      <CssBaseline />
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            color="primary.contrastText"
          >
            Welcome to ReadRover
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
            color="primary.contrastText"
          >
            Embark on a literary journey like never before
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            mt: 4,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <FeatureCard>
                  <CardContent>
                    <IconWrapper>
                      <BookOpen />
                      <Typography variant="h6">Track Your Reading</Typography>
                    </IconWrapper>
                    <Typography>
                      Keep a detailed log of your reading history and progress.
                    </Typography>
                  </CardContent>
                </FeatureCard>
                <FeatureCard>
                  <CardContent>
                    <IconWrapper>
                      <Feather />
                      <Typography variant="h6">Write Reviews</Typography>
                    </IconWrapper>
                    <Typography>
                      Share your thoughts and insights on the books you've read.
                    </Typography>
                  </CardContent>
                </FeatureCard>
                <FeatureCard>
                  <CardContent>
                    <IconWrapper>
                      <Users />
                      <Typography variant="h6">Connect with Friends</Typography>
                    </IconWrapper>
                    <Typography>
                      Discover what your friends are reading and share
                      recommendations.
                    </Typography>
                  </CardContent>
                </FeatureCard>
                <FeatureCard>
                  <CardContent>
                    <IconWrapper>
                      <TrendingUp />
                      <Typography variant="h6">Set Reading Goals</Typography>
                    </IconWrapper>
                    <Typography>
                      Challenge yourself with personalized reading goals and
                      track your progress.
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Box>
            </motion.div>
          </Box>

          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader
                  title="Get Started"
                  subheader="Sign in or create an account to begin your reading adventure"
                />
                <CardContent>
                  <Tabs
                    value={isLogin ? 0 : 1}
                    onChange={(e, newValue) => setIsLogin(newValue === 0)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                  >
                    <Tab label="Login" />
                    <Tab label="Register" />
                  </Tabs>
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 3 }}
                  >
                    {!isLogin && (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    )}
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus={isLogin}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                      <Typography color="error" align="center">
                        {error}
                      </Typography>
                    )}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} />
                      ) : isLogin ? (
                        "Sign In"
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </GradientBackground>
  );
}
