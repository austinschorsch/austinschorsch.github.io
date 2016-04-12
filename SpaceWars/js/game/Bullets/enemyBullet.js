/* Requires:
ScreenWidget.js
 */
function enemyBullet(context)
{
    ScreenWidget.call(this, context);
    var self = this;
    var img = new Image();
   
    self.speed = 1;
   
    self.render = function ()
    {
        img.src = "images/bullets/enemy-bullet.png"
    };

    self.update = function ()
    {
        self.y += self.speed; 
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
}

enemyBullet.makeBullet = function(context, shipX, shipY)
{
    var newBullet = new enemyBullet(context);
    
    newBullet.x = shipX; 
    newBullet.y = shipY; 
    newBullet.width = 2;
    
    return newBullet;
};
