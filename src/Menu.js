

var Menu = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        winSize = cc.director.getWinSize();
        cc.audioEngine.setMusicVolume(0.7);
        cc.audioEngine.playMusic(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? res.bgMusic_wav : res.bgMusic_mp3, false);

        var center = cc.p(winSize.width / 2, winSize.height / 2);
        var menuItemPlay = new cc.MenuItemFont('Play', this.onPlay, this);
        var menu = new cc.Menu(menuItemPlay);
        menu.setPosition(center);
        this.addChild(menu);
    },
    onPlay: function() {
        cc.log('onplay');
        cc.audioEngine.stopMusic();
        var scene = new cc.Scene();
        snakeJSGameLayer = new GameLayer();
        scene.addChild(snakeJSGameLayer);
        cc.director.runScene(scene);
    }
});
var MenuScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new Menu();
        layer.init();
        this.addChild(layer);
    }
});
