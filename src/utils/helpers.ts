export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};