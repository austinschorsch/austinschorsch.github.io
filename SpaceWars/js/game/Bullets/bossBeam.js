/* Requires:
ScreenWidget.js
 */
function bossBeam(context)
{
    ScreenWidget.call(this, context);
    var self = this;
    var img = new Image();
   
    self.speed = 5;
   
    self.render = function ()
    {
        /*self.context.fillStyle = "gold";
        self.context.beginPath();
        self.context.rect(self.x, self.y, 8, window.innerHeight * .75);
        self.context.fill();
        */
        img.src = "images/bullets/boss-beam.png"
    };

    self.update = function ()
    {
        self.y += self.speed; 
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
        if ((self.x >= x && self.x <= (x + width)) && 
            (self.y <= y + height && self.y >= height - y)) 
            {
                return true;
            }
        return false;
    };
}

bossBeam.makeBullet = function(context, shipX, shipY)
{
    var newBullet = new bossBeam(context);
    
    newBullet.x = shipX; 
    newBullet.y = shipY; 
    newBullet.width = 2;
    newBullet.height = window.innerHeight;
    
    return newBullet;
};
