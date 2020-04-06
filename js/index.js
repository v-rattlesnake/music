$(function () {
    // $(".nav-to").mCustomScrollbar();

    let logon = false; //登录状态
    let id = ""; //用户id
    let tang = [];//复选框选中的曲目
    let shuzu2 = [];//复选框选中的曲目
    let url = "http://127.0.0.1:3001/";
    let passEXP = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;

    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var volumeProgress;
    var lyric;
    var ccc = $(".footer>.footer_volume>div>div>div>div");
    var $volumeBar = $(".footer_volume .progress-bar");
    var $volumeLine = $(".footer_volume .progress-line");
    var $volumeDot = $(".footer_volume .progress-dot");

    var $progressBar = $(".footer_in .progress-bar");
    var $progressLine = $(".footer_in .progress-line");
    var $progressDot = $(".footer_in .progress-dot");

    var time;
    var wmin;
    var wmax = $progressBar.width();

    var shuzu = [];

    ccc.css({
        left: $(".footer>.footer_volume>div>div>div").width() - ccc.width() / 2
    });




    //*******************************    获取歌曲列表   **********
    xy();

    async function xy() {
        $.ajax({
            url: url,
            dataType: "json",
            data:{
                id:id
            },
            success: function (data) {
                if ($(".musicList").html() !== "") {
                    $(".musicList").html("");
                }

                if (data.length <= 0) return;
                player.musicList = data;
                //******************************   遍历获取到的数据   *************
                $.each(data, function (index, ele) {
                    //********************************   插入标签   **********
                    $(".musicList").append(f(index, ele));
                    if (logon){
                        if (ele.userLike.includes(id)) {
                            userLike(ele);
                        }
                    }
                });

                f3();
                initialize(data[0]);
                initMusicLyric(data[0]);
                // $(".atart").trigger("click");
                // player.playMusic(0, data[0].link_url);
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    //收藏状态
    function f3(lenGet = $(".musicList .box").eq(0).get(0).iii) {
        if (!logon) return;
        $.each(shuzu,function (index, ele) {
            $(".like").removeClass("like1");
            if (ele===lenGet){
                $(".like").addClass("like1");
                return false
            }
        })
    }
    //*******************************    初始化收藏列表   ****************

    function userLike(ele) {
        if (!logon) return;
        let likeArray = ele.userLike;
        $.each(likeArray,(index,val) => {
            if (val === id){
                shuzu.push(ele._id)
            }
        })
    }

    //*******************************************************   初始化歌曲信息
    function initialize(music) {
        $(".quming>span:first-child a").text(music.name).attr("ttitle", music.name);
        $(".quming>span:last-child a").text(music.singer).attr("ttitle", music.singer);
        $(".shijian").text("00:00/" + music.time);
        $(".nav-right>div img").attr("src", url + music.cover);
        $(".nav-right>p:nth-child(2) span").text(music.name);
        $(".nav-right>p:nth-child(3) span").text(music.singer);
        $(".nav-right>p:nth-child(4) span").text(music.album);
        $(".bgimg").css({
            background: 'url("' + url + music.cover + '")'
        });
    }

    //*******************************************************   初始化事件监听     ***************************
    xxx();

    function xxx() {
        //*******************************************************   鼠标移入     ***************************
        $(".nav-to").delegate(".musicList .box", "mouseenter", function () {
            $(this).find("span").css({
                display: "inline-block"
            });
            $(this).find(".zi").hide();
        });

        //*******************************************************   鼠标移出     ***************************
        $(".nav-to").delegate(".musicList .box", "mouseleave", function () {
            $(this).find(".nav-top-qu span").css({
                display: "none"
            });
            $(this).find(".nav-top-date span").css({
                display: "none"
            });
            $(this).find(".zi").show();
        });

        //*******************************************************   监听头部收藏按钮点击事件     ***************************
        $(".nav-left ul li:first-child").on("click", function () {
            if (!logon) return tishi("请先登录");
            if (!tang.length) return tishi("请选择要收藏的歌曲！");
            URLlike(shuzu2,"add",res => {
                console.log(res);
                if (res > 0) {
                    tishi("收藏成功");
                    tang = [];
                    shuzu2 = [];
                    $(".nav-to .toumu").find(".nav-top-input").removeClass("box1");
                    $.each($(".nav-to .box"), function (index, ele) {
                        if ($(ele).find(".nav-top-input").hasClass("box1")) {
                            $(ele).find(".nav-top-input").removeClass("box1");
                            if (!shuzu.includes($(ele).get(0).iii)) {
                                shuzu.push($(ele).get(0).iii);
                            }
                            if($(ele).get(0).index === player.currentIndex){
                                f3($(ele).get(0).iii);
                            }else if (player.currentIndex === -1) {
                                f3()
                            }
                        }
                    });
                }else if (res === 0) {
                    tishi("所选歌曲已被收藏");
                    $(".nav-to .toumu").find(".nav-top-input").removeClass("box1");
                    tang = [];
                    shuzu2 = [];
                    $.each($(".nav-to .box"), function (index, ele) {
                        $(ele).find(".nav-top-input").removeClass("box1");
                    });
                }
            });

        });

        //*******************************************************   监听清空按钮点击事件     ***************************
        $(".nav-left ul li:last-child").on("click", function () {
            if (!logon) return tishi("请先登录");
            var r = confirm("是否清空播放列表");
            let dddd = [];
            let view = [];
            if (!r) return;
            $.each($(".nav-to .box"), function (index, ele) {
                dddd.push(ele.iii);
                view.push(ele)
            });
            URLremove(dddd,res => {
                if (res > 0) {
                    if ($(".atart").hasClass("box3")){
                        $(".atart").trigger("click");
                    }
                    $(".nav-to .toumu").find(".nav-top-input").removeClass("box1")
                    $.each(view,(index,ele) => {
                        $(ele).remove();
                        player.changeMusic(ele.index);
                    });
                    $audio.attr("src","");
                }
            })

        });

        //*******************************************************   监听头部删除按钮点击事件     ***************************
        $(".nav-left ul li:nth-child(4)").on("click", function () {
            if (!logon) return tishi("请先登录");
            if (!tang.length) return tishi("请选择要操作的歌曲！");
            var rrr = 0;
            var dddd = [];
            var view = [];
            $.each($(".nav-to .box"), function (index, ele) {
                if ($(ele).find(".nav-top-input").hasClass("box1")) {
                    rrr++;
                    dddd.push($(ele).get(0).iii);
                    view.push($(ele));
                }
            });
            URLremove(dddd,res => {
                $.each(view,(index,ele) => {
                    if (ele.get(0).index == player.currentIndex) {
                        $(".next").trigger("click")
                    }
                    $(".nav-to .toumu").find(".nav-top-input").removeClass("box1")
                    ele.remove();
                    player.changeMusic(ele.get(0).index);
                    $(".nav-top .box").each(function (index, ele) {
                        ele.index = index;
                        $(ele).find(".nav-top-index").text(index + 1);
                        if (index === 0) {
                            initialize(ele.music);
                            initMusicLyric(ele.music);
                        }
                    });
                })
            });


        });

        //*******************************************************   监听复选框点击事件     ***************************
        $(".nav-to").delegate(".nav-top-input", "click", function () {
            // console.log($(this).parent().hasClass("box"));
            if ($(this).parent().hasClass("box")) {
                $(this).toggleClass("box1");
                if ($(this).hasClass("box1")) {
                    tang.push($(this).parent().get(0).iii);
                    if (!shuzu.includes($(this).parent().get(0).iii)) {
                        shuzu2.push($(this).parent().get(0).iii);
                    }
                }else {
                    let ind = tang.indexOf($(this).parent().get(0).iii);
                    tang.splice(ind,1);
                    if (shuzu2.includes($(this).parent().get(0).iii)) {
                        let ind2 = shuzu2.indexOf($(this).parent().get(0).iii);
                        shuzu2.splice(ind2,1);
                    }
                }
            } else {
                // var $box = $(this).parent();
                var box = $(".musicList .box");
                // console.log(this.className);
                if (this.className === "nav-top-input") {
                    if(!box.length) return;
                    $(this).addClass("box1");
                    $.each(box, function (index,ele) {
                        $(this).children(".nav-top-input").addClass("box1");
                        if (!tang.includes($(ele).get(0).iii)) {
                            tang.push($(ele).get(0).iii)
                        }
                        if (!shuzu.includes($(ele).get(0).iii)) {
                            shuzu2.push($(ele).get(0).iii)
                        }
                    })
                } else {
                    $(this).removeClass("box1");
                    shuzu2 = [];
                    tang = [];
                    $.each(box, function (index,ele) {
                        $(this).children(".nav-top-input").removeClass("box1");
                    })
                }
            }
        });

        //************************************************   监听子菜单点击事件---播放    ***************************
        $(".nav-to").delegate(".nav-top-qu .bofang", "click", function () {
            var $box = $(this).parents(".box");
            // console.log($(this), $box);
            //切换图标
            $(this).toggleClass("box5");
            // console.log($(".atart"));
            //文字高亮
            $box.find("a").css({
                color: "rgb(255,255,255)"
            });
            //还原其他图标  还原文字亮度
            $box.siblings().find(".nav-top-qu .bofang").removeClass("box5").parents(".box").find("a").attr("style", "");
            //切换序号状态
            $box.find(".nav-top-index").toggleClass("box4");
            $box.siblings().find(".nav-top-index").removeClass("box4");
            // 同步下方控制区播放图标
            if (!$(this).hasClass("box5")) {
                //子菜单播放状态下的操作
                $box.find("a").attr("style", "");
                $(".atart").removeClass("box3");
                $(this).siblings("a").attr("style", "");
            } else {
                //子菜单非播放下的操作
                if (!$(".atart").hasClass("box3")) {
                    //下方控制区不在播放状态下的操作
                    $(".atart").addClass("box3");
                }
            }
            player.playMusic($box.get(0).index, url + $box.get(0).music.link_url);
            initialize($box.get(0).music);
            initMusicLyric($box.get(0).music);

            // console.log($box.get(0).iii);
            //    判断当前播放音乐是否被收藏
            // console.log(shuzu);
            f3($box.get(0).iii)
        });

        //************************************************   监听控制区上一首点击事件    ***************************
        $(".last").on("click", function () {

            $(".nav-to .box").eq(player.preIndex()).find(".bofang").trigger("click")

            // console.log($(".nav-to .box").eq(0));
        });

        //************************************************   监听控制区下一首点击事件    ***************************
        $(".next").on("click", function () {
            // console.log(player.nextIndex());
            $(".nav-to .box").eq(player.nextIndex()).find(".bofang").trigger("click")

            // console.log($(".nav-to .box").eq(0));
        });

        //************************************************   监听控制区喜欢点击事件    ***************************
        $(".like").on("click", function () {
            if (!$(".nav-to .box").length) return;
            if (player.currentIndex >= 0) {
                let musicID = [$(".nav-to .box").eq(player.currentIndex).get(0).iii];
                if (!$(this).hasClass("like1")) {
                    URLlike(musicID,"add",res => {
                        if (res === 1) {
                            shuzu.push($(".nav-to .box").eq(player.currentIndex).get(0).iii);
                            tishi("成功收藏歌曲！")
                            $(this).addClass("like1");
                        }else if (res === -1) {
                            console.log("参数有误")
                        }else {
                            tishi("收藏失败")
                        }
                    })
                }else {
                    URLlike(musicID,"remove",res => {
                        console.log(res);
                        if (res === 1) {
                            $(this).removeClass("like1");
                            let ind = shuzu.indexOf($(".nav-to .box").eq(player.currentIndex).get(0).iii);
                            shuzu.splice(ind,1);
                        }else if (res === -1) {
                            console.log("参数有误")
                        }else {
                            tishi("取消失败")
                        }
                    })

                }
            }else {
                let musicID = [$(".nav-to .box").eq(0).get(0).iii];
                if (!$(this).hasClass("like1")) {
                    URLlike(musicID,"add",res => {
                        if (res === 1) {
                            shuzu.push($(".nav-to .box").eq(0).get(0).iii);
                            tishi("成功收藏歌曲！")
                            $(this).addClass("like1");
                        }else if (res === -1) {
                            tishi("参数有误")
                        }else {
                            tishi("收藏失败")
                        }
                    })
                }else {
                    URLlike(musicID,"remove",res => {
                        if (res === 1) {
                            $(this).removeClass("like1");
                            let ind = shuzu.indexOf(musicID);
                            shuzu.splice(ind,1);
                            console.log(shuzu);
                        }else if (res === -1) {
                            console.log("参数有误")
                        }else {
                            tishi("取消失败")
                        }
                    })

                }
            }
        });

        //************************************************   监听子菜单删除点击事件    ***************************

        $(".nav-to").delegate(".nav-top-date>.tu", "click", async function () {
            var $li = $(this).parents(".box");
            await URLremove([$li.get(0).iii],res => {
                if (res === 1) {
                    //    判断被删除的是否在播放状态
                    if ($li.get(0).index == player.currentIndex) {
                        $(".next").trigger("click")
                    }
                    $li.remove();
                    player.changeMusic($li.get(0).index);
                    $(".nav-top .box").each(function (index, ele) {
                        ele.index = index;
                        $(ele).find(".nav-top-index").text(index + 1);
                        if (index === 0) {
                            initialize(ele.music);
                            initMusicLyric(ele.music);
                        }
                    });
                }
            })

        });

        //************************************************   监听控制区播放点击事件    ***************************
        $(".atart").on("click", function () {
            //判断有没有播放过音乐
            if (player.currentIndex == -1) {
                $(".nav-top>.box").eq(0).find(".bofang").trigger("click")
            } else { //播放过音乐
                $(".nav-top>.box").eq(player.currentIndex).find(".bofang").trigger("click")
            }
            // console.log($(".nav-to .box").eq(0));
        });

        //************************************************   监听控制区纯净模式点击事件    ***************************
        $(".pure").on("click", function () {
            $(this).toggleClass("pure1")
        });

        //***********************************************   监听控制区循环点击事件    ***************************
        $(".pattern").on("click", function () {
            // console.log(!$(this).hasClass("pattern1"), !$(this).hasClass("pattern2"), !$(this).hasClass("pattern3"));
            if ($(this).hasClass("pattern")) {
                $(this).removeClass("pattern").addClass("pattern1").attr("title", "顺序播放");
                $audio.attr("loop", false);
                clearInterval(time);
                time = setInterval(function () {
                    var wmax = $progressBar.width();
                    var wmin = $progressLine.width();
                    if (player.currentIndex >= $(".nav-to .box").length - 1) {
                        if (wmin >= wmax) {
                            $(".nav-to .box").eq($(".nav-to .box").length - 1).find(".bofang").trigger("click");
                            $audio.get(0).pause();
                        }
                    } else {
                        if (wmin >= wmax) {
                            $(".nav-to .box").eq(player.currentIndex + 1).find(".bofang").trigger("click");
                        }
                    }
                }, 1000)
            } else if ($(this).hasClass("pattern1")) {
                $(this).removeClass("pattern1").addClass("pattern2").attr("title", "随机播放");
                $audio.attr("loop", false);
                clearInterval(time);
                time = setInterval(function () {
                    var wmax = $progressBar.width();
                    var wmin = $progressLine.width();
                    if (wmin >= wmax) {
                        var suiji = _.random($(".nav-to .box").length - 1);
                        // console.log(suiji);
                        $(".nav-to .box").eq(suiji).find(".bofang").trigger("click")
                    }
                }, 1000)
            } else if ($(this).hasClass("pattern2")) {
                $(this).removeClass("pattern2").addClass("pattern3").attr("title", "单曲循环");
                clearInterval(time);
                $audio.attr("loop", true)
            } else {
                $(this).removeClass("pattern3").addClass("pattern").attr("title", "列表循环");
                clearInterval(time);
                time = setInterval(function () {
                    var wmax = $progressBar.width();
                    var wmin = $progressLine.width();
                    if (wmin >= wmax) {
                        $(".next").triggerHandler("click")
                    }
                }, 1000);
                // console.log(duration, currentTime);
                $audio.attr("loop", false)
            }
        });

        //***********************************************   监听控制区声音图标的点击事件    ***************************
        $(".footer .mute").on("click", function () {
            $(this).toggleClass("mute1");
            if ($(this).hasClass("mute1")) {
                player.musicVoiceSeekTo(0)
            } else {
                var value = $volumeLine / $volumeBar;
                player.musicVoiceSeekTo(value);
            }
        });



        //***********************************************   播放时间同步    ***************************
        player.musicTimeUpdate(function (duration, currentTime, timeStr) {
            $(".footer .shijian").text(timeStr);
            var bili = currentTime / duration * 100;
            progress.setProgress(bili);
            //歌词滚动同步
            var index = lyric.currentIndex(currentTime);
            $(".nav>.nav-right ul>li").eq(index).addClass("on").siblings().removeClass("on");
            if (index <= 2) return;
            $(".nav>.nav-right ul").css({
                marginTop: (-index + 2) * $(".nav>.nav-right ul>li").height()
            });
        })
    }

    //***********************************************  监听登录注册  ****************************
    f2()
    function f2() {
       // 弹出登录
        $(".header_denglu").on("click",function () {
            if (logon) return;
            $("#idd").focus();
            $(".shade").show();
            $(".shade .denglu").trigger("click")
        });
        // 隐藏登录
        $(".close p").on("click",function () {
            $(".shade").hide();
            $("#idd").blur()
        });
       //登录注册切换
        $(".shade .zhuce").on("click",function () {
            // console.log(1)
            $("#idd").blur();
            $("#name").focus();
            $("#idz").val("");
            $("#name").val("");
            $("#pass").val("");
            $(".shade_con .close p").css({
                float:"left"
            });
            $(".shade_con").css({
                transform: "rotateY(180deg) translate(50%,-50%)"
            })
        });
        $(".shade .denglu").on("click",function () {
            // console.log(1)
            $("#name").blur();
            $("#idd").focus();
            $("#idd").val("");
            $("#passd").val("");
            $(".shade_con .close p").css({
                float:"right"
            });
            $(".shade_con").css({
                transform: "rotateY(0deg) translate(-50%,-50%)"
            })
        });
        let ex = /\D/;
        //  注册
        $(".shade_zhuce button").on("click",function () {
            let id = $("#idz").val();
            let name = $("#name").val();
            let pass = $("#pass").val();
            // console.log(ex.test(id));
            if (id==""||pass==""||name=="") {
                $(".tishi").stop().show().delay(2000).fadeOut(500).find("p").text("不能为空")
                return true
            }
            if (id.length < 6 || pass.length < 6){
                $(".tishi").stop().show().delay(2000).fadeOut(500).find("p").text("账号密码最少六个字符")
                return true
            }
            if (ex.test(id)){
                $(".tishi").stop().show().delay(2000).fadeOut(500).find("p").text("账号格式错误！最少六位数字")
            } else if (!passEXP.test(pass)) {
                tishi("密码格式不正确");
            }else {
                $.ajax({
                    url: url,
                    type:"POST",
                    data:{
                        name:name,
                        id:id,
                        pass:pass,
                        time:new Date().getTime()
                    },
                    success:res => {
                        // console.log(res);
                        if (res.i === 0){
                            // console.log(res.i);
                            $(".tishi").stop().show().delay(2000).fadeOut(500).find("p").text("该账号已被注册")
                        } else if (res.i === 1) {
                            // console.log(res.i);
                            $(".tishi").stop().show().delay(2000).fadeOut(500).find("p").text("注册成功，请重新登录")
                            $('.shade .denglu').trigger('click');
                            $("#idz").val("");
                            $("#name").val("");
                            $("#pass").val("")
                        }else {
                            console.log("逻辑错误");
                        }
                    }
                })
            }
        });

        //    登录
        $(".shade_denglu button").on("click",function () {
            let idd = $("#idd").val();
            let pass = $("#passd").val();
            if (idd==""||pass=="") {
                tishi("不能为空")
                return true
            }
            if (idd.length < 6 || pass.length < 6){
                tishi("账号密码最少六个字符")
                return true
            }
            if (ex.test(idd)){
                tishi("账号格式错误！最少六位数字")
            }else if (!passEXP.test(pass)) {
                tishi("密码格式不正确");
            } else {
                $.ajax({
                    url:url,
                    type: "POST",
                    data: {
                        id:idd,
                        pass
                    },
                    success:res => {
                        if (res.i === 0){
                            tishi("登录成功");
                            logon = true;
                            id = res.id;
                            $("#idd").val("");
                            $("#passd").val("");
                            $(".close p").trigger("click");
                            $(".header_denglu").text(res.name);
                            $(".box1").text("退出");
                            xy();

                        } else if(res.i === 2){
                            tishi("账号不存在，请先注册")
                        } else if(res.i === 3) {
                            tishi("密码错误，请重新输入")
                        } else {
                            console.log("逻辑错误");
                        }
                    }
                })
            }
        });

    //    退出登录
        $(".box1").on("click",function () {
            logon = false;
            $(".header_denglu").text("登录");
            $(".box1").text("");
            id = "";
            xy();
        })
        $(".shade_denglu input,.shade_zhuce input").keyup(function (e) {
            if (e.keyCode === 13) {
                if ($(e.target).parents(".shade_denglu").length){
                    $(".shade_denglu button").trigger("click")
                }else {
                    $(".shade_zhuce button").trigger("click")
                }
            }
        })
    }

    //*******************************************************   初始化进度条     ***********************
    yyy();

    function yyy() {
        //***********************************************   监听控制区进度条点击事件    ***************************
        progress = new Progress($progressBar, $progressLine, $progressDot);
        progress.progressClick(function (value) {
            // console.log(value);
            player.musicSeekTo(value)
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value)
        });

        //***********************************************   监听控制区声音条点击事件    ***************************
        volumeProgress = new Progress($volumeBar, $volumeLine, $volumeDot);
        volumeProgress.progressClick(function (value) {
            player.musicVoiceSeekTo(value)
        });
        volumeProgress.progressMove(function (value) {
            player.musicVoiceSeekTo(value)
        });
    }

    //*************************   初始化歌词   *************
    function initMusicLyric(date) {
        lyric = new Lyric(url + date.link_lrc);
        $(".nav-right ul").html("");
        lyric.loadLyric(function () {
            $.each(lyric.lyrics, function (index, ele) {
                $("<li>" + ele + "</li>").appendTo(".nav-right ul")
            })
        })
    }


    //*************************   创建标签   *************
    function f(index, ele) {
        var $li = $("<div class='box'>\n" +
            "<div class=\"nav-top-input\"><span></span></div>\n" +
            "<div class=\"nav-top-index\">" + (index + 1) + "</div>\n" +
            "<div class=\"nav-top-qu\">\n" +
            "<a href=\"javascript:;\" title=\"" + ele.name + "\">" + ele.name + "</a>\n" +
            "<span class='fenxiang'><a href=\"javascript:;\" title=\"分享\"></a></span>\n" +
            "<span class='xiazai'><a href=\"javascript:;\" title=\"下载\"></a></span>\n" +
            "<span class='tianjia'><a href=\"javascript:;\" title=\"添加到歌单\"></a></span>\n" +
            "<span class='bofang'><a href=\"javascript:;\" title=\"播放\"></a></span>\n" +
            "</div>\n" +
            "<div class=\"nav-top-name\">\n" +
            "<a href=\"javascript:;\" title=\"" + ele.singer + "\">" + ele.singer + "</a>\n" +
            "</div>\n" +
            "<div class=\"nav-top-date\">\n" +
            "<span class=\"zi\">" + ele.time + "</span>\n" +
            "<span class=\"tu\"><a href=\"javascript:;\" title=\"删除\"></a></span>\n" +
            "</div>\n" +
            "</div>");
        $li.get(0).index = index;
        $li.get(0).iii = ele._id;//musicID
        $li.get(0).music = ele;
        return $li
    }

    //*************************   监听循环状态        **************
    f1();

    function f1() {
        if ($(".footer_volume a:last-child").hasClass("pattern")) {
            $audio.attr("loop", false);
            clearInterval(time);
            time = setInterval(function () {
                wmin = $progressLine.width();
                if (player.currentIndex >= $(".nav-to .box").length - 1) {
                    if (wmin >= wmax) {
                        $(".nav-to .box").eq($(".nav-to .box").length - 1).find(".bofang").trigger("click");
                        $audio.get(0).pause();
                    }
                } else {
                    if (wmin >= wmax) {
                        $(".nav-to .box").eq(player.currentIndex + 1).find(".bofang").trigger("click");
                    }
                }
            }, 1000)
        } else if ($(".footer_volume a:last-child").hasClass("pattern1")) {
            $audio.attr("loop", false);
            clearInterval(time);
            time = setInterval(function () {
                wmin = $progressLine.width();
                if (wmin >= wmax) {
                    var suiji = _.random($(".nav-to .box").length - 1);
                    // console.log(suiji);
                    $(".nav-to .box").eq(suiji).find(".bofang").trigger("click")
                }
            }, 1000)
        } else if ($(".footer_volume a:last-child").hasClass("pattern2")) {
            clearInterval(time);
            $audio.attr("loop", true)
        } else {
            clearInterval(time);
            time = setInterval(function () {
                wmin = $progressLine.width();
                if (wmin >= wmax) {
                    $(".next").triggerHandler("click")
                }
            }, 1000);
            // console.log(duration, currentTime);
            $audio.attr("loop", false)
        }
    }

//    提示
    function tishi(val) {
        $(".tishi").stop().show().delay(2000).fadeOut(500).find("p").text(val)
    }

//    收藏ajax
    function URLlike(musicID,modified,e) {
        if (!logon) return tishi("请先登录");
        $.ajax({
            url:url+"like",
            type:"GET",
            data:{
                id:id,
                musicID:musicID,
                modified :modified,
            },
            success:res => {
                e(res)
            },
            error:res => {
                // console.log(res);
            }
        });
    }


//    删除ajax
    function URLremove(musicID,e) {
        if (!logon) return tishi("请先登录");
        $.ajax({
            url:url+"remove",
            type:"GET",
            data:{
                id:id,
                musicID: musicID
            },
            success: res => {
                e(res)
            }
        })
    }

});

// 原因： Click事件绑定了多次，只是没有触发执行，故当我触发调用一次时，它便执行多次。
// 解决的办法是：每次绑定前先取消上次的绑定。$("#id").unbind('click').click(function(){},$("#id").unbind('click').on("click",function(){})


