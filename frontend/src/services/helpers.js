// export const getInstructorName = (htmlString) => {
//   const match = htmlString.match(
//     /<span class="instructor-display-name">(.*?)<\/span>/
//   );
//   return match ? match[1] : "Unknown Instructor";
// };

// export const getPrice = (htmlString) => {
//     const priceMatch = htmlString.match(/<span class="price">(.*?)<\/span>/);
//     if (priceMatch) {
//       return priceMatch[1].replace(/&#036;/g, "$").trim();
//     }

//     const originalMatch = htmlString.match(
//       /<span class="origin-price">(.*?)<\/span>/
//     );
//     if (originalMatch) {
//       return originalMatch[1].replace(/&#036;/g, "$").trim();
//     }

//     return "Free";
//   };

export const getThumbnail = (htmlString) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    const imgElement = tempDiv.querySelector('img');
    const imgUrl = imgElement ? imgElement.src : null;
    return imgUrl;
  }

export const decodeHtmlEntities = (text) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    return doc.documentElement.textContent;
  };


export const getLink = (htmlString) => {
  const s = htmlString
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-");    

  return `https://studentsforstudents.fast-page.org/courses/${s}/`
  
}

export const extractText = (htmlString, className) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  const el = tempDiv.querySelector(`.${className}`);
  return el ? el.textContent.trim() : "";
}