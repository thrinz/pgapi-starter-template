const express  = require('express')
const path     = require('path')
const bodyParser = require('body-parser');
const dotenv   = require('dotenv')
const colors = require('colors');
const pgapi = require('@thrinz/pgapi');


// Load env variables from .env file
dotenv.config({
    path: path.resolve(__dirname, './config.env')
  })   

  
const app      = express()
app.use(bodyParser.json());

const router = express.Router();

router.get('/', (req, res) => {  
    res.send('Homepage!')
});
// Add more routes if you need

app.use('/', router);

router.use(async function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization');

  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const installpgAPI = async (app) => {
  try {
    await pgapi.initialize({
        DB_HOST : process.env.DB_HOST || 'localhost',
        DB_USER: process.env.DB_USER || 'postgres',
        DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
        DB_NAME: process.env.DB_NAME || 'postgres',
        DB_PORT: process.env.DB_PORT || 5432,
        PGAPI_SECRET_KEY: process.env.PGAPI_SECRET_KEY || 'pgapi-secret-key',
        DEMO_INSTALL: process.env.DEMO_INSTALL || 'Y'
       });
       
    pgapi.apiRouter(router);   
    app.use('/admin',express.static(path.join(pgapi.clientSourcePath(),'/admin'))) 
    app.use('/admin/api', pgapi.adminRouter()); 

  } catch(e) {
     console.log(colors.red(e));
  } 

}

const port = process.env.PORT || 5001

app.listen(port, '0.0.0.0', async () => {
    await installpgAPI(app);
    console.log(`Server is listening to 0.0.0.0: ${port}`.green);
})