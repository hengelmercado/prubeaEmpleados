const express = require('express');
const cors = require('cors');
const { rutas } = require('../dictionary/dictionary')
const {sequelize} = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Conectar a base de datos
        this.connectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();
    
    }

    async connectarDB() {
        sequelize;
        try {
            await sequelize.sync();
            console.log('Connection has been established successfully.');
            } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    middlewares() {
        // CORS
        this.app.use(cors({ origin: '*' }));

        // Lectuta y escritura de el body
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(rutas.empleado, require('../routes/empleados'));
        this.app.use(rutas.departamento, require('../routes/departamento'));
    }
    
    listen(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;