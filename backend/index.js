const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const makeid = require('./utils/random').makeid
const phantom = require('./utils/phantom')
var fetch = require('node-fetch')
const app = express()
app.use(cors())
const expressWs = require('express-ws')(app);
var connects = { "starter": [] }
const port = process.env.PORT || 3000
const game_servers = {}
const game_sessions = {}
let roomn = "starter";

const mapSpecial = {
    0: "Bomb",
    1: "Health",
    2: "Smoke"
}

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/create-test-tournaments', async (req, res) => {
    try {
        const name = "My Tournament";
        const startTime = Math.floor(Date.now() / 1000) + 60;
        const length = 300; // Duration of 1 hour
        const gameType = "Fantasy Jungle";
        const depositAmount = 10
        await phantom.createTournament({ name, startTime, length, gameType, depositAmount })
        let tournaments = await phantom.getTournaments()
        res.json({ tournaments })
    } catch (e) {
        console.error('/create-test-tournaments:', e)
        res.send({})
    }
})

app.get('/tournaments', async (req, res) => {
    try {
        let tournaments = await phantom.getTournaments()
        res.json({ tournaments })
    } catch (e) {
        console.error(e)
        res.json({ tournaments: [] })
    }
})



app.ws('/join', function (ws, req) {
    ws.on('message', async function (msg) {
        try {
            players = await getPlayers();
            msg = JSON.parse(msg)
            if (msg['type'] == 'join') {
                client = {
                    "ws": ws,
                    "nick": msg["nick"],
                    "address": msg["address"],

                }
                ws.send(JSON.stringify({
                    "type": "update",
                    "players": players
                }))
                if (connects[msg["room"]]) {
                    connects[msg["room"]].push(ws)


                }
                else {
                    connects[msg["room"]] = [ws]

                }
            }

            if (msg["type"] == "msg") {

                connects[msg["room"]].forEach(socket => {
                   
                    socket.send(JSON.stringify({
                        type: "msg",
                        nick: msg["nick"],
                        address: msg["address"],
                        msg: msg["msg"]
                    }))
                });
            }


            if (msg["type"] == "special") {

                for (let s of Object.keys(game_servers)) {
                    game_servers[s].send(JSON.stringify({ type: 'DROP', dropId: msg["dropid"], player: msg["player"] }))
                }
                connects[msg["room"]].forEach(socket => {
                    
                    socket.send(JSON.stringify({
                        type: "msg",
                        nick: msg["nick"],
                        address: msg["address"],
                        msg: msg['nick'] + " Dropped a " + mapSpecial[msg["dropid"]] + " on " + msg["player"]
                    }))
                });

            }
        } catch (e) {
            console.log(e)
        }

    });



});



app.post('/finalise/:gameId', async (req, res) => {
    try {
        const gameId = req.params.gameId
        await phantom.finalsieGameId(gameId, game_sessions[gameId].players)
    } catch (e) {
        console.error('/finalise/:gameId:', e)
    } finally {
        res.json({ 'message': 'ok' })
    }
})

app.get('/state/:gameId', (req, res) => {
    try{
        const gameId = req.params.gameId
        let players = {}
        let orig_players = game_sessions[gameId].players
        for(let x of Object.keys(game_sessions[gameId].players)){
            if(players.hasOwnProperty(orig_players[x].address)){
                players[orig_players[x].address].score += orig_players[x].score
            }else{
                let p = orig_players[x]
                p.id = x
                delete p["isOnline"]
                players[orig_players[x].address] = p
            }
        }
        let out = {}
        for(let x of Object.keys(players)){
            out[players[x].id] = players[x]
        }
        let sorted_keys = Object.keys(out).sort((a, b) => {
            if(out[a].score>out[b].score){
                return 1
            }else if(out[a].score==out[b].score){
                return 0 
            }else{
                return -1
            }
        })
        let final_out = {}
        for(let x of sorted_keys){
            final_out[x] = out[x]
        }
        res.json({ ...final_out })
    }catch(e){
        console.error('/game/state', e)
        res.json({ players: {}})
    }
})

