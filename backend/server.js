const app = require('./src/app');

const PORT = process.env.PORT || 5123;

app.listen(PORT, () => {
  console.log(`[Driver Directory Backend] Server is running on port ${PORT}`);
});
