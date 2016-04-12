/* Requires:
ScreenWidget.js
 */
function playerBullet(context)
{
    ScreenWidget.call(this, context);
    var self = this;
    var img = new Image();
    
    self.speed = 1;             
    self.type = 0;              // Keeps track of bullet type (0: regular, 1: bomb) 
    
    self.init = function ()
    {
        if (self.type == 0)
            img.src = "images/bullets/normal-missile.png";
        if (self.type == 1) 
            img.src = "images/bullets/special-missile.png";
    };
    
    self.render = function ()
    {
        self.y -= self.speed; 
        self.context.drawImage(img, self.x, self.y);
    };

    self.update = function ()
    {
        return self.checkBoundary();
    };

    self.checkBoundary = function()
    {
        if(self.y < minY)
        {
            return true;
        }
        return false; 
    };
    
    self.checkHit = function(x, y, width, height)
    {
        if ((self.x >= x && self.x <= (x + width)) && 
            (self.y <= y + height && self.y >= height - y)) 
            {
                return true;
            }
        return false;
    };
}

playerBullet.makeBullet = function(context, type, shipX, shipY)
{
    var newBullet = new playerBullet(context);
    
    if (type == 0) {                    // Normal Missile
        newBullet.speed = 2;
        newBullet.type = 0;
    } 
    else {                              // Bomb
        newBullet.speed = 3;
        newBullet.type = 1;
    }
    newBullet.x = shipX; 
    newBullet.y = shipY; 
    newBullet.width = 2;
    
    return newBullet;
};


