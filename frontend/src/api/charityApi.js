import { createCharityEndpoint, deleteCharityEndpoint } from "./env";


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