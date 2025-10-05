export const splitTitle = (title: string) => {
  const words = title.split(' ');
  
  if (words.length >= 2) {
    return {
      firstWord: words[0],
      restWords: words.slice(1).join(' '),
      hasTwoWords: true
    };
  }
  
  return {
    firstWord: title,
    restWords: '',
    hasTwoWords: false
  };
};