const
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    expressValidator=require('express-validator'),
    cors=require('cors')
    require("./db/database.js")


const authRouter=require('./routes/authRouter')
const userRouter=require('./routes/userRouter')
const categoryRouter =require('./routes/categoryRouter')
const productRouter =require('./routes/productRouter')
const orderRouter=require("./routes/orderRouter")

app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

app.use(authRouter)
app.use(userRouter)
app.use(categoryRouter)
app.use(productRouter)
app.use(orderRouter)


//npm run dev
const port = process.env.PORT

app.listen(port, () => {
    console.log("server is running " + port)
})
