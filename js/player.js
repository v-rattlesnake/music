(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex: -1,
        playMusic: function (index, music) {
            if (this.currentIndex == index) {
                //    同一首
                if (this.audio.paused) {
                    this.audio.play()
                } else {
                    this.audio.pause()
                }
            } else {//不是同一首
                this.$audio.attr("src", music);
                this.audio.play();
                this.currentIndex = index
            }
        },
        //上一首所用下标
        preIndex: function () {
            var index = this.currentIndex - 1;
            if (index < 0) {
                index = this.musicList.length - 1;
            }
            return index
        },
        // 下一首所用下标
        nextIndex: function () {
            var index = this.currentIndex + 1;
            if (index > this.musicList.length - 1) {
                index = 0;
            }
            return index
        },
        //删除所用下标
        changeMusic:function (index) {
            this.musicList.splice(index,1);
            if (index < this.currentIndex) {
                this.currentIndex=this.currentIndex-1
            }
        },
        // 获取歌曲时间
        musicTimeUpdate: function (callBack) {
            var $this = this;
            // this.$audio.off("timeupdate");
            this.$audio.on("timeupdate",function () {
                var duration = $this.audio.duration || 1;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatDate(duration,currentTime);
                callBack(duration,currentTime,timeStr)
            })
        },
        // 格式化歌曲时间
        formatDate: function (duration,currentTime) {
            //结束时间
            var endMin= parseInt(duration/60);
            var endSec= parseInt(duration%60);
            if (endMin < 10) {
                endMin = "0" + endMin
            }
            if (endSec< 10) {
                endSec = "0" + endSec
            }
            //进行时间
            var startMin= parseInt(currentTime/60);
            var startSec= parseInt(currentTime%60);
            if (startMin < 10) {
                startMin = "0" + startMin
            }
            if (startSec< 10) {
                startSec = "0" + startSec
            }
            return startMin+" : "+startSec + " / "+endMin + " : "+endSec;
        },
        // 设置进度条后修改进度时间
        musicSeekTo:function (value) {
            if (isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        //设置时间
        musicVoiceSeekTo: function (value) {
            if (isNaN(value)) return;
            if (value < 0 || value > 1) return;
            this.audio.volume=value
        }
    };
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);