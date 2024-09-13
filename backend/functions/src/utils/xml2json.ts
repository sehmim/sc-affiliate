import { parseStringPromise } from 'xml2js';

export async function convertXmlToJson(xmlString: string): Promise<any> {
  try {
    // Parse the XML string into a JSON object
    const result = await parseStringPromise(xmlString, { explicitArray: false, mergeAttrs: true });
    return result;
  } catch (error) {
    console.error('Error parsing XML to JSON:', error);
    throw new Error('Failed to convert XML to JSON');
  }
}
