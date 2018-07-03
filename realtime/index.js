import dotEnv from 'dotenv'
import moment from 'moment'
import cache from 'js-cache'

const server = require('http').createServer()
const io = require('socket.io')(server)
const serverCache = new cache();

dotEnv.load()

io.on('connection', function(socket){
    socket.on('socketLogin', function(key){
        let validation = serverCache.get(key);
        if (validation){
            console.log(validation)
        } else {
            socket.emit('forceDisconnect');
        }
    });
    socket.on('event', function(data){});
    /*
    socket.on('disconnect', function(){
        console.log('session finished')
    });
    */

    serverCache.on('del', function(key){ // al finalizar por ttl
        socket.emit('checkSession');
    });

    
    socket.on('broadcast', function(obj) {
        io.sockets.emit(obj.event, obj.data);
    })
    
    
});
server.listen(process.env.SOCKET_PORT);


const setCache = (token, id) => {
    serverCache.set(token, id, moment.duration(1, 'hours').asMilliseconds())
}

const socketRunning = () => {
    console.log(`Socket Running on port ${process.env.SOCKET_PORT}`)
}
/*
serverCache.on('del', function(key){
    console.log('deleted '+key)
});
*/
export { socketRunning, setCache }