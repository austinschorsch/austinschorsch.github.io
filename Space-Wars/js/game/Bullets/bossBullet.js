/* Requires:
ScreenWidget.js
 */
function bossBullet(context)
{
    ScreenWidget.call(this, context);
    var self = this;
    var img = new Image();
    var tick = 0;
    self.xDir = "left";
    self.speed = 3;
   
    self.render = function ()
    {
        img.src = "images/bullets/enemy-bullet.png"
    };

    self.update = function (x_direction)
    {
        self.y += self.speed; 
        
        // Now, add to the x value appropriately
        if (x_direction == "left")
            self.x -= .5;
        else 
            self.x += .5;
        
        self.context.drawImage(img, self.x, self.y);
    };

    self.checkBoundary = function()
    {
        if(self.y > window.innerHeight * .9)
        {
            return true;
        }
        return false; 
    };
    
    self.checkHit = function(x, y, width, height)
    {
        //document.getElementById("debug").innerHTML = "self.x: " + self.x + "<br> self.y: " + self.y + "<br> x: " + x + "<br> y: " + y;
        if ((self.x >= x && self.x <= x + width) && (self.y >= y && self.y <= y + height))
            {
                return true;
            }
        return false;
    };
}

bossBullet.makeBullet = function(context, shipX, shipY)
{
    var newBullet = new bossBullet(context);
    
    newBullet.x = shipX; 
    newBullet.y = shipY; 
    newBullet.width = 2;
    
    return newBullet;
};
