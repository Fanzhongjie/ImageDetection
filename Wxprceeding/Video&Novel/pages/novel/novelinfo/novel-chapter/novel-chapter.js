// pages/index/novel-chapter/novel-chapter.js
var utils = require('../../../util/utils.js');
var app = getApp();

Page({
  data: {
    url               : '',
    chapters          : [],
    name              : '',
    chapterSegments   : [],
    chapterCommon     : '',
    topre             : false,
    tonext            : false,
    commenturl        : '',
    bookcommon        : [],
    title             : '',
    showOp            : false
  },
  onLoad: function (options) {
    console.log(options);
    var chapters = app.currentBookschapter.chapters;
    this.setData({
      chapters: chapters   //总章节数
    })
    var len = chapters.length;
    var url = options.url;
    // var chapternum = parseInt(url.substring(url.lastIndexOf('/')+1, url.length-5));
    var index = parseInt(options.index);
    var total = parseInt(options.total);
    
    if(total < len){
    //说明是通过最新章节进来的，维护index和total
      index = len-total+index;
    }
    var topre = index > 0 ? true : false;
    var tonext = index < len - 1 ? true : false;



    this.setData({
      bookcommon:{
        index       : index,
        total       : len
      },
      title         : options.title,
      topre         : topre,
      tonext        : tonext,
      url           : url
    })
    utils.http(url, this.callback);
  },
  callback: function(data){
    var name = utils.getChapterName(data);
    this.setData({
      name : name
    });
    wx.setNavigationBarTitle({
      title: name,
    });
    var chapterContent = utils.getChapterContent(data);
    var temp = (chapterContent.split('\n'));
    // console.log(temp[2].length);
    var segments = this.purify(temp); //去除换行 及 换行不换段 两种字符
    this.setData({
      chapterSegments : segments
    })
  },
  purify: function(data){
    var chapterSegments = [];
    for(var i in data){
      if(data[i].length > 0){
        chapterSegments.push(data[i]);
      }
    }
    return chapterSegments;
  },
  onPre:function(event){
    console.log(event);
    console.log(this.data.bookcommon.index);
    var index = this.data.bookcommon.index - 1;
    var url = this.data.chapters[index].url;

    wx.navigateTo({
      url: "./novel-chapter?url=" + url +
      '&index=' + index + '&total=' + this.data.bookcommon.total
      + '&title=' + this.data.title
    })
  },

  onDirectory: function(event){
    wx.navigateTo({
      url: '../book-detail/chapter-directory/chapter-directory?idx='
      + this.data.bookcommon.index + '&title=' + this.data.title,
    })
  },
  onNext:function(event){
    var index = this.data.bookcommon.index + 1;
    var url = this.data.chapters[index].url;

    wx.navigateTo({
      url: "./novel-chapter?url=" + url +
      '&index=' + index + '&total=' + this.data.bookcommon.total
      + '&title=' + this.data.title,
    })
  },
  changeShowop: function(){
    this.setData({
      showOp : !this.data.showOp
    })
  }
})