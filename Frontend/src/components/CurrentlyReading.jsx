import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Stack,
} from "@mui/material";

export default function CurrentlyReading({
  books,
  handleOpenProgressDialog,
  handleFinishBook,
}) {
  return (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Currently Reading
      </Typography>
      {books.length > 0 ? (
        <Stack spacing={2}>
          {books.map((book) => (
            <Card
              key={book._id}
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <CardContent sx={{ flex: "1 0 auto", p: 2 }}>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <Box
                    component="img"
                    sx={{
                      width: 60,
                      height: 90,
                      objectFit: "cover",
                      mr: 2,
                    }}
                    src={book.thumbnail || "/placeholder.svg"}
                    alt={book.title}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography component="div" variant="subtitle1" noWrap>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {book.authors.join(", ")}
                    </Typography>
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress
                        variant="determinate"
                        value={book.progress}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {book.pagesRead || 0}/{book.pageCount || "?"} pages
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {book.progress}% completed
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenProgressDialog(book)}
                  >
                    Update Progress
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleFinishBook(book._id)}
                  >
                    I've finished
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              You're not currently reading any books. Why not start a new one?
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
