/*
Requires: ScreenWidget.js
 */
function SpaceShip(context, image, imageIndex, imageOffset, width, height)
{
    ScreenWidget.call(this, context);
    var self = this;
    var velocityX = 0;
    var velocityY = 0;
    var speed = 7;              // SUBJECT TO CHANGE - PLAYER SPEED
    var keys = [];
    var loop = 0;
    
    self.timer = 0;
    self.bombsCount = 3;        // Keeps track of number of bombs left
    self.bullets = Array();
    self.health = 68;
    self.dead = false; 
    
    self.image = image;
    self.imageIndex = imageIndex;
    self.imageOffset = imageOffset;
    self.width = width;
    self.height = height;
    self.x = (window.innerWidth * .75) / 2 - 30;
    self.y = (window.innerHeight * .9) + 700;
    
    self.render = function()
    {
        self.context.drawImage(self.image,       //source image
            self.imageIndex * self.imageOffset,  //sprite x offset
            0,                                   //sprite y offset
            self.width,                          //sprite width
            self.height,                         //sprite height
            self.x,                              //destination x
            self.y,                              //destination y
            self.width,                          //destination width (for scaling)
            self.height);                        //destination height (for scaling)
    };

    function moveShip() {
        // Left and right directions
        if (keys[39] || keys[68]) {     // RIGHT ARROW & 'D'
            velocityX = speed;
        }
        if (keys[37] || keys[65]) {     // LEFT ARROW & 'A'
            velocityX = -speed;
        }

        // Up and down directions
        if (keys[40] || keys[83]) {     // UP ARROW & 'W'
            velocityY = speed;
        }
        if (keys[38] || keys[87]) {     // DOWN ARROW & 'S'
            velocityY = -speed;
        }

        // Update ship's position (if necessary)
        if (keys[37] || keys[39] || keys[65] || keys[68])
            self.x += velocityX;
        if (keys[38] || keys[40] || keys[83] || keys[87])
            self.y += velocityY;

        // Check HORIZONTAL bounds
        if (self.x >= ((window.innerWidth * .75) - 110)) {
            self.x = ((window.innerWidth * .75) - 110);
        } else if (self.x <= 50) {
            self.x = 50;
        }
        // Check VERTICAL bounds
        if (self.y >= (window.innerHeight * .9 - 70)) {
            self.y = window.innerHeight * .9 - 70;
        } else if (self.y <= 450) {
            self.y = 450;
        }
        setTimeout(moveShip, 15);
    }
        
    moveShip();

    function fireBullet() {
        
        if (keys[32]) 
        {
            var tempBullet = playerBullet.makeBullet(context, 0, self.x + self.width / 2 - 10, self.y); 
            tempBullet.init();
            self.bullets.push(tempBullet);
        }
        if (keys[13])
        {
            // Decrement our bombs and update our label
            if (self.bombsCount > 0) {
                var tempBullet = playerBullet.makeBullet(context, 1, self.x + self.width / 2 - 12, self.y);
                tempBullet.init();
                self.bullets.push(tempBullet);
                
                self.bombsCount--;
                if (self.bombsCount == 0) {
                    timeout = setTimeout(bombsReset, 10000);
                }
                
                document.getElementById("bomb-count").innerHTML = self.bombsCount;
            }
            // Or we are out of bombs
            else {
                document.getElementById("special-bullets").style.color = "red";
                document.getElementById("bomb-count").style.color = "red";
                
                setTimeout(flash, 300);
            }
        }           
    }
    
    function resetTimer() {
        self.timer = 0;
    };
    
    // This function makes the ship have a "blink"-like animation to 
    // show that the ship has taken damage
    self.blink = function ()
    {
        if (loop === 0)
        {
            self.image.src = "images/ships/ships-blink.png";              //destination height (for scaling)   
            loop = 1;

            setTimeout(self.blink, 120);
        }
        else 
        {
            self.image.src = "images/ships/ships.png";
            loop = 0;
        }
    };
    
    // Make the ship have an explosion-like animation upon death
    self.explode = function ()
    {
        self.image.src = "images/widgets/explosion.png";
        self.height = 150;
        self.dead = true;
        
        if (loop < 2) 
        {
            self.width = 120; 
            self.imageOffset = loop * self.width; 
            self.imageIndex = loop;
        }
        else if (loop >= 2 && loop < 2.5)
        {
            self.width = 130;   
            self.imageOffset = loop * self.width;
            self.imageIndex = loop;
        }
        else if (loop == 2.5)
        {
            self.width = 120;
            self.imageOffset = loop * self.width + 120;
            self.imageIndex = loop - 1;
        }
        else if (loop >= 2.5 && loop < 3.5)
        {
            self.width = 110; 
            self.imageOffset = loop * self.width - 30;
            self.imageIndex = loop;
        }
        else if (loop >= 3.5)
        {
            self.width = 120;
            self.imageOffset = loop * self.width + 60;
            self.imageIndex = loop;
        }
        
        loop += .5;
        setTimeout(self.explode, 30);
    };
    
    function bombsReset() {
        if (self.bombsCount < 3) {
            self.bombsCount++;
            updateLabels(0);
            
            // Reset Timeout
            setTimeout(bombsReset, 300);
        }
        else {
            updateLabels(1);
        }
    };
    
    function updateLabels(style) {
        if (style == 0) {
            document.getElementById("bomb-count").innerHTML = self.bombsCount;
            document.getElementById("special-bullets").style.color = "red";
            document.getElementById("bomb-count").style.color = "red";
        }
        if (style == 1) {
            document.getElementById("special-bullets").style.color = "white";
            document.getElementById("bomb-count").style.color = "darkgoldenrod";
        }
    };
    
    // Bullet count flash effect
    function flash() {
        document.getElementById("special-bullets").style.color = "white";
        document.getElementById("bomb-count").style.color = "darkgoldenrod";
    }
    
    document.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });
    
    document.addEventListener("keyup", function (e) {
        // Reset X Velocity
        velocityX = 0;
        
        if (keys[32] || keys[13]) {
            if (self.timer <= 0) {
                fireBullet();
                
                // Update the timer
                self.timer = 20;
            }
        }
        
        keys[e.keyCode] = false;
    });
}