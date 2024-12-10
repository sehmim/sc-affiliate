import React, { useState } from 'react';
import {
    MenuItem,
    Select,
    Button,
    Checkbox,
    ListItemText,
    OutlinedInput,
    FormControl,
    InputLabel,
    Box,
    CircularProgress
} from '@mui/material';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { useLatestEntryUpdate } from '../hooks/useLatestEntryUpdate';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const MerchantCategorySelector = ({ campaign, collection }) => {
    const { data: categories, loading, error } = useFirestoreCollection("categories");
    const [selectedCategories, setSelectedCategories] = useState(campaign?.categories ? [...campaign?.categories] : []);
    const [isUpdated, setIsUpdated] = useState(false);

    const { updateLatestEntry, loading: updating, error: updateError } = useLatestEntryUpdate(
        collection,
        campaign,
        "categories",
        selectedCategories
    );

    const handleCategoryChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedCategories(
            typeof value === 'string' ? value.split(',') : value
        );
        setIsUpdated(true);
    };

    const handleUpdateClick = async () => {
        await updateLatestEntry();
        if (!updateError) {
            console.log('Updated categories:', selectedCategories);
            setIsUpdated(false);
        } else {
            console.error('Error updating categories:', updateError);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <Box sx={{ color: 'error.main' }}>Error: {error}</Box>;
    }

    return (
        <Box sx={{ width: 300 }}>
            {categories.length > 0 ? (
                <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="category-select-label">Categories</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        multiple
                        value={selectedCategories}
                        onChange={handleCategoryChange}
                        input={<OutlinedInput label="Categories" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.name}>
                                <Checkbox checked={selectedCategories.includes(category.name)} />
                                <ListItemText primary={category.name} />
                            </MenuItem>
                        ))}
                    </Select>
                    {isUpdated && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateClick}
                            sx={{ mt: 2 }}
                            disabled={updating}
                        >
                            {updating ? "Updating..." : "Update"}
                        </Button>
                    )}
                </FormControl>
            ) : (
                <Box sx={{ color: 'text.secondary' }}>No categories available</Box>
            )}
        </Box>
    );
};

export default MerchantCategorySelector;
