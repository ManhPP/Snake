var SettingsLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {
        if (isSound){
            cc.audioEngine.playMusic(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? res.bgMusic_wav : res.bgMusic_mp3, false);
        }
        var sound = new cc.MenuItemFont("Sound");
        var item1 = new cc.MenuItemToggle(new cc.MenuItemFont("On"), new cc.MenuItemFont("Off"));
        item1.setCallback(this.onSoundControl);
        var stateSound = isSound?0:1;
        item1.setSelectedIndex(stateSound);

        var level = new cc.MenuItemFont("Level");
        var item2 = new cc.MenuItemToggle(new cc.MenuItemFont("Easy"), new cc.MenuItemFont("Medium"), new cc.MenuItemFont("Hard"));
        item2.setCallback(this.onLevelControl());
        var stateLevel = isSound?0:1;
        item2.setSelectedIndex(stateLevel);

        var label = new cc.LabelTTF("Go Back", "Arial", 15);
        var back = new cc.MenuItemLabel(label, this.onBack);

        var menu = new cc.Menu(sound, level, item1, item2, back);
        menu.alignItemsInColumns(2,2,1);
        this.addChild(menu);
        back.y -= 50;
        return  true;
    },
    onSoundControl: function () {
        isSound = !isSound;
        if (isSound){
            cc.audioEngine.playMusic(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? res.bgMusic_wav : res.bgMusic_mp3, false);
        }
        else {
            cc.audioEngine.stopMusic();
        }
    },
    onLevelControl: function () {
        level = (level+1)%3;
    },
    onBack: function () {
        var scene = new cc.Scene();
        scene.addChild(new Menu());
        cc.director.runScene(scene);
    }
})