// pages/test/test.js
var app = getApp();
var utils = require('../util/utils.js');

Page({
  data: {
    allPages : [],
    currentTab : 0,
    allbooks  : [],
    showbooks : true,
    books_list:{books:[]},
    search_books:{books:[]},
    currentshowbooks:[],
    defaultImg: '../images/defaultnocover.jpg',
    noSearch:true
  },
  init:function(){
    var pages = this.data.allPages;  
    // utils.http(pages[0].url, this.callback);
    for(var i=0;i<11;i++){
      // console.log('i:',i);
      // console.log('allbooks:',this.data.allbooks);
      utils.http(pages[i].url, this.callback);
    }
  },
  callback:function(data){
    var books = [];
    var raw = utils.extractToBooksContent(data);
    for (var i in raw)
      books.push(utils.combineBookContent(raw[i]));
    var tempbooks = this.data.allbooks;
    tempbooks.push({books});
    //保存所有的内容
    this.setData({
      allbooks : tempbooks
    });
  },
  callback2:function(data){
    console.log(data);
    var books = [];
    var raw = utils.extractToBooksContent(data);
    for (var i in raw)
      books.push(utils.combineBookContent(raw[i]));
    this.setData({
      books_list : {
        books : books
      },
      currentshowbooks:books.slice(0,15),
    })
  },
  onLoad: function (options) {
    var basicUrl = app.globalUrl.basicUrl;
    var titles = ['玄幻魔法', '武侠修真', '纯爱耽美', '都市言情','职场校园',
      '穿越重生', '历史军事', '网游动漫', '恐怖灵异', '科幻小说','美文名著'];
    var allPages = [];
    var len = titles.length;
    for(var i=0;i<len;i++){
      // var m = i+1;
      allPages.push({
        title : titles[i],
        url   : basicUrl + (i+1) + '_1.html'
      })
    }
    this.setData({
      allPages  : allPages
    })
    this.init();
    utils.http(allPages[0].url, this.callback2);
  },
  onPages:function(event){
    var url = event.currentTarget.dataset.url;
    var title = event.currentTarget.dataset.title;
    // console.log(event);
    wx.navigateTo({
      url: '../index/index?url=' + url + '&title=' + title,
    })
  },
  switchNav:function(event){
    //切换界面
    // console.log(event);
    var idx = event.currentTarget.dataset.current;
    this.setData({
      currentTab : idx
    })
    var curr = this.data.allbooks[idx];
    // console.log(curr);
    this.setData({
      books_list : curr,
      currentshowbooks : curr.books.slice(0,15)
    })
  },
  onreadFoucs: function (event) {
    // 获得焦点
    this.setData({
      search_books: [],
      currentshowbooks:[]
    })
  },
  onreadBlur: function (event) {
    var searchinfo = event.detail.value;  //输入的文本信息
    var search_books = [];
    var allbooks = this.data.allbooks;
    var temp;
    var temp_books = [];
    if (searchinfo == null || searchinfo == '') {
      this.setData({
        search_books: {books: []},
        noSearch: !this.data.noSearch,
        currentshowbooks : this.data.books_list.books.slice(0,15)
      });
    }
    else{
      for (var i in allbooks) {
        // console.log(allbooks[i]);
        for (var j in allbooks[i].books){
          temp = allbooks[i].books[j].title;
          // console.log(temp);
          if (temp[0].indexOf(searchinfo) >= 0)
            temp_books.push(allbooks[i].books[j]);
        }
      }
      this.setData({
        search_books: {
          books: temp_books
        },
        currentshowbooks:temp_books.slice(0,15)
      })
    }
  },
  onReading: function (event) {
    // console.log('event:' ,event);
    var bookUrl = event.currentTarget.dataset.bookurl[0];
    var imgUrl = event.currentTarget.dataset.imgurl;
    if(imgUrl.indexOf('defaultnocover.jpg') != -1){
      imgUrl = '../'+imgUrl;
    }
    var author = event.currentTarget.dataset.author[0];
    var title = event.currentTarget.dataset.title;
    var titlesub = event.currentTarget.dataset.titlesub;
    // var bookurl = bookinfo.bookurl;
    wx.navigateTo({
      url: './novelinfo/book-detail/book-detail?bookurl=' + bookUrl + "&title="
      + title + "&author=" + author + '&img=' + imgUrl + '&titlesub=' + titlesub,
    })
  },
  errorfunc:function(event){
    // console.log(event);
    var idx = event.currentTarget.dataset.idx;
    var curr = this.data.currentshowbooks;
    curr[idx].imgUrl = this.data.defaultImg;
    this.setData({
      currentshowbooks:curr
    })
  },
  onReachBottom:function(){
    var list = [];
    if(this.data.showbooks)
      //使用books_list
      list = this.data.books_list.books;
    else
      //使用search_books
      list = this.data.search_books.books;
    var len = list.length;
    //每次+15
    var curr = this.data.currentshowbooks;
    var currlen = this.data.currentshowbooks.length;
    if(currlen < len){
      curr = curr.concat(list.slice(currlen, len-currlen>15 ? currlen+15 : len))
      this.setData({
        currentshowbooks : curr
      })
    }
    //donothing
  },
  onPullDownRefresh: function () {
    this.init();
  },
  getToSearch:function(){
    this.setData({
      noSearch: !this.data.noSearch,
      currentshowbooks: [],
      showbooks: false
    })
  },
  getOutSearch: function () {
    this.setData({
      noSearch: !this.data.noSearch,
      currentshowbooks: this.data.books_list.books.slice(0,15),
      showbooks: true
    })
  }
})