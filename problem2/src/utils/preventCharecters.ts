export const preventNotAllowedCharacters = (
  e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  notAllowedKeys: string[] = ['-']
) => {
  if (notAllowedKeys.includes(e.key)) {
    e.preventDefault();
  }
};
