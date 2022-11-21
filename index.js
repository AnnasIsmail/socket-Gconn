const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
var bodyParser = require('body-parser')

require('./database/dbConnect');
const users = require('./model/users');
const sellers = require('./model/sellers');

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: 'https://gconn.netlify.app',
    }
})

server.listen(PORT);

let usersOnline = [];

io.on("connection", (socket)=>{

    socket.on('addUserOnline' , result =>{
        !usersOnline.some((dataUser)=> dataUser.idSocket === socket.id)&&
            usersOnline.push({
                idSocket: socket.id,
                idUser: result.id
        });
    });

    socket.on("getUsers", () => {
        io.emit("getUsers", usersOnline);
    });

    socket.on("read", (data) => {
        data.forEach((dataLoop) => {
            io.to(dataLoop.idSocket).emit("getMessage", "reload");                   
        })
      });

      socket.on("goToDirectMessage", (data) => {
        io.to(socket.id).emit("getDirectMessage", data);                   
      });

      socket.on("sendMessage", (data) => {
        data.forEach((dataLoop) => {
            io.to(dataLoop.idSocket).emit("getMessage", "reload");                   
        })
      });

    socket.on("disconnect", async() => {

        const currentdate = new Date(); 
        const datetime = "" + (currentdate.getMonth()+1) + "/"
                + currentdate.getDate()  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

        let userDC = usersOnline.find((dataUser)=> dataUser.idSocket === socket.id);
        usersOnline = usersOnline.filter((dataUser)=> dataUser.idSocket !== socket.id);

        if(userDC !== undefined){
           await users.updateOne({_id: userDC.idUser}, {
                lastOnline: datetime
            });
            await sellers.updateOne({idUser: userDC.idUser}, {
                lastOnline: datetime
            });
        }
    });
    
});

app.get('/', async (req , res) => {

    res.status(200).json({
        status: 200,
        data: "This Is Socket"
    });
});
