
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