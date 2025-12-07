import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"
import router from "./src/router/router.js";
dotenv.config();

const __dirname = path.resolve()
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor está online na porta ${port} !`)
})