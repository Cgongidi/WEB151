var mainState = {
    preload: function() { 
	//game.load.image('bird', 'assets/bird.png'); 
	game.load.image('clouds', 'assets/clouds.png'); 
	game.load.spritesheet('bird','assets/partyparrot.png',307,220,10);
	game.load.spritesheet('pipe','assets/pipe.png',50,67,2);
	//game.load.image('pipe', 'assets/pipe.png');
	game.load.audio('jump', 'assets/jump2.wav'); 
	game.load.audio('theme', 'assets/stars.wav'); 
    },

    create: function() {  
	game.stage.backgroundColor = '#71c5cf';
	this.clouds = game.add.tileSprite(0, 0, 400, 196,'clouds');
	game.physics.startSystem(Phaser.Physics.ARCADE);
	//this.bird = game.add.sprite(100, 245, 'bird');
	this.bird = game.add.sprite(50,50,'bird');
	this.bird.animations.add('party');
	this.bird.animations.play('party', 15, true);
	this.bird.scale.setTo(.12,.12);
	game.physics.arcade.enable(this.bird);
	this.bird.body.gravity.y = 1000;
	var spaceKey = game.input.keyboard.addKey(
		Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);
	game.input.onTap.add(this.jump,this);
	this.pipes = game.add.group(); 
	this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 
	this.score = -1;
	this.labelScore = game.add.text(20, 20, "0", 
    { font: "30px Arial", fill: "#ffffff" }); 
	this.bird.anchor.setTo(-0.2, 0.5);
	this.jumpSound = game.add.audio('jump');
	this.themeSound = game.add.audio('theme');
	this.themeSound.play();
    },

    update: function() {
		this.clouds.tilePosition.x-=1;
		if (this.bird.y < 0 || this.bird.y > 490)
			this.gameOverScreen();
		game.physics.arcade.overlap(
		this.bird, this.pipes, this.hitPipe, null, this);
		if (this.bird.angle < 20)
		this.bird.angle += 1;
    },
	jump: function() {
		if (this.bird.alive == false)
    return;
    this.bird.body.velocity.y = -350;
	var animation = game.add.tween(this.bird);
	animation.to({angle: -20}, 100);
	animation.start();
	this.jumpSound.play();
},

	restartGame: function() {
		game.state.start('main');
		this.themeSound.pause();
},

    gameOverScreen: function() {
        this.gameOverText = "G A M E   O V E R";
        this.labelGameOver = game.add.text(500, 250, this.gameOverText,
            { font: "30px Arial", fill: "#ffffff" }); 

        this.timer = game.time.events.add(1000, this.restartGame, this);
    },

addOnePipe: function(x, y) {
    var pipe = game.add.sprite(x, y, 'pipe');
    this.pipes.add(pipe);

    game.physics.arcade.enable(pipe);

    pipe.body.velocity.x = -200; 
	
	pipe.animations.add('frog');
	pipe.animations.play('frog', 5, true);

    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
},
addRowOfPipes: function() {
    var hole = Math.floor(Math.random() * 5) + 1;
	this.score += 1;
	this.labelScore.text = this.score; 

    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1) 
            this.addOnePipe(400, i * 60 + 10);   
},
hitPipe: function() {
    if (this.bird.alive == false)
        return;

    this.bird.alive = false;

    game.time.events.remove(this.timer);

    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
}, 

};

var game = new Phaser.Game(400, 490);
game.state.add('main', mainState);
game.state.start('main');