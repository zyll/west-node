var http = require('http'),
    sys  = require('sys'),
    express = require('express'),
    Player = require('./lib/player').Player,
    Unit = require('./lib/unit').Unit,
    Game = require('./lib/game').Game,
    Playground = require('./lib/playground').Playground

var app = express.createServer(express.bodyDecoder())

app.get('/', function(req, res) {
    res.render("index.haml", {layout: false, locals: {games: Games.list, players: Players.list}})
})

// player
var Players = {
    list: {},
    find: function(name){
        return Players.list[name]}}

app.get('/player', function(req, res) {
    res.render("player_form.haml", {layout: false})
})

app.get('/player/:name', function(req, res) {
    var player = Players.find(req.param('name'))
    if(player) {
        res.render("player.haml", {layout: false, locals: {player: player}})
    } else {
        res.send(404)
    }
})

app.post('/player', function(req, res) {
    var player = new Player()
        .setName(req.param('name'))
    Players.list[req.param('name')] = player
    res.render("player.haml", {layout: false, locals: {player: player}})
})

app.get('/players', function(req, res) {
    res.render("players.haml", {layout: false, locals: {players: Players.list}})
})

// Game
var Games = {
    list: {},
    find: function(name){
        return Games.list[name]}}

app.get('/game', function(req, res) {
    res.render("game_form.haml", {layout: false})
})

app.get('/game/:name', function(req, res) {
    var game = Games.find(req.param('name'))
    if(game) {
        res.render("game.haml", {layout: false, locals: {game: game}})
    } else {
        res.send(404)
    }
})

app.post('/game', function(req, res) {
    sys.log(sys.inspect(req.body, null, 3))
    var p = new Playground()
        .setSize(req.body.playground.size)
    var game = new Game()
        .setName(req.body.name)
        .setPlayground(new Playground()
            .setSize(req.body.playground.size))
        .addPlayer(new Player()
            .setName(req.body.player[0]))
        .addPlayer(new Player()
            .setName(req.body.player[1]))
    Games.list[req.param('name')] = game
    res.render("game.haml", {layout: false, locals: {game: game}})
})

app.get('/games', function(req, res) {
    sys.log(sys.inspect(Games.list, null, 3))
    res.render("games.haml", {layout: false, locals: {games: Games.list}})
})

/**
 * Gruik fake on unit init for now.
 */
app.get('/play/game/:game_name/start', function(req, res) {
    var game = Games.find(req.param('game_name'))
    var p1 = game.players[0]
    var p2 = game.players[1]

    for(var i = 1; i <= 3; i++) {
        game.playground.addUnit(new Unit()
                           .setName('Z_'+i+'_'+'toto')
                           .setPlayer(p1)
                           .setPosition([1, i])
                           .setAbilities({move: 1, hitpoints:1}))
        game.playground.addUnit(new Unit()
                           .setName('Z_'+i+'_'+'pepette')
                           .setPlayer(p2)
                           .setPosition([6, 6-i])
                           .setAbilities({move: 1, hitpoints: 1}))
    }
    
    res.render("game.haml", {layout: false, locals: {game: game.upkeep(p1).upkeep(p2).start()}})
})


app.listen(6666)



