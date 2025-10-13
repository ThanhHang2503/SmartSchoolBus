import bodyParser from "body-parser"
import express from "express"

// Import route files
// import busRoutes from "./bus/routes/busRoutes"
// import studentRoutes from "./student/routes/studentRoutes"
import routeRoutes from "./route/routes/routeRoutes"   

const app = express()
app.use(bodyParser.json())

// Đăng ký các module
// app.use("/buses", busRoutes)
// app.use("/students", studentRoutes)
app.use("/routes", routeRoutes) 

const PORT = 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
