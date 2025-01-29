export const generateSequence = (title) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; 
  }
  return `book_${Math.abs(hash)}`;
};
