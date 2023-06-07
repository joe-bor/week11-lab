require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.port || 3000;

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once("open", () => {
  console.log("We are connected to mongodb");
});

//END OF ROUTES
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
