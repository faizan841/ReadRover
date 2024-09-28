import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Button,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

export default function BookshelfTable({
  books,
  handleOpenReviewDialog,
  handleMarkAsReading,
  handleRemoveFromReading,
  handleDeleteBook,
}) {
  console.log(books);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cover</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Your Rating</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book._id}>
              <TableCell>
                <img
                  src={book.thumbnail || "/placeholder.svg"}
                  alt={book.title}
                  style={{ width: 50, height: 75, objectFit: "cover" }}
                />
              </TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.authors.join(", ")}</TableCell>
              <TableCell>
                <Rating value={book.averageRating || 0} readOnly />
              </TableCell>
              <TableCell>
                <Button onClick={() => handleOpenReviewDialog(book)}>
                  {book.review ? "Edit Review" : "Add Review"}
                </Button>
                {book.currentlyReading ? (
                  <Button onClick={() => handleRemoveFromReading(book)}>
                    Remove from Reading
                  </Button>
                ) : (
                  <Button onClick={() => handleMarkAsReading(book)}>
                    Mark as Reading
                  </Button>
                )}
                <IconButton
                  onClick={() => handleDeleteBook(book._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
