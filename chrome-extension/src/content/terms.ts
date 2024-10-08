import { Campaign } from "../types/types";

export function createTermsAndServiceDiv(allowedBrand: Campaign) {
  // Create the fieldset
  const fieldset = document.createElement('fieldset');
  fieldset.style.margin = '5px'; // Set margin for the fieldset
  fieldset.style.border = 'none'; // Remove the default border
  fieldset.style.position = 'relative';   
  fieldset.style.top = '32px'; 

  // Create the legend with centered text
  const legend = document.createElement('legend');
  legend.textContent = 'Offer Terms and Service';
  legend.style.textAlign = 'center'; // Center the legend text
  legend.style.fontSize = '14px'; // Set font size for the legend
  legend.style.padding = '0 10px'; // Add padding for spacing
  legend.style.margin = '0'; // Remove default margin
  legend.style.position = 'relative'; // Allow positioning adjustments

  // Create a pseudo-element for the lines
  const lineBefore = document.createElement('span');
  lineBefore.textContent = '';
  lineBefore.style.borderBottom = '1px solid black'; // Line on the left
  lineBefore.style.flexGrow = '1'; // Allow the line to grow
  lineBefore.style.marginRight = '10px'; // Space between line and text

  const lineAfter = document.createElement('span');
  lineAfter.textContent = '';
  lineAfter.style.borderBottom = '1px solid black'; // Line on the right
  lineAfter.style.flexGrow = '1'; // Allow the line to grow
  lineAfter.style.marginLeft = '10px'; // Space between line and text

  // Create a container for the lines and the legend text
  const legendContainer = document.createElement('div');
  legendContainer.style.display = 'flex'; // Use flexbox to align items
  legendContainer.style.alignItems = 'center'; // Center vertically
  legendContainer.appendChild(lineBefore);
  legendContainer.appendChild(legend);
  legendContainer.appendChild(lineAfter);

  // Append the legendContainer to the fieldset
  fieldset.appendChild(legendContainer);

  // Create the terms as paragraph elements
  const termsWrapper = document.createElement('div');
  termsWrapper.style.height = '115px'; 
  termsWrapper.style.overflow = 'auto'; 

  allowedBrand && allowedBrand?.terms?.forEach((term: any) => {
    const p = document.createElement('p');
    p.style.fontSize = '12px'; // Set font size for the terms
    p.style.marginBottom = '5px'; // Remove default margin for paragraphs

    // Check if details exist and create the appropriate content
    if (term.details) {
      p.innerHTML = `<b>${term.title}:</b> ${term.details}`;
    }

    termsWrapper.appendChild(p);
  });
  
  fieldset.appendChild(termsWrapper);

  return fieldset;
}


export function hasMultipleTerms(arr: any[]) {
    let count = 0;

    for (const item of arr) {
        if (item.details) {
            count++;
        }
        if (count > 1) {
            return true;
        }
    }

    return false;
}