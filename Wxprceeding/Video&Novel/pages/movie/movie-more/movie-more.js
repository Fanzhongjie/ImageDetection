var app = getApp();
var utils = require('../../util/utils.js');

/**
 * 还有一个问题
 * 上拉刷新时，totalCount一直都在递增
 */

// pages/movie/movie-more/movie-more.js
Page({
  //页面的初始数据
  data: {
    movies:[],
    totalCount:0,
    totalMovies:[]
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    var categoryName = options.categoryname;
    this.setData({
      categoryName:categoryName
    });
    
    var publicUrl = app.globalUrl.doubanUrl;
    var allUrl = ''; 
    switch(options.categoryname){
      case '正在热映':
        allUrl = '/v2/movie/in_theaters';
        break;
      case '即将上映':
        allUrl = '/v2/movie/coming_soon';
        break;
      case '排行榜':
        allUrl = '/v2/movie/top250';
        break;
      default:
        break;
    };
    
    this.setData({
      allUrl: publicUrl + allUrl
    })
    // allUrl = publicUrl + allUrl;
    //进行网络请求数据
    utils.http(publicUrl + allUrl, this.callback);
    wx.showNavigationBarLoading();
  },
  //下拉刷新
  onPullDownRefresh:function(){
    //
    var refreshUrl = this.data.allUrl;
    this.data.totalMovies = [];
    this.data.totalCount = 0;
    utils.http(refreshUrl,this.callback);//只有这个数据会进行累加
  },

  //上拉加载
  onReachBottom: function (event) {
    //上拉刷新的url需要变化  第一次请求的（0,19）  
    //1：start 0  2：start 20  3：start  40
    var nextUrl = this.data.allUrl + "?start=" + this.data.totalCount + "&count=20";
    utils.http(nextUrl,this.callback);
    wx.showNavigationBarLoading();
  },
  
  callback:function(res){
    var movies = [];
    console.log(res);
    for (var idx in res.subjects) {
      var subject = res.subjects[idx];
      var title = utils.cutTitleString(subject.title, 0, 6);
      var temp = {
        title       : title,
        coverageUrl : subject.images.large,
        average     : subject.rating.average,
        stars       : utils.convertToStarsArray(subject.rating.stars),
        movieid     : subject.id
      }
      movies.push(temp);
    };

    var totalMovies = [];
    //第一次进入不累加
    if (this.data.totalCount != 0)
      totalMovies = this.data.movies.concat(movies);
    else {
      totalMovies = movies;
    }

    this.setData({
      movies:totalMovies
    });
    wx.hideNavigationBarLoading();
    this.data.totalCount += 20;
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function () {
    //设置导航条
    wx.setNavigationBarTitle({
      title: this.data.categoryName
    })
  },

  //跳转到详情页
  goMovieDetail:function(event){
    // console.log(event);
    var movieid = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieid=' + movieid,
    })
  }
})