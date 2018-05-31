// pages/index/book-detail/book-detail.js
var utils = require('../../../util/utils.js');
var app = getApp();

Page({
  data: {
    chapters      : [],
    bookinfo      : '',
    detailSummary : [],
    bookDetail : '',
    allchaptersUrl : ''
  },
  onLoad: function (options) {
    console.log('options:',options);
    var bookurl = options.bookurl;
    this.setData({
      bookinfo  : {
        titlesub: options.titlesub,
        title   : options.title,
        author  : options.author,
        img     : options.img
      }
    });
    wx.setNavigationBarTitle({
      title: options.title,
    })
    utils.http(bookurl, this.callback1);
  },
  //设置全局变量
  setGlobal:function(data){
    //获取章节章节列表，所有
    var allchapters = utils.getChapterList(data);
    app.currentBookschapter.chapters = allchapters;
  },
  callback1: function(data){
    var bookDetail = utils.getNovelDetail(data);
    console.log('bookdetail:',bookDetail);
    var allchaptersUrl = utils.getChapter(data);    //all chapters
    var detailSummary = utils.getDetailSummary(data);
    this.setData({
      detailSummary: detailSummary,
      bookDetail : bookDetail,
      allchaptersUrl : allchaptersUrl
    });

    utils.http(allchaptersUrl, this.setGlobal);
  },
  getChapterDirectory:function(event){
    wx.navigateTo({
      url: 'chapter-directory/chapter-directory?url=' + this.data.allchaptersUrl
      + '&title=' + this.data.bookinfo.title,
    })
  },
  OnChapter: function (event) {
    var url = event.currentTarget.dataset.chapterurl;
    var index = event.currentTarget.dataset.index;
    var total = event.currentTarget.dataset.total;
    wx.navigateTo({
      url: "../novel-chapter/novel-chapter?url=" + url +
      '&index=' + index + '&total=' + total + '&title=' + this.data.bookinfo.title,
    })
  },
  fromStart:function(){
    var url = app.currentBookschapter.chapters[0].url;
    var total = app.currentBookschapter.chapters.length;
    wx.navigateTo({
      url: "../novel-chapter/novel-chapter?url=" + url +
      '&index=0&total=' + total + '&title=' + this.data.bookinfo.title,
    })
  }
})