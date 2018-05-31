var utils = require('../../../../util/utils.js');
var app = getApp();

Page({
  data: {
    chapters        : [],
    showchapters    : [],
    title           : '',
    simulate        : [],
    absDirectory    : [],  //显示目录页数
    shownum         : 0,
    isShow          : '',
    actionnum       : true,
    hiddenmodalput  : true,
    scrollTop       : 20,
    topre : true,
    tonext:true,
  },
  onLoad: function (options) {
    // var url = options.url; //所有章节html
    var title = options.title;
    this.setData({
      title:title
    });
    wx.setNavigationBarTitle({
      title: title,
    })
    var chapters = app.currentBookschapter.chapters;
    //使用chapters定义页数
    var len = Math.ceil(chapters.length/20);//有小数就加1
    var absDirectory = [];
    for(var i=0;i<len; i++)
      absDirectory.push((i+1) + '/' + len);
    this.setData({
      absDirectory: absDirectory,
      chapters : chapters,
      showchapters : chapters.slice(0, 20),
      isShow: absDirectory[0],
      shownum : 0
    });
  },
  changeChapters:function(idx){
    var temp = this.data.chapters;
    var len = temp.length;
    var sta = idx*20;
    var end = sta+20;
    this.setData({
      showchapters: temp.slice(sta, end>len?len:end),
      actionnum: true,
      shownum : idx,
      isShow : this.data.absDirectory[idx],
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //跳转到章节内容
  OnChapter: function (event) {
    // console.log(event);
    var url = event.currentTarget.dataset.url;
    var index = event.currentTarget.dataset.index;
    var total = event.currentTarget.dataset.total;
    var pagesidx = this.data.shownum;
    wx.navigateTo({
      url: "../../novel-chapter/novel-chapter?url=" + url +
      '&index=' + (pagesidx*20+index) + '&total=' + total + '&title=' + this.data.title,
    })
  },
  showDirectory:function(event){
    this.setData({
      actionnum : false
    })
  },
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  cancleTab:function(){
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  toPrevious:function(){
    var idx = this.data.shownum-1;
    if(idx>=0){
      var temp = this.data.chapters;
      var sta = idx * 20;
      var end = sta + 20;
      this.setData({
        showchapters: temp.slice(sta, end),
        actionnum: true,
        shownum: idx,
        isShow: this.data.absDirectory[idx]
      })
    }
  },
  toNextList:function(){
    var idx = this.data.shownum+1;
    var temp = this.data.chapters; 
    var len = temp.length;
    var sta = idx * 20;
    if(sta < len){
      var end = sta + 20;
      this.setData({
        showchapters: temp.slice(sta, end > len ? len : end),
        actionnum: true,
        shownum: idx,
        isShow: this.data.absDirectory[idx]
      })
    }
  },
  bindPickerChange: function(e){
    var idx = e.detail.value;
    console.log(idx);
    this.setData({
      shownum : idx,
      isShow: this.data.absDirectory[idx]
    })
    this.changeChapters(idx);
  }
})