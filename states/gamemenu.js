var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 300,
    startX: game.world.centerX-100
  },

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 300, "Voltage Animals", {
      font: 'bold 60pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },

  create: function () {

    if (music.name !== "ambient" && playMusic) {
      music.stop();
      music = game.add.audio('ambient');
      music.loop = true;
      music.play();
    }
    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'menu-bg');
    game.add.existing(this.titleText);

    this.addMenuOption('Comenzar', function () {
      game.state.start("Game");
    });
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
