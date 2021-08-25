"use strict";

require('dotenv').config();
const uuid = require('uuid').v4;
const port=process.env.PORT || 3000;
const io=require('socket.io')(port);
const caps=io.of('/caps')

const msgQ = {chores : {}}
let timeQ = new Date()

io.on('connection',socket=>{
    console.log('CONNECTED  ',socket.id);
});
caps.on('connection',socket=>{
    console.log('CONNECTED  ',socket.id);
    socket.on('pickup',payload=>{
        console.log("Adding a new task")
        const id = uuid();
        console.log("id => ", id)
        msgQ.chores[id] = payload;
        socket.emit('added', payload); 
        caps.emit('driverPickup',{id: id, payload: msgQ.chores[id]});
        console.log("after add msgQ => ", msgQ)
    });
    socket.on('getAll', ()=> {
        console.log("getAll driver wants to get its msgs ")
        Object.keys(msgQ.chores).forEach(id=> {
            socket.emit('driverPickup', {id: id, payload: msgQ.chores[id] })
        });
    });
    socket.on('receive',msg=>{
        console.log("Receive on queue will remove it ...")
        delete msgQ.chores[msg.id];
        console.log("after delete meassage ", msgQ)
        caps.emit('driveredTransit',msg);
    });
    socket.on('deleverd',msg=>{
        console.log('event:',{
            event:'deleverd',
            timeQ:timeQ,
            msg:msg
        });
        caps.emit('deleverd',msg);
        caps.emit('vendorDileverd',msg);
    });
})

module.exports=caps