app.get('/state_raw/:gameId', (req, res) => {
    const gameId = req.params.gameId
    res.json(game_sessions[gameId] || {})
})


app.post('/game-server/drop', async (req, res) => {
    try {
        let dropType = parseInt(req.body.dropType)
        let player = req.body.player
        let requester = req.body.requester
        let pnick = req.body.pnick
        let nick = req.body.nick
        let amount = (100 * (10**18)).toString()
        if (dropType == 1) {
            amount = (90 * (10**18)).toString()
        } else if (dropType == 2) {
            amount = (95 * (10**18)).toString()
        }
        let isSucess = await phantom.spendToken(requester, amount)

        if (!isSucess) {
            res.json({ 'sucess': false, 'message': 'Insufficient balance to drop. TopUp and Try Again :)' })
            return;
        }
        console.log('Remote drop success!')
        for (let s of Object.keys(game_servers)) {
            game_servers[s].send(JSON.stringify({ type: 'DROP', dropId: dropType, player }))
        }
        connects[roomn].forEach(socket => {
            
            socket.send(JSON.stringify({
                type: "msg",
                nick: nick,
                address: requester,
                msg: nick + " Dropped a " + mapSpecial[parseInt(dropType)] + " on " + pnick
            }))
        });
        res.json({ 'sucess': true })
        return;
    } catch (e) {
        console.error('/game-server/drop:', e)
        res.json({ 'sucess': false, 'message': 'Internal server error!' })
    }
})





const getPlayers = async () => {
    try {
        let tournaments = await phantom.getTournaments()
        let gameId = tournaments[0].id
        let players = game_sessions[gameId].players
        let filtered_ids = Object.keys(players).filter(key => players[key].isOnline == true)
        let result = {}
        for (let id of filtered_ids) {
            result[players[id].address] = players[id]
        }
        return result
    } catch (e) {
        console.log(e)
        return {}
    }
}

app.post('/game-server/drop-test', (req, res) => {
    try {
        let dropType = parseInt(req.body.dropType)
        let player = req.body.player
        console.log('Droping bomb via drop-test!')
        if(Object.keys(game_servers).length == 0){
            console.log('no server available for drop-test')
        }
        for (let s of Object.keys(game_servers)) {
            game_servers[s].send(JSON.stringify({ type: 'DROP', dropId: dropType, player }))
            console.log({ type: 'DROP', dropId: dropType, player })
        }
        res.json({ 'message': 'ok' })
    } catch (e) {
        console.error('/game-server/drop-test:', e)
        res.json({ 'message': 'error' })
    }
})

app.ws('/game-server', (ws, req) => {
    try {
        
        let reqId = makeid(6)
        game_servers[reqId] = ws
        ws.on('message', async (msg) => {
            let data = JSON.parse(msg)
            console.log(data)
            if (data.type == 'UPDATE_PLAYERS') {
                let gameId = data.id
                if (!game_sessions.hasOwnProperty(gameId)) {
                    game_sessions[gameId] = { players: {} }
                }
                let players = game_sessions[gameId].players
                for (let player of Object.keys(data.players)) {
                    players[player] = data.players[player]
                }
                let updated_players = await getPlayers()
                connects[roomn].forEach(socket => {
                    
                    socket.send(JSON.stringify({
                        "type": "update",
                        "players": updated_players
                    }))
                });

            }
        });


        ws.on('close', () => {
            delete game_servers[reqId]
        })
    } catch (e) {
        console.error('/game-server:', e)
    }
});

const testTournament = async () => {
    try {
        console.log("Creating test tournamentts!")
        const name = "My Tournament";
        const startTime = Math.floor(Date.now() / 1000) + 60;
        const length = 1800; // Duration of 1 hour
        const gameType = "Fantasy Jungle";
        const depositAmount = 10
        await phantom.createTournament({ name, startTime, length, gameType, depositAmount })
        let tournaments = await phantom.getTournaments()
    } catch (e) {
        console.error('/create-test-tournaments:', e)
        
    }
}


app.listen(port, () => {
    testTournament();
    setInterval(async () => {
        testTournament();
    }, 30 * 60 * 1000)
    console.log(`Example app listening on port ${port}`)
})