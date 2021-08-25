"use strict";

require('dotenv').config();
const io=require('socket.io-client');
const HOST=process.env.HOST || 'http://localhost:3000';
const socket=io.connect(`${HOST}/caps`);

socket.emit('getAll');
socket.on('driverPickup', meassage=>{
    setTimeout(()=>{
        console.log('DRIVER: picked up meassage :',meassage.id);
        socket.emit('receive',meassage);
    },5000);
});
socket.on('driveredTransit',meassage=>{
    setTimeout(()=>{
        console.log(`DRIVER: delivered  up ${meassage.id}`);
        socket.emit('deleverd',meassage);
        
    },3000)
});