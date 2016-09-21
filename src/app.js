'use strict';

//引入 Phaser
require('pixi.js');
require('p2');
require('phaser');

const phaser = require('./assets/phaser.png');

window.onload = function () {
    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.
    const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create});

    function preload() {
        game.load.image('logo', phaser);
    }

    function create() {
        const logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }
};