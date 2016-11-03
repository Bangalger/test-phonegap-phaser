var Game = function(game) {};

Game.prototype = {

  preload: function () {
    this.optionCount = 1;
    game.load.image('bg', 'assets/bg.png');
    game.load.image('button', 'assets/button.png');
    game.load.image('bird', 'assets/bird.png');
    game.load.image('succsess', 'assets/great.png');
    game.load.image('life', 'assets/life.png');
    game.load.spritesheet('bird-sprite', 'assets/bird-sprite-2.png', 94, 66);
    game.load.audio('sfx', 'assets/bgm/barrasonido.mp3');
  },

  create: function () {

    game.add.sprite(0, 0, 'bg');
    var style = { font: "25px Arial", fill: "#ffffff", align: "center" };
    text = game.add.text(300, 15, "0", style);
    style = { font: "25px Arial", fill: "#000"};
    succsess= game.add.sprite(game.world.centerX, game.world.centerY, 'succsess');
    succsess.anchor.set(0.5);
    succsess.scale.setTo(0);
    fx = game.add.audio('sfx');
    fx.allowMultiple = true;

    fx.addMarker('do', 0,1.0);
    fx.addMarker('re', 1,1.0);
    fx.addMarker('mi', 2,1.0);
    fx.addMarker('fa', 3,1.0);
    fx.addMarker('sol', 4,1.0);
    fx.addMarker('la', 5,1.0);
    fx.addMarker('si', 6,1.0);

      //PAUSA
    pause_label = game.add.text(100, 15, 'PAUSE', { font: '25px Arial', fill: '#fff'});
    pause_label.inputEnabled = true;
    pause_label.events.onInputDown.add(function () {
    //game.sound.setDecodeCallback(sonidoPausa);
    game.paused = true;
    sonidoPausa.play();
    });

    game.input.onDown.add(unpause, self);

    function unpause(event){
      if(game.paused){
          game.paused = false;
          //sonidoPausa.mute = true;
        } 
    };


    generateButtons();
    createBird();
    generateLives(7);

  },

  update: function(){
  check();
  lifeChecker();
  text.setText(score);
  //console.log('MouseX' + game.input.mousePointer.x)
  //console.log('MouseY' + game.input.mousePointer.y)

}

};

var notes = [['do',123],['re',100],['mi', 80], ['fa',57],['sol',41], ['la', 164], ['si', 138]];
var bird;
var button;
var actualButton = "Null";
var timer;
var animationTimer;
var loopCount = 0;
var player;
var great;
var style
var life;
var win= false;
var loose = false;
var birdLivesGroup;
var birdLife;
var text;
var score = 0;
var fx;


  function generateButtons () {
      var button; // Creo variable para que cada botón sea distinto
      var j=0;  
      for (var i = 0; i < 7; i++) {
        if(i<4){
          // Posiciono la primer fila.
          button = this.game.add.button(180 + 280*i, 330, 'button', this.clickHandler, this, 2, 1, 0);
          game.add.text(205 + 280*i, 410, notes[i][0], style);
        }
        else{
          // Posiciono la segunda fila.
          button = this.game.add.button(320 +  280*j, 520, 'button', this.clickHandler, this, 2, 1, 0);
          game.add.text(350 +  280*j, 610, notes[i][0], style);
          j++;
        }    
        button.name = notes[i][0];
      }
  }


  function generateLives(lives){
  birdLivesGroup= game.add.group();
  life = new Life(lives);

  for(i=0; i<lives;i++){
    //this.game.add.sprite(950+34*i,8,'life');
    birdLife = birdLivesGroup.create(950+34*i,8,'life');
    birdLife.name=i;
  }

  console.log(birdLivesGroup.length);

  //birdLivesGroup.children[1].kill();
}

function clickHandler(button) {
  actualButton = button.name; //Asigna el nombre del botón clickeado a actualButton.
}

/* BIRD CLASS */

// Creo un objeto con los parámetros que tiene que recibir en el constructor. 
var Bird = function(x,y,name){
  this.nombre = name;         // Seteo las variables recibidas
  //console.log(this.nombre)
  this.x= x;
  this.y=y;
  this.bird = game.add.sprite(x, y, 'bird-sprite');
  this.bird.scale.setTo(0);
  game.add.tween(this.bird.scale).to( { x: 1, y: 1 }, 100, Phaser.Easing.Linear.None, true);
  this.bird.animations.add('fly', [0, 1, 2], 12, true);
  this.bird.animations.add('burn', [4, 5, 6, 7], 10, true);
  this.bird.animations.add('normal', [3], 10, true);
  this.bird.animations.play('fly');
  this.bird.anchor.set(0.5);
        //  Create Timer
    this.timer = game.time.create(false);
    //  Set a TimerEvent to occur after 2 seconds
  this.timer.loop(2000, updateCounter, this);
  this.timer.start();

  //this.flying = game.add.audio('flying');
  //this.voltage = game.add.audio('voltage');
  
}; 

// Voy a cargar mi objeto con propiedades y métodos
Bird.prototype = {
  getName:function(){       // Getter del nombre
    return this.nombre;
  },
  stopTimer:function(){
    this.timer.destroy();
  },
  destroy:function(){
    this.timer.destroy();
    this.bird.destroy();
  },
  fly:function(){
    this.bird.animations.play('left');
  },
  burn:function(){
    this.bird.animations.play('burn');
  }

}

/* INSTRUCTIONS */

function updateCounter() {
    bird.destroy();
    loose=true;
    createBird();
}

function check(){
  if(bird.getName() == actualButton){
    win=true;
    actualButton="NUll";
    console.log("Succsess");
    bird.stopTimer();
    bird.burn();
    playSound(bird.getName());
    // Le paso a la función playSound el nombre del pájaro que es o do o re o mi o fa...
    //playSound(bird.getName());

    game.add.tween(succsess.scale).to( { x: 1, y: 1 }, 200, Phaser.Easing.Linear.None, true).onComplete.add(vanish, this);
    game.time.events.add(Phaser.Timer.SECOND*1, animate, this);
  }
}

function lifeChecker(){
  if(win){
    //life.looseLife(1);
    console.log("Gain a Life :)");
    score+=10;
    win=false;

  }
  if(loose){

    if(birdLivesGroup.length>1){
      console.log("Loose a Life! :{ ");
      birdLivesGroup.children.pop();
      loose=false;
    }else{
      birdLivesGroup.children.pop();
      console.log("Game Over");
      gameOver();
    }
    //life.gainLife(1);
    //succsess=false;

  }
}

//Recibo el nombre y hago algo con eso
function playSound(sound){
  fx.play(sound);
}

//______
function gameOver(){
  this.game.state.start("GameOver");
}
function createBird(){
  var random = Math.floor((Math.random() * 7)); // Random de 0 a 6 
  console.log(notes[random][1]);
  console.log(notes[random][0]);
  bird = new Bird(600,notes[random][1],notes[random][0]);
}

function animate(){
  console.log("animating");
  bird.destroy();
  createBird();
}

function vanish(){
  game.add.tween(succsess.scale).to( { x: 0, y: 0 }, 300, Phaser.Easing.Linear.None, true);
}

var Life = function(life){
  this.life = life;
}

Life.prototype = {
  getLife: function(){
    return this.life;
  },
  gainLife: function(gainLife){
    this.life += gainLife;
  },
  looseLife: function(loseLife){
    this.life -=loseLife;
  }
}


