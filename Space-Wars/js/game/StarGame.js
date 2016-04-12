/*
Main file for Star Game
Requires: ScreenWidget.js
          Star.js
          SpaceShip.js
 */
function StarGame(canvas, shipImageSrc, enemyShipImageSrc, bossShipImageSrc)
{
    var self = this;
    
    // Boss Mode attributes
    var bossHealth = 15;
    var bossMode = 0;       // Keeps track of boss mode
    var tick = 50;
    var hitCount = 0;
    var playerHit = false;
    var respawning = 0;
    var loading = false;
    var victory = true;
    
    self.canvas = canvas;
    self.context = canvas.getContext("2d");
    self.game_over = false; 
    
    self.shipImage = new Image();
    self.enemyShipImage = new Image(); 
    self.bossShipImage = new Image();
    
    self.shipImage.src = shipImageSrc;
    self.enemyShipImage.src = enemyShipImageSrc;
    self.bossShipImage.src = bossShipImageSrc;
        
    // Arrays of items (pShips, eShips, bullets, stars)
    self.stars = Array();
    self.ship = Array();
    self.boss = Array();
    self.enemyShips = Array(); 
    
    var score = 0;
    var iterator = 0;
    
    //hide mouse
    self.canvas.style.cursor = "none";
    
    //set up player piece
    self.playerShip = new SpaceShip(self.context, self.shipImage, 5, 66, 64, 64);
    
    //make a boss ship
    // TODO: make boss mode dynamic to the game 
    self.bossShip = new BossShip(self.context, self.bossShipImage, 0, 50, 150, 130);
    
    /* TODO: Create array of base enemy ships 
    for (var i = 0; i < 10; i++)
    {
        // Front row ship
        if (i < 5)
        {
            var enemyShip = new EnemyShip(self.context, self.enemyShipImage, 2, 90, 100, 80, i, 0); 
        }
        else
        {
            var enemyShip = new EnemyShip(self.context, self.enemyShipImage, 2, 90, 100, 80, i, 1);
        }
        
        self.enemyShips.push(enemyShip);
    }
    */
    
    //set up globals
    maxX = canvas.clientWidth;
    maxY = canvas.clientHeight;

    self.begin = function()
    {
        self.init();
        document.getElementById("game-over-display").style.display = "none";
        
        self.renderLoop();
    };

    self.readyDisplay = function()
    {
    }
    
    //resets game state
    self.init = function()
    {
        //set up starfield
        //generate 100 small stars
        for (var i = 0; i < 50; i++)
        {
            //make it so most stars are in the far background
            var howFast = Math.random() * 100;
            var speed = 5;
            if (howFast > 60)
            {
                speed = 2;
            }
            else if (howFast > 20)
            {
                speed = 1;
            }
            
            //var speed = (Math.floor(Math.random() * 3) + 1) * 1;
            var someStar = Star.makeStar(self.context, 2, speed);
            someStar.color = "lightyellow";
            someStar.height = 10;
            self.stars.push(someStar);
        }

        //and 200 tiny stars
        for (var i = 0; i < 200; i++) {
            var speed = (Math.floor(Math.random() * 3) + 1) * 1;
            var someStar = Star.makeStar(self.context, 1, speed);
            
            // Set star attributes
            someStar.height = 4;
            someStar.color = "lightblue";
            self.stars.push(someStar);
        }

        //placing ship last puts it on top of the stars
        self.ship.push(self.playerShip);
        self.boss.push(self.bossShip);
        
        //begin game
        window.requestAnimationFrame(self.renderLoop);
    };

    self.renderLoop = function()
    {
        if (tick > 0)
        {
            //clear canvas
            self.context.clearRect(0, 0, maxX, maxY);

            // Begin Iterator and Score
            iterator++;
            if (iterator % 10 == 0)
                score++;

            // Don't show Boss Mode
            //document.getElementById("boss-mode").style.display = "none";

            /* HOW TO DECREMENT LIVES!! 
            if (iterator == 30)
                {
                    document.getElementById("lives-pic").style.width = "40%";
                }
            if (iterator % 200 == 0)
                {
                    document.getElementById("lives-pic").style.width = "20%";
                }
            if (iterator % 400 == 0)
                {
                    document.getElementById("lives-pic").style.width = "0%";
                }
             //*/

            //paint black
            self.context.fillStyle = "rgb(0, 0, 0)";
            self.context.fillRect(0, 0, maxX, maxY);

            //render widgets
            for(var i = 0; i < self.stars.length; i++)
            {
                self.stars[i].render();
                self.stars[i].update();
            }

            //render bullets
            for(var i = 0; i < self.playerShip.bullets.length; i++)
            {
                self.playerShip.bullets[i].render();
                self.playerShip.bullets[i].update();

                // Splice the bullet out if out of bounds
                if (self.playerShip.bullets[i].checkBoundary() == true)
                {
                    self.playerShip.bullets.splice(i, 1);
                }

                // Did the bullet hit the enemy ship?
                else if (self.playerShip.bullets[i].checkHit(self.bossShip.x, self.bossShip.y, 150, 130) == true)
                {

                    // Decrement health
                    if (self.playerShip.bullets[i].type == 0)       // Regular bullet
                    {
                        score += 250;                               // +250 pts per regular hit
                        self.boss[0].health -= .25;                    
                    }
                    else                                            // Bomb bullet
                    {
                        score += 1000;                              // +1000 pts per bomb hit
                        self.boss[0].health -= 1.5;
                    }

                    // Splice off the bullet, then update the health bar 
                    self.playerShip.bullets.splice(i, 1);
                    document.getElementById("boss-life-bar").style.width = self.boss[0].health + "%";

                    // Is the boss dead?
                    if (self.boss[0].health <= 0) 
                    {
                        score += 10000;                             // +10,000 pts for boss kill
                        
                        self.boss[0].dead = "true";
                        document.getElementById("boss-life").style.display = "none";

                        document.getElementById("boss-life-bar").style.display = "none";
                        document.getElementById("boss-life-bar").style.border = "transparent";

                        self.boss[0].explode();
                        
                        self.game_over = true;
                        self.displayScore();
                    }
                    else
                    {
                        // Make the ship blink
                        self.boss[0].blink();
                    }
                }
            }
            
            //render boss bullets
            for (var i = 0; i < self.bossShip.bullets.length; i++)
            {
                self.bossShip.bullets[i].render();
                self.bossShip.bullets[i].update(self.bossShip.xDir);
                
                // DEBUG MODE
                //document.getElementById("debug").innerHTML = "Bullets: " + self.bossShip.bullets.length;
                
                if (self.bossShip.bullets[i].checkBoundary() == true)
                {
                    //document.getElementById("debug").innerHTML = "Bullets: " + self.bossShip.bullets.length;
                    self.bossShip.bullets.splice(i, 1);
                }
                
                // If not out of bounds, check hit
                else if (self.bossShip.bullets[i].checkHit(self.playerShip.x - 20, self.playerShip.y, self.playerShip.width + 10,             self.playerShip.height) == true)
                {                    
                    // Take damage and remove bullet
                    self.bossShip.bullets.splice(i, 1);
                    setTimeout(self.playerHit(0), 500);
                }   
            }
            
            //render boss beams
            //document.getElementById("debug").innerHTML = "beams length: " + self.bossShip.beams.length;
            for (var i = 0; i < self.bossShip.beams.length; i++)
            {
                self.bossShip.beams[i].render();
                self.bossShip.beams[i].update();
                
                if (self.bossShip.beams[i].checkBoundary() == true)
                {
                    self.bossShip.beams.splice(i, 1);
                }
                
                // If not out of bounds, check hit
                else if (self.bossShip.beams[i].checkHit(self.playerShip.x - 20, self.playerShip.y, self.playerShip.width + 10,             self.playerShip.height) == true)
                {
                    // Take damage and remove beam
                    setTimeout(self.playerHit(1), 500);
                }
            }

            // Decrement our timer
            if (self.playerShip.timer != 0)
                self.playerShip.timer--;

            //render player ship
            self.ship[0].render();
            self.ship[0].update();
            
            //render boss ship
            self.boss[0].render();
            self.boss[0].update(self.playerShip.x);
            
            self.displayScore();
            
            if (self.game_over == true)
            {
                tick--;
                if (tick == 0)
                {
                    if (victory == true)
                        self.gameover(0);
                    else
                        self.gameover(1);
                }
            }
            
            window.requestAnimationFrame(self.renderLoop);
        }
    };
    
    self.playerHit = function(bulletType)
    {
        // Player Hit: 
        //      *  0 : Normal Bullet, Dmg : 6.5 Health
        //      *  1 : Beam Bullet,   Dmg : .5 Health (Builds up if you stay in it)
        //document.getElementById("debug").innerHTML = "Player Health: " + self.playerShip.health;
        if (bulletType == 0)                
        {
            self.playerShip.health -= 6.5;
            decrementPlayerLives();
        }
        else                                    
        {
            self.playerShip.health -= .5;        
            decrementPlayerLives();
        }
        
        // Now, check health
        if (self.playerShip.health <= 0)        // Dead? Explode!
        {
            self.playerShip.explode();
            self.playerShip.health = 0;
            self.game_over = true;
            victory = false;
        }
        else                                    // Otherwise, show damage
        {
            self.playerShip.blink();
        }
    }
    
    self.displayScore = function()
    {
        // Update the player score
        if (score < 10)
            document.getElementById("player-score").innerHTML = "00000" + score.toFixed(0);
        else if (score >= 10 && score < 100) 
            document.getElementById("player-score").innerHTML = "0000" + score.toFixed(0);
        else if (score >= 100 && score < 1000)
            document.getElementById("player-score").innerHTML = "000" + score.toFixed(0);
        else if (score >= 1000 && score < 10000)
            document.getElementById("player-score").innerHTML = "00" + score.toFixed(0);
        else if (score >= 10000 && score < 100000)
            document.getElementById("player-score").innerHTML = "0" + score.toFixed(0);        
        else {
            document.getElementById("player-score").style.fontSize = "25px";
            document.getElementById("player-score").innerHTML = score.toFixed(0);
        }
    };
    
    self.endgameScore = function()
    {
        // Add in score for each life left
        score += 15000 * ((self.playerShip.health / 68 * 100) * .01); //self.playerShip.livesCount;
        self.displayScore();
        
        // Update the player score
        if (score < 10)
            document.getElementById("game-over-score").innerHTML = "Score: 00000" + score.toFixed(0);
        else if (score >= 10 && score < 100) 
            document.getElementById("game-over-score").innerHTML = "Score: 0000" + score.toFixed(0);
        else if (score >= 100 && score < 1000)
            document.getElementById("game-over-score").innerHTML = "Score: 000" + score.toFixed(0);
        else if (score >= 1000 && score < 10000)
            document.getElementById("game-over-score").innerHTML = "Score: 00" + score.toFixed(0);
        else if (score >= 10000 && score < 100000)
            document.getElementById("game-over-score").innerHTML = "Score: 0" + score.toFixed(0);        
        else {
            document.getElementById("game-over-score").style.fontSize = "25px";
            document.getElementById("game-over-score").innerHTML = "Score: " + score.toFixed(0);
        }
    }
    
    function decrementPlayerLives() 
    {
        // First, check if health is 0
        if (self.playerShip.health <= 0)
        {
            document.getElementById("lives-pic").style.display = "none";
        }
        else
        {
            document.getElementById("lives-pic").style.width = self.playerShip.health.toString() + "%";
        }
    };   
    
    // Display game over message for user -- Victory
    self.gameover = function(type)
    {
        document.getElementById("game-over-display").style.display = "block";
        
        if (type == 0)
        {
            document.getElementById("game-over-display").innerHTML = "VICTORY!"
            document.getElementById("game-over-display").style.left = "23%";
        }
        else 
        {
            document.getElementById("game-over-display").innerHTML = "DEFEAT";
            document.getElementById("game-over-display").style.left = "28%";
            document.getElementById("game-over-display").style.color = "darkred";
        }
        
        document.getElementById("game-over-score").style.display = "block";
        self.endgameScore();
        
        document.getElementById("game-over-lives").style.display = "block";
        document.getElementById("game-over-lives").innerHTML = "Health: " + ((self.playerShip.health / 68) * 100).toFixed(0);
        document.getElementById("game-over-lives").style.left = "35%";
        
        document.getElementById("game-over-refresh").style.display = "block";

        
        // Reload? 
        document.addEventListener("keydown", function (e) {
            if (e.keyCode == 13)
               location.reload();
        });
    };
}
