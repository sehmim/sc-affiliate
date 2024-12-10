import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useFirestoreCollection } from "../../../hooks/useFirestoreCollection";
import { useAddFirestoreEntry } from "../../../hooks/useAddFirestoreEntry";
import { useDeleteFirestoreEntry } from "../../../hooks/useDeleteFirestoreEntry";

const CategoriesTable = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: categories, loading: loadingCategories, error: errorCategories } = useFirestoreCollection("categories", refreshKey);
  const { addEntry, loading: addingCategory, error: errorAddingCategory } = useAddFirestoreEntry("categories");
  const { deleteEntry, loading: deletingCategory, error: errorDeletingCategory } = useDeleteFirestoreEntry("categories");
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") {
      alert("Category name cannot be empty.");
      return;
    }
    await addEntry({ name: newCategory });
    setNewCategory("");
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleRemoveCategory = async (id) => {
    await deleteEntry(id);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  if (loadingCategories) {
    return <div>Loading categories...</div>;
  }

  if (errorCategories) {
    return <div>Error: {errorCategories}</div>;
  }

  return (
    <div style={{ margin: "20px" }}>
      <h2>Categories</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleRemoveCategory(category.id)}
                    color="error"
                    disabled={deletingCategory}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h3 style={{ marginTop: "20px" }}>Add a New Category</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddCategory();
        }}
        style={{ display: "flex", marginTop: "10px", gap: "10px" }}
      >
        <TextField
          label="New Category"
          variant="outlined"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          fullWidth
          disabled={addingCategory}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={addingCategory}
        >
          {addingCategory ? "Adding..." : "Add Category"}
        </Button>
      </form>

      {errorAddingCategory && <div style={{ color: "red", marginTop: "10px" }}>{errorAddingCategory}</div>}
      {errorDeletingCategory && <div style={{ color: "red", marginTop: "10px" }}>{errorDeletingCategory}</div>}
    </div>
  );
};

export default CategoriesTable;
