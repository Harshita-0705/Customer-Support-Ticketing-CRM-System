require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n✅  SupportCRM API running → http://localhost:${PORT}`);
  console.log(`   NODE_ENV : ${process.env.NODE_ENV || "development"}`);
  console.log(`   DB_PATH  : ${process.env.DB_PATH || "backend/data/crm.db"}\n`);
});
