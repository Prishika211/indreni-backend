import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
console.log(process.env.CORS_ORIGIN);

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())


//routes import
import adminRouter from "./routes/admin.routes.js"
import sliderRouter from "./routes/slider.routes.js"
import employeeRouter from "./routes/employee.routes.js"
import galleryRouter from "./routes/gallery.routes.js"
import storiesRouter from "./routes/stories.routes.js"
import programRouter from "./routes/program.routes.js"
import popupRouter from "./routes/popup.routes.js"
import publicationRouter from "./routes/publication.routes.js"
import formatRouter from "./routes/format.routes.js"
import policyRouter from "./routes/policy.routes.js"

//routes declaration
app.use("/api/v1/admins", adminRouter)
app.use("/api/v1/sliders", sliderRouter)
app.use("/api/v1/employees", employeeRouter)
app.use("/api/v1/galleries", galleryRouter)
app.use("/api/v1/stories", storiesRouter)
app.use("/api/v1/programs", programRouter)
app.use("/api/v1/popups", popupRouter)
app.use("/api/v1/publications", publicationRouter)
app.use("/api/v1/formats", formatRouter)
app.use("/api/v1/policies", policyRouter)



export {app}