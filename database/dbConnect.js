const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/Annas',
mongoose.connect('mongodb+srv://annas:annas123@cluster0.ey2dmu0.mongodb.net/gconn',
 {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});