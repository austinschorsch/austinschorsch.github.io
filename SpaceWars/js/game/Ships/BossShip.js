/* Requires:
  ScreenWidget.js
 */
function BossShip(context, image, imageIndex, imageOffset, width, height)
{
    ScreenWidget.call(this, context);
    var self = this;
    var xSpeed = 3.5;
    var ySpeed = .4;
    var loop = 0;
    var bulletSpeed = "normal";
    var dir = "right";
    var beamMode = false;
    var beamTimer = 0;

    self.xDir = "right";
    self.health = 15;
    self.bullets = Array();
    self.beams = Array();

    self.dead = "false";
    self.ticks = 0;
    self.image = image;
    self.imageIndex = imageIndex;
    self.imageOffset = imageOffset;
    self.width = width;
    self.height = height;
    self.x = 0 + window.innerWidth/2;
    self.y = 40;

    // Render our image
    self.render = function ()
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

    self.update = function (playerX)
    {
        if (self.dead == "false")
        {
            // Increment our timer
            self.ticks++;

            // Enter BeamMode on the 1000th tick -- reset between 250 - 500 more
            if (self.ticks % 1000 === 0)
            {
                beamMode = true;
                beamTimer = 0;

                // Reset y
                self.y = 40;
            }
            // The timer can be anywhere between 250 and 500
            if (beamTimer >= Math.floor(Math.random() * 500) + 250 && beamMode === true)
            {
                beamMode = false;

                // Now, fire the beam!!
                self.fireBeam();
            }

            // Beam Mode Movement
            if (beamMode === true)
            {
                if (beamTimer % 10 == 0)
                {
                    self.blink();
                }
                if (beamTimer % 50 == 0)
                {
                    self.x = playerX - 36;
                }

                beamTimer++;
            }

            // Normal Bullet Movement
            else {
                self.x += xSpeed;
                self.y += ySpeed;

                // Fire regular bullets
                if (self.ticks % 25 == 0)
                {
                    self.fireBullet();
                }

                // Update ship speed (3 OPTIONS (slow, normal, fast))
                if (self.ticks % 300 == 0)
                {
                    if (bulletSpeed == "normal")            // 3.5 --> 4.5
                    {
                        // Update ship speed
                        if (dir == "right")
                            xSpeed = 3.5;
                        else
                            xSpeed = -3.5;

                        bulletSpeed = "fast";
                    }
                    else if (bulletSpeed == "fast")         // 4.5 --> 2.5
                    {
                        if (dir == "right")
                            xSpeed = 4.5;
                        else
                            xSpeed = -4.5;

                        bulletSpeed = "normal";
                    }

                    //document.getElementById("debug").innerHTML = bulletSpeed + " speed: " + xSpeed;
                }
            }
            return self.checkBoundary();

        }
    };

    // This function makes the ship have a "blink"-like animation to
    // show that the ship has taken damage
    self.blink = function ()
    {
        if (loop === 0)
        {
            self.image.src = "images/ships/boss-ship-blink.png";              //destination height (for scaling)
            loop = 1;

            setTimeout(self.blink, 50);
        }
        else
        {
            self.image.src = "images/ships/boss-ship.png";
            loop = 0;
        }
    };

    // Make the ship have an explosion-like animation upon death
    self.explode = function ()
    {
        self.image.src = "images/widgets/explosion.png";

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
    }

    // Check x and y bounds; does the ship need to flip?
    self.checkBoundary = function()
    {
        // Check x boundary
        if (self.x >= window.innerWidth * .63 || self.x < 0)
        {
            // At our x boundary, fire a bullet
            xSpeed *= -1;

            // Switch the dir
            if (dir == "right")
                dir = "left";
            else
                dir = "right";
        }

        if (self.y >= 200 || self.y <= 40)
        {
            ySpeed *= -1;
        }
    };

    // Regular green bullets
    self.fireBullet = function()
    {
        var tempBullet = bossBullet.makeBullet(context, self.x + self.width / 2 - 20, self.y + self.height - 10);

        self.bullets.push(tempBullet);
    };

    // Missile Beam (fired very periodically)
    self.fireBeam = function(playerX, beamMode)
    {
        var tempBullet = bossBeam.makeBullet(context, self.x + self.width / 2 - 20, self.y + self.height - 10);
        self.beams.push(tempBullet);

        // Switch the x direction
        if (self.xDir == "left")
            self.xDir = "right";
        else
            self.xDir = "left";
    };


}
