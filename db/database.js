const mongoose = require('mongoose')

mongoose.connect(process.env.DB_CONNECTION_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
)
.then(() => console.log("Database connected !!"))
.catch((err) => console.log("Error :" + err))

