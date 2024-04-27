require('dotenv/config')
const app = require ('./app')
const appWs = require('./app-ws')

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log("Servidor rodando na porta " + port)
})

const wss = appWs("3090");

/*setInterval(() => {                   //BROADCAST DE DateTime PARA TIMER DOS TOPICOS DE QUESTAO
    let currentdate = new Date(); 
    currentdate = currentdate.toJSON();

    wss.broadcast({
        data: {
            currentdate: currentdate
        },
        toComponent: 'question', // Componente Destino
        action: 'broadcast',
    });
        
}, 1000)*/