(function (window) {
    function Lyric (path) {
        return new Lyric.prototype.init(path)
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) {
            this.path = path
        },
        //存放时间数组
        times: [],
        //存放歌词数组
        lyrics: [],
        index:-1,
        //获取歌词
        loadLyric:function (callBack) {
            var $this=this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success:function (date) {
                    console.log(date);
                    $this.parseLyric(date);
                    callBack()
                }
            })
        },
        //格式化歌词
        parseLyric:function (date) {
            var $this=this;
            //清空上一首歌词
            $this.times= [];
            $this.lyrics= [];
            var date1 = date.split("\n");
            var zhengze= /\[(\d*:\d*\.\d*)\]/;
            $.each(date1,function (index,ele) {
                var date2 = ele.split("]")[1];
                //是否有歌词
                if (date2.length==1) return true;
                $this.lyrics.push(date2);
                //格式化时间
                var date3 = zhengze.exec(ele);
                if (date3 === null) return true;
                var date31=date3[1].split(":");
                var time = date31[0]*60;
                var time1=parseFloat((time+parseFloat(date31[1])).toFixed(2));
                // console.log(time1);
                $this.times.push(time1);
            })
        },
        //对应时间的对应歌词的下标
        currentIndex:function (currentTime) {
            if(currentTime>=this.times[0]){
                this.index++;
                this.times.shift();
            }
            return this.index
        }
    };
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);