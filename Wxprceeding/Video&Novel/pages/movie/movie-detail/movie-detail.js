var app = getApp();
var utils = require('../../util/utils.js');

Page({
  data: {
    movie : {}
  },

  onLoad: function (options) {
    console.log(options);
    //ulr地址
    var id = options.movieid;
    var detailMovieUrl = app.globalUrl.doubanUrl + '/v2/movie/subject/' + id;
    utils.http(detailMovieUrl, this.callback);
  },
  callback:function(data){
    console.log('data',data);
    /**
     * 1. 电影图片      :  movieImg
     * 2. 制片国家      :  country
     * 3. 电影名称      :  title
     * 4. 繁体名称      :  original_title
     * 5. 想看人数      :  wish_count
     * 6. 短评数量      :  comments_count
     * 8. 电影类型      :  generes
     * 13.主演信息      :  castsInfo
     * 7. 年代          :  year
     * 9. 评星          :  stars
     * 10.评分          :  score
     * 11.导演          :  director
     * 12.主演          :  casts
     * 14.简介          :  summary 
     */
    
    //由于有些字段可能没有，需要判断
    if(!data)
      return;
    var director = {
      avatar:'',
      name:'',
      id:''
    }
    if(data.directors[0] != null){
      if (data.directors[0].avatar != null)
        director.avatar = data.directors[0].avatar.large;
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var temp = {
      movieImg      : data.images.large,
      country       : data.countries[0],
      title         : data.title,
      originalTitle: data.original_title,
      wishCount    : data.wish_count,
      commentCount: data.comments_count,
      year          : data.year,
      generes       : data.genres,
      stars         : utils.convertToStarsArray(data.rating.stars),
      score         : data.rating.average,
      director      : director,
      casts         : utils.covertToCastString(data.casts),
      castsInfo     : utils.getActorInfo(data.casts),
      summary       : data.summary,
    }

    console.log(temp);
    this.setData({
      movie : temp
    })
  },
  onReady:function(){
    wx:wx.setNavigationBarTitle({
      title: this.data.movie.title.substring(0,10) + "..."
    })
  }
})