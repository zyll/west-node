var vows = require('vows'),
    assert = require('assert'),
    sys = require('sys'),

    Playground = require('../lib/playground').Playground
    Unit = require('../lib/unit').Unit

// @todo test playground.at([1, 4])

vows.describe('Playground').addBatch({
    'Given an empty 6x6playground': {
        topic: function() {
            var p = new Playground()
                .setSize([10,10])
            return p
        },
        '[0, -5] is out bounds': function(topic) {
            assert.isFalse(topic.inBound([0, -5]))
        },
        '[0, 0] is inbound' : function(topic) {
            assert.isTrue(topic.inBound([0, 0]))
        },
        '[3, 3] is inbound' : function(topic) {
            assert.isTrue(topic.inBound([3, 3]))
        },
        '[9, 9] is inbound' : function(topic) {
            assert.isTrue(topic.inBound([9, 9]))
        },
        '[10, 10] is outbound' : function(topic) {
            assert.isFalse(topic.inBound([10, 10]))
        },
        'each position are empty' : function(topic) {
            for( var i = 0; i <= 9; i++)
                for( var j = 0; j <= 9; j++) {
                    assert.isTrue(topic.emptyPosition([i, j]))
                }
        }
    }
}).addBatch({
    'Given a 12x12 playground with units': {
        topic: function() {
            var u1 = new Unit()
                .setName('u1')
                .setPosition([5, 5])
                .setAbilities({move: 1})
            var u2 = new Unit()
                .setName('u2')
                .setPosition([5, 6])
                .setAbilities({move: 1})
            var u3 = new Unit()
                .setName('u3')
                .setPosition([2, 2])
                .setAbilities({move: 5})
            var p = new Playground()
                .setSize([10, 10])
                .addUnit([u1, u2, u3])
            return {playground: p, u1: u1, u2: u2, u3: u3}
        },
        'then unit u3 should be able to move to a near empty position': function(topic) {
            assert.isFalse(topic.playground.emptyPosition([2,2]))
            assert.isTrue(topic.playground.emptyPosition([1, 1]))
            assert.isTrue(topic.playground.canMove(topic.u3, [1, 1]))
            assert.isTrue(topic.playground.move(topic.u3, [1,1]))
        },
        'then unit u1 and d u2 should be able to move to [4,6] then it\'s u1 take [4,6]' : {
            topic: function(topic) {
                assert.isFalse(topic.playground.emptyPosition([5,5]))
                assert.isFalse(topic.playground.emptyPosition([5,6]))

                assert.isFalse(topic.playground.canMove(topic.u2, [5,5]))
                assert.isFalse(topic.playground.canMove(topic.u1, [5,6]))
                
                assert.isTrue(topic.playground.canMove(topic.u2, [4,6]))
                assert.isTrue(topic.playground.canMove(topic.u1, [4,6]))
                
                assert.isTrue(topic.playground.move(topic.u1, [4,6]))
                return topic
            },
            'then u2 should not be able to move to [4,6] and then u2 attempt to move to [4,6] should fail': function(topic) {
                assert.isFalse(topic.playground.emptyPosition([4,6]))
                assert.isFalse(topic.playground.canMove(topic.u2, [4,6]))
                assert.isFalse(topic.playground.move(topic.u2, [4,6]))
            }
        }
    }
}).export(module)
