const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || ['http://localhost:3000'].indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

module.exports= cors(corsOptions);