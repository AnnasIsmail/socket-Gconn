const express = require("express");
const app = express();
const http = require('http')
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT);

require('./database/dbConnect');
const users = require('./model/users');
const sellers = require('./model/sellers');

const io = require('socket.io')(server, {
    cors: {
      origin: 'https://gconn.netlify.app',
    }
})

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

    res.send("<h1>Hello Bg</h1?")
});
