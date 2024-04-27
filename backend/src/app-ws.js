const { authSecret}  = require("./env_file");
// const jwt_decode = require("jwt-decode");
const WebSocket = require('ws');
 
function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}
 
function onMessage(ws, data, wss, isBinary) {
    const conexoes = wss.clients
    const message = isBinary ? data : data.toString()
    const objData = JSON.parse(data)

    conexoes.forEach(conexao => {
        /*console.log('pagina atual -->', conexao.page)
        console.log(`componente alvo --> ${message}`)*/
        if(conexao.page === JSON.parse(message).toComponent && conexao.readyState === WebSocket.OPEN) {
            // console.log(data)
            conexao.send(JSON.stringify(JSON.parse(message)/*.data*/))
            // return
        }
    })

    // console.log(wss.clients, 'onMessage')
    // console.log(`onMessage (from: ${ws.page}): ${data}`);
    // ws.send(`recebido! ${data}`);
}
 
function onConnection(ws, req) {
    const url = req.url.slice(8)
    const index = url.indexOf('=')
    const clientPage = url.slice(index + 1)
    
    ws.uid = url.slice(0, index-5)
    ws.page = clientPage
    ws.url = url
    
    /*console.log(ws.uid)
    console.log(ws.page)*/

    // console.log(ws.uid)
    ws.on('message', (data) => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    // console.log(`onConnection`, req.url.slice(8));

    // console.log("ws -->", ws._receiver)
}

function broadcast(jsonObject) {
    if (!this.clients) return;
    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.page === jsonObject.toComponent) {
            client.send(JSON.stringify(jsonObject.data));
        }
    });
}

function verifyClient(info, callback) {
    const chave = info.req;//alguma lógica aqui
    const url = chave.url.slice(8)
    const index = url.indexOf('=')
    const token = chave.url.slice(8, index-5)
    console.log(token)
 
    if (token != undefined) {
        // console.log(localStorage.usertoken)
        try {
            const data = jwt_decode("cafe")
        } catch (InvalidTokenError) {
            console.log("token invalido kk")
        }
        // console.log(jwt_decode(token))
        //valida a chave
        return callback(true);
    }
    return callback(true);
}

module.exports = (server) => {
    const wss = new WebSocket.Server({
        "port": server,
        verifyClient
    });
 
    wss.on('connection', /*onConnection*/(ws, req) => {
        const url = req.url.slice(8)
        const index = url.indexOf('=')
        const clientPage = url.slice(index + 1)
        
        ws.uid = url.slice(0, index-5)
        ws.page = clientPage
        ws.url = url
        
        /*console.log(ws.uid)
        console.log(ws.page)*/
    
        // console.log(ws.uid)
        ws.on('message', (data, isBinary) => onMessage(ws, data, wss, isBinary));
        ws.on('error', error => onError(ws, error));
        // console.log(`onConnection`, req.url.slice(8));
    
        // console.log("ws -->", ws._receiver)
        // console.log(wss.clients); // COMO ACESSAR OS DISPOSITIVOS CONECTADOS NA FUNÇÃO onConnection?
    });
    wss.broadcast = broadcast;
 
    console.log(`Web Socket Server online!`);
    return wss;
}
