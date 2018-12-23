const express  = require('express')
const path     = require('path')
const bodyParser = require('body-parser');
const colors = require('colors');
const pgapi = require('pgapi');

const app      = express()
app.use(bodyParser.json());

const router = express.Router();

router.get('/', (req, res) => {  
    res.send('Homepage!')
});
// Add more routes if you need

app.use('/', router);

const installpgAPI = async (app) => {
  try {
    await pgapi.initialize({
        DB_HOST : process.env.DB_HOST || 'localhost',
        DB_USER: process.env.DB_USER || 'postgres',
        DB_PASSWORD: process.env.DB_PASSWORD || 'Welcome1',
        DB_NAME: process.env.DB_NAME || 'postgres',
        DB_PORT: process.env.DB_PORT || 5432,
        PGAPI_SECRET_KEY: process.env.PGAPI_SECRET_KEY || 'pgapi-secret-key',
        DEMO_INSTALL: 'Y'
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