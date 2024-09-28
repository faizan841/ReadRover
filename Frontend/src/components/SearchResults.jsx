import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

export default function SearchResults({ searchResults, handleAddBook }) {
  return (
    <Grid container spacing={2}>
      {searchResults.map((book) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={
                book.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg"
              }
              alt={book.volumeInfo.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {book.volumeInfo.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {book.volumeInfo.authors?.join(", ")}
              </Typography>
              <IconButton
                color="primary"
                onClick={() => handleAddBook(book)}
                sx={{ mt: 1 }}
              >
                <AddIcon />
              </IconButton>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
