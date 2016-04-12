/* Requires:
  ScreenWidget.js
 */
function EnemyShip(context, image, imageIndex, imageOffset, width, height, iterator, row)
{
    ScreenWidget.call(this, context);
    var self = this;
    var xSpeed = 2;
    var dir = "right"; 
    var flip = 0;
    
    // Keep track of end ships and row of ship
    self.row = row; 
    self.index = iterator;
    
    // Array of bullets
    self.bullets = Array();
    
    self.speed = .25;
    self.image = image;
    self.imageIndex = imageIndex;
    self.imageOffset = imageOffset;
    self.width = width;
    self.height = height;
    self.x = (window.innerWidth * .75) / 2 - (iterator % 5 * 80);
    self.y = 30 + (row * 100);
    
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

    self.update = function (shipsArray)
    {  
        self.x += xSpeed;    
        self.fireBullet(shipsArray);
        
        return self.checkBoundary();
    };
    
    self.checkBoundary = function()
    {
        // Two rows of ships, set the index the same temporarily
        var tempIndex = self.index - (5 * self.row);
        
        // Check if the enemy ship has gone out of bounds (left or right)
        if (dir == "right" && (self.x >= (window.innerWidth * .75) - (80 * (tempIndex + 1))))
        {
            xSpeed *= -1;
            dir = "left";
        }
        if (dir == "left" && (self.x <= (320 - (tempIndex * 80))))
        {
            xSpeed *= -1;
            dir = "right";
        }
    };
    
    self.fireBullet = function (shipsArray)
    {
        // Check if the bottom row ship still exists
        if (self.index < 5)
        {
            // Check row below it; if exists, don't shoot
            if (shipsArray[self.index + 5] === undefined)
            {
                var tempBullet = enemyBullet.makeBullet(self.context, self.x, self.y);
                self.bullets.push(tempBullet);
            }
        }
        else 
        {
            if (shipsArray[self.index] !== undefined)
            {
                var tempBullet = enemyBullet.makeBullet(self.context, self.x, self.y);
                self.bullets.push(tempBullet);
            }
        }
    };
    
}