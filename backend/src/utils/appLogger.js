export default {
  log(level, message) {
    console.log(`[${level.toUpperCase()}] ${message}`);
  },
  error(message) {
    console.error(`[ERROR] ${message}`);
  },
};
