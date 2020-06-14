
var GameOver = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        var redColor = cc.color(0, 0, 0);
        var bg = new cc.Sprite(res.bg);
        this.addChild(bg);
        gameOverLabel = new cc.LabelTTF("    Game Over \nPress to restart!", "Arial", 38);
        gameOverLabel.x = winSize.width / 2;
        gameOverLabel.y = winSize.height / 2;
        gameOverLabel.fillStyle = redColor
        this.addChild(gameOverLabel);
        bg.setScaleY(0.1);
        bg.setScaleX(0.6);
        bg.x = gameOverLabel.x;
        bg.y = gameOverLabel.y;
    }
});