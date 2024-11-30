import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

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

//routes declaration
app.use("/api/v1/admins", adminRouter)
app.use("/api/v1/sliders", sliderRouter)
app.use("/api/v1/employees", employeeRouter)
app.use("/api/v1/galleries", galleryRouter)
app.use("/api/v1/stories", storiesRouter)
app.use("/api/v1/programs", programRouter)


export {app}