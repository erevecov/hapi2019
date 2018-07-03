import dotEnv from 'dotenv'
dotEnv.load()

const Home = {
    method: ['GET'],
    path: '/',
    options: {
        handler: (request, h) => {
            let credentials = request.auth.credentials;

            return h.view('home', { credentials: credentials, admin:'ok', socketPort:process.env.SOCKET_PORT})
        }
    }
};

export default Home