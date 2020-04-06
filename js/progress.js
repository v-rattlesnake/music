(function (window) {
    var Progress = function ($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot)
    };
    Progress.prototype = {
        constructor: Progress,
        init: function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        //防止进度条拖拽   和   播放一起修改进度
        isNo:false,
        //设置进度条
        progressClick:function(callBack){
            var $this=this;
            this.$progressBar.on("click",function (event) {
                var barLeft = $(this).offset().left;
                // console.log(barLeft);
                var mouseLeft = event.pageX;
                var lineWidth=mouseLeft-barLeft;
                $this.$progressDot.css({
                    left:lineWidth
                });
                $this.$progressLine.css({
                    width:lineWidth
                });
                // 回调函数 返回比例值  用于同步修改时间
                var value = lineWidth / $(this).width();
                callBack(value)
            })
        },
        progressMove:function (callBack) {
            var $this=this;
            var onbarLeft = this.$progressBar.offset().left;
            var onbarWidth = this.$progressBar.width();
            var mouseLeft;
            this.$progressBar.on("mousedown",function () {
                $this.isNo=true;
                $("hrml,body").on("mousemove",function (event) {
                    mouseLeft = event.pageX;
                    var dotLeft=mouseLeft-onbarLeft;
                    if (dotLeft >= 0 && dotLeft <= onbarWidth) {
                        $this.$progressLine.css({
                            width:dotLeft
                        });
                        $this.$progressDot.css({
                            left:dotLeft
                        })
                    }
                });
                $("hrml,body").on("mouseup",function () {
                    $this.isNo=false;
                    // $this.isNo=false;
                    $("hrml,body").off();
                    // 回调函数 返回比例值  用于同步修改时间
                    var value = (mouseLeft-onbarLeft)/onbarWidth;
                    callBack(value)
                })
            })
        },
        //通过播放时间比例同步进度条
        setProgress: function (bili) {
            if (this.isNo) return;
            this.$progressLine.css({
                width:bili+"%"
            });
            this.$progressDot.css({
                left:bili+"%"
            })
        }
    };
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);