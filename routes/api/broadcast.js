//import {testing} from '../../realtime'
const Broadcast = {
    method: ['GET'],
    path: '/api/broadcast',
    options: {
        handler: (request, h) => {
            //testing.sockets.emit('test', 'testing')
            /*
            io.on('connection', function(socket){
                io.sockets.emit('test', 'testing')
            });
            */
            return true
        }
    }
};

export default Broadcast