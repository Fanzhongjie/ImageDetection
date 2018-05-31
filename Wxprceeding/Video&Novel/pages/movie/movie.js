// pages/movie/movie.js
var app = getApp();
var utils = require('../util/utils.js');

/**
 * 使用this.data.parameter -- 数据会在下次进入进行更新 不立即刷新
 * this.setData() -- 数据立即生效 自动刷新
 */

Page({
  //页面的初始数据
  data: {
    inTheaters: [],
    comingSoon:[],
    Top250:[],
    searchData:[],
    containerShow:true,
    searchPanelShow:false
  },
  onLoad:function(options){
    console.log(app.globalUrl.doubanUrl);
    var inTheaters = app.globalUrl.doubanUrl + '/v2/movie/in_theaters?start=0&count=3';
    var comingSoon = app.globalUrl.doubanUrl + '/v2/movie/coming_soon?start=0&count=3';
    var Top250 = app.globalUrl.doubanUrl + '/v2/movie/top250?start=0&count=3';

    this.http(inTheaters, this.callback,"inTheaters", '正在热映');
    this.http(comingSoon, this.callback,"comingSoon",'即将上映');
    this.http(Top250, this.callback,"Top250",'排行榜');
    wx.showNavigationBarLoading();
  },
  http: function (url, callback, category,categoryName){
    wx.request({
      url: url, 
      header: {
        'Content-Type': 'application/xml' //不能使用json，需要使用xml
      },
      success: function (res) {
        callback(res.data,category,categoryName)
      }
    })
  },
  callback:function(res, category, categoryName){
    //处理数据
    console.log(res);
    /**
     * 1、大图
     * 2、标题
     * 3、星星
     * 4、评分
     * 5、id
     * 
     * 评星
     * 数组[0,0,0,0,0]
     */
    var movies = [];
    for(var idx in res.subjects){
      var subject = res.subjects[idx];
      var title = utils.cutTitleString(subject.title,0, 6);
      var temp={
        title       : title,
        coverageUrl : subject.images.large,
        average     : subject.rating.average,
        stars       : utils.convertToStarsArray(subject.rating.stars),
        movieid     : subject.id
      }
      movies.push(temp);
    }
    // console.log(movies);
    // 问题：因为类型不同
    var readyData = {};
    // 注意key不一样
    readyData[category] = {
      categoryName:categoryName,
      movies:movies
    }

    this.setData(readyData);
    wx.hideNavigationBarLoading();
    // console.log(readyData);
  },
  //跳转到更多页面
  movieMoreTap:function(event){
    // console.log(event);
    var categoryName = event.currentTarget.dataset.categoryname;
    wx.navigateTo({
      url: 'movie-more/movie-more?categoryname=' + categoryName,
    })
  },
  goMovieDetail: function (event) {
    // console.log(event);
    var movieid = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?movieid=' + movieid,
    })
  },
  onBindFoucs:function(event){
    //
    console.log(event);
    this.setData({
      containerShow   : false,
      searchPanelShow : true,
      searchData      : []
    })
  },
  onBindBlur:function(event){
    //失去焦点
    console.log(event);
    var text = event.detail.value;
    if(text != ""){
      var searchUrl = app.globalUrl.doubanUrl + '/v2/movie/search?q=' + text;
      this.http(searchUrl, this.callback, 'searchData', '');
      wx.showNavigationBarLoading();
    }else{
      // console.log('isEmpty');
      this.setData({
        containerShow: true,
        searchPanelShow: false,
      });
    }
  },
  onCancelImg:function(event){
    this.setData({
      containerShow: true,
      searchPanelShow: false,
    })
  }
})