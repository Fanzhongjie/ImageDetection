var app = getApp();
var utils = require('../../util/utils.js');

// 设置

Page({
  /*页面的初始数据*/
  data: {
    url         : '',
    books       : [],
    books_list  : {
      books:[]
    },
    search_books:{
      books : []
    },
    count       : 0,
    defaultimg  : '../imgs/nocover.jpg',
    showbooks : true,
    search_books : []
  },
  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    console.log(options);
    var url = options.url;
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      url : url
    })
    this.refresh(url);
  },

  refresh: function(url){
    // var that = this;
    // var url = app.globalUrl.basicUrl;
    utils.http(url, this.callback);
  },

  callback: function (data) {
    var books = [];
    var allbooks = utils.extractToBooksContent(data);
    for (var i in allbooks)
      books.push(utils.combineBookContent(allbooks[i]));

    this.setData({
      books: books,
    });

    this.getnextbooks();
    wx.hideNavigationBarLoading();
  },
  onReading: function(event){
    console.log(event);
    var bookinfo = event.currentTarget.dataset.bookinfo;
    // var bookurl = bookinfo.bookurl;
    console.log(bookinfo);
    wx.navigateTo({
      url: './book-detail/book-detail?bookurl=' + bookinfo.bookUrl + "&title="
      + bookinfo.title + "&author=" + bookinfo.author + '&img=' + bookinfo.imgUrl,
    })
  },

  onPullDownRefresh: function () {
    // Do something when pull down.
    
    this.setData({
      count       : 0,
      books_list  : []
    });
    this.refresh(this.data.url);
    // this.getnextbooks();
    wx.hideNavigationBarLoading();
  },

  getnextbooks: function(){
    wx.showNavigationBarLoading();
    var start = this.data.count;
    var len = this.data.books.length;
    var end = (len < start + 10 ? len : start + 10);
    console.log('start:', start,' end:',end, ' len:', len);

    var that = this;
    if (end > start)
      this.setData({
        books_list: {
          books : that.data.books_list.books.concat(this.data.books.slice(start, end)),
        },
        count       : end
      });
    console.log('books: ', this.data.books.length);
  },

  onReachBottom: function () {
    // Do something when page reach bottom.
    this.getnextbooks();
    wx.hideNavigationBarLoading();
  },
  errorfunc : function(event){
    var index = event.currentTarget.dataset.item;
    var books = this.data.books;
    books[index].imgUrl = this.data.defaultimg;
    console.log(books[index]);
    this.setData({
      books : books
    });
  }
})