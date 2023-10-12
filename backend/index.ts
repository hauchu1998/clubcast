import app from "./src/app.js";
import * as functions from "firebase-functions";

const PORT = 8080;

app.listen(PORT);
console.log(`Server started at http://localhost:${PORT}`);
