import { Campaign } from "../campagins/Campaigns";

export function sortByIsFeatured(campaigns: Campaign[]) {
  return campaigns.sort((a, b) => {
    if (a.isFeatured === b.isFeatured) {
      return 0; // If both are equal (both true or both false/undefined), don't change the order
    }
    // Place the object with isFeatured = true before others
    return a.isFeatured ? -1 : 1;
  });
}