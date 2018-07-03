import md5 from 'md5'
import cloudant from '../../config/db'
import configEnv from '../../config/env_status'
import { setCache } from '../../realtime'
import randomToken from 'random-token'

let db = cloudant.db.use(configEnv.db)

let uuid = 1 // Use seq instead of proper unique identifiers for demo only

const findUser = async (email, password) => {
  return new Promise((resolve) => {
    db.find({
        selector: {
          _id: email,
          password: password,
          status: 'enabled',
          type: 'user'
        }
    }).then(res => {
        if (res.docs[0]) {
            let data = res.docs[0]
            if (data.password === password) {
                resolve(data)
            } else {
                resolve(null)
            }
        } else {
            resolve(null)
        }
    }).catch(function(err) {
        console.log('something went wrong', err)
    })
  })
}

const createSocketSession = async (account) => {
  const token = await randomToken(64)
  await setCache(token, account._id)
  return token
}

const Login = {
    method: ['GET', 'POST'],
    path: '/login',
    options: {
      handler: async (request, h) => {
        if (request.auth.isAuthenticated) return h.redirect('/')
      
        let account = null
      
        if (request.method === 'post') {
          if (!request.payload.email || !request.payload.password) {
            return h.view('login', {message: 'Usuario o contraseña incorrecto.'}, { layout: false })
          } else {
            account = await findUser(request.payload.email, md5(request.payload.password))
            if (!account) {
              return h.view('login', {message: 'Usuario o contraseña incorrecto.'}, { layout: false })
            } else {
              const sid = String(++uuid)
              account.token = await createSocketSession(account)
              account.email = account._id
              delete account._id
              delete account.password
              delete account._rev
              await request.server.app.cache.set(sid, { account }, 0)
              request.cookieAuth.set({ sid })
              return h.redirect('/')
            }
          }
        }
      
        if (request.method === 'get') return h.view('login', {title: 'test'}, { layout: false })
      },
      auth: { mode: 'try' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false } }
    }
}


export default Login