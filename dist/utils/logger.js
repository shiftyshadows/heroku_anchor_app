export const logger = message => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};