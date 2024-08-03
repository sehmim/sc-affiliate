import { createCharityEndpoint, deleteCharityEndpoint, updateCharityEndpoint } from "./env";


export const createCharity = async (charity) => {
    try {
        const response = await fetch(`${createCharityEndpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(charity),
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating charity:', error);
        throw error;
    }
};

export const deleteCharity = async (id) => {
  const response = await fetch(`${deleteCharityEndpoint}?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete charity');
  }
  return response.json();
};

export const updateCharity = async (id, updatedData) => {
    try {
        const response = await fetch(`${updateCharityEndpoint}?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error('Failed to update charity');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating charity:', error);
        throw error;
    }
};