var vows = require('vows'),
    assert = require('assert'),
    sys = require('sys'),

    Player = require('../lib/player').Player,
    Playground = require('../lib/playground').Playground,
    Unit = require('../lib/unit').Unit,
    Game = require('../lib/game').Game

// @todo test game.start()

vows.describe('Game').addBatch({
    'Setting game, two player, a 7x7 playground, 3 unit each with 1 hitpoints, toto starting': {
        topic: function() {
            var toto = new Player()
                .setName("toto")
            var pepette = new Player()
                .setName("pepette")
            var playground = new Playground()
                .setSize([7, 7]) 
            var game = new Game()
                .addPlayer([toto, pepette])
                .setPlayground(playground)
                .setTurnOwner(toto)

            for(var i = 1; i <= 3; i++) {
                playground.addUnit([
                                new Unit()
                                   .setName('Z_'+i+'_'+'toto')
                                   .setPlayer(toto)
                                   .setPosition([1, i])
                                   .setAbilities({move: 1, hitpoints:1}),
                                new Unit()
                                   .setName('Z_'+i+'_'+'pepette')
                                   .setPlayer(pepette)
                                   .setPosition([6, 6-i])
                                   .setAbilities({move: 1, hitpoints: 1})])
            }
            return {game: game.upkeep(toto).upkeep(pepette), toto: toto, pepette: pepette}
        },
        'then there is a game accordingly': {
            topic: function (topic) {
                return topic
            },
            'and legaly moving a toto unit' : function(topic) {
                assert.isTrue(topic.game.move(topic.toto, topic.game.playground.units[0], [2, 1]))
                assert.equal(topic.game.playground.units[0].state.move, 0)
                assert.deepEqual(topic.game.playground.units[0].position, [2, 1])
            }
        }
    }
}).export(module)

vows.describe('fighting').addBatch({
    'Setting game, two player, a 7x7 playground, 3 unit each with 1 hitpoints, toto starting': {
        topic: function() {
            var toto = new Player()
                .setName("toto")
            var pepette = new Player()
                .setName("pepette")
            var playground = new Playground()
                .setSize([7, 7])
            var game = new Game()
                .addPlayer([toto, pepette]).setPlayground(playground).setTurnOwner(toto)
            var armee = {toto:{}, pepette:{}}
            for(var i = 1; i <= 3; i++) {
                armee.toto['u'+i] = new Unit()
                                   .setName('Z_'+i+'_'+'toto').setPlayer(toto).setPosition([1, i]).setAbilities({move: 1, hitpoints:1}),
                armee.pepette['u'+i] = new Unit()
                                   .setName('Z_'+i+'_'+'pepette').setPlayer(pepette).setPosition([6, 6-i]).setAbilities({move: 1, hitpoints: 1})
                playground.addUnit([armee.toto['u'+i], armee.pepette['u'+i]])
            }
            return {game: game.upkeep(toto).upkeep(pepette), toto: toto, pepette: pepette, armee: armee}
        },
        'moving turn by turn to place armee face to face': {
            topic: function (topic) {
                assert.equal(topic.game.turn_owner, topic.toto)
                assert.isTrue(topic.game.move(topic.toto, topic.armee.toto.u1, [2, 2]))
                assert.isTrue(topic.game.move(topic.toto, topic.armee.toto.u2, [2, 3]))
                assert.isTrue(topic.game.move(topic.toto, topic.armee.toto.u3, [2, 4]))

                topic.game.nextTurn()
                assert.equal(topic.game.turn_owner, topic.pepette)
                assert.isTrue(topic.game.move(topic.pepette, topic.armee.pepette.u1, [5, 4]))
                assert.isTrue(topic.game.move(topic.pepette, topic.armee.pepette.u2, [5, 3]))
                assert.isTrue(topic.game.move(topic.pepette, topic.armee.pepette.u3, [5, 2]))
 
                topic.game.nextTurn()
                assert.equal(topic.game.turn_owner, topic.toto)
                assert.isTrue(topic.game.move(topic.toto, topic.armee.toto.u1, [3, 2]))
                assert.isTrue(topic.game.move(topic.toto, topic.armee.toto.u2, [3, 3]))
                assert.isTrue(topic.game.move(topic.toto, topic.armee.toto.u3, [3, 4]))

                topic.game.nextTurn()
                assert.equal(topic.game.turn_owner, topic.pepette)
                assert.isTrue(topic.game.move(topic.pepette, topic.armee.pepette.u1, [4, 4]))
                assert.isTrue(topic.game.move(topic.pepette, topic.armee.pepette.u2, [4, 3]))
                assert.isTrue(topic.game.move(topic.pepette, topic.armee.pepette.u3, [4, 2]))
                return topic
            },
            'armee are face to face': function(topic) {
                return topic
            },
            'and t1 fighting p3' : function(topic) {
                topic.armee.toto.u1.setAbilities({move: 1, hitpoints: 1, attack_powa: 1, defense_powa: 10, attack_count: 10, initiative: 0})
                topic.game.nextTurn(topic.toto)
                while(!topic.game.playground.graveyard.find(topic.armee.toto.u1) &&
                      !topic.game.playground.graveyard.find(topic.armee.pepette.u3) &&
                      topic.armee.toto.u1.canAttack(topic.armee.pepette.u3)) {
                    topic.armee.toto.u1.attack(topic.armee.pepette.u3)
                }
                assert.isTrue(topic.armee.toto.u1.state.hitpoints <= topic.armee.toto.u1.abilities.hitpoints)
                assert.isTrue(topic.armee.pepette.u3.state.hitpoints <= topic.armee.pepette.u3.abilities.hitpoints)
                sys.log(sys.inspect(topic.game.playground.graveyard, null, 4))
                assert.isTrue(topic.game.playground.graveyard.find(topic.armee.pepette.u3))
            }
        }
    }
}).export(module)
