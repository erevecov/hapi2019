import Cloudant from '@cloudant/cloudant'
import dotEnv from 'dotenv'

dotEnv.load()

const url = process.env.CLOUDANT_URL

const cloudant = new Cloudant({url, plugins: ['promises', {'retry':{ retryAttempts: 5, retryTimeout: 1000}}]})
export default cloudant
