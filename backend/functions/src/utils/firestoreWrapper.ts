import { db } from "..";

export async function storeData(
  collectionName: string,
  inputData: Record<string, any>
): Promise<string> {
  try {
    // Add the data to the specified Firestore collection
    const docRef = await db.collection(collectionName).add(inputData);
    // Return the document ID
    return docRef.id;
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    throw new Error('Failed to store data in Firestore');
  }
}


export async function getLatestEntry(
  collectionName: string
): Promise<any> {
  try {
    // Query the collection, ordering by document ID (latest to oldest)
    const latestEntrySnapshot = await db.collection(collectionName)
      .orderBy('__name__', 'desc') // Order by document ID in descending order to get the latest
      .limit(1) // Only get the most recent entry
      .get();

    // If there are no documents in the collection
    if (latestEntrySnapshot.empty) {
      throw new Error('No entries found in the collection');
    }

    // Get the latest document data
    const latestDoc = latestEntrySnapshot.docs[0];
    return { id: latestDoc.id, ...latestDoc.data() };
  } catch (error) {
    console.error('Error retrieving the latest entry from Firestore:', error);
    throw new Error('Failed to get the latest entry');
  }
}
