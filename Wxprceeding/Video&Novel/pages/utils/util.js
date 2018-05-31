//获得书籍的信息
function extractToBooksContent(data) {
  var titlereg = new RegExp("<li><a target=\"_blank\"((.|\n)*?)</em>", "g");
  var titles = data.match(titlereg);
  // console.log(titles);
  return titles;
}

function combineBookContent(data){
  // console.log(data);
  var title = extractToTitle(data);
  var bookUrl = extractTobookUrl(data);
  var author = extractToauthor(data);
  var summary = extractToSummary(data);
  var imgUrl = extractToimgUrl(data);
  var titlesub = title[0].length>6?title[0].substr(0,6)+'...': title[0];
  var book = {
    title   : title[0],
    titlesub : titlesub,
    bookUrl : bookUrl,
    author  : author,
    summary : summary,
    imgUrl  : imgUrl
  }
  return book;
}

//提取出书籍书名
function extractToTitle(data) {
  //匹配出所有书籍的图书名
  var titlereg = new RegExp("class=\"clearfix stitle\">(.*?)</a>", "g");
  var all = [];
  var titles = data.match(titlereg);
  for (var i in titles) {
      var curlen = titles[i].length;
      all.push(titles[i].substring(24, curlen - 4));
  }
  return all;
}

//提取出书籍链接
function extractTobookUrl(data){ 
  //匹配出所有书籍的网页标签（详细信息）
  var bookUrlreg = new RegExp("href=\"(.*?)\" class=\"l mr10\">", "g");
  var allUrl = [];
  var booksUrl = data.match(bookUrlreg);
  for (var i in booksUrl) {
    var curlen = booksUrl[i].length;
    var firstIndex = booksUrl[i].indexOf('>');
    allUrl.push(booksUrl[i].substring(6, curlen-17));
  }
  // console.log(allUrl);
  return allUrl;
}

//提取出书籍作者
function extractToauthor(data) {
  //匹配出所有书籍的作者
  var authorUrlreg = new RegExp("作者：<a href=\"(.*?)\">(.*?)\</a>", "g");
  var allUrl = [];
  var authorsUrl = data.match(authorUrlreg);
  for (var i in authorsUrl) {
    var curlen = authorsUrl[i].length;
    var firstIndex = authorsUrl[i].indexOf('>');
    allUrl.push(authorsUrl[i].substring(firstIndex+1, curlen-4));
  }
  return allUrl;
}

//提取出书籍图片
function extractToimgUrl(data) {
  //匹配出所有书籍的图片
  var imgUrlreg = new RegExp("src=\"(.*?)\" alt", "g");
  var imgUrl = data.match(imgUrlreg);
  var curlen = imgUrl[0].length;
  imgUrl = imgUrl[0].substring(5, curlen - 5);
  return imgUrl;
}

//提取出书籍简介
function extractToSummary(data) {
  //匹配出所有书籍的作者
  var Summaryreg = new RegExp("class=\"c999 clearfix\">((.|\n)*?)<a", "g");
  var allUrl = [];
  var Summarys = data.match(Summaryreg);
  if (Summarys == null)
    return null;
  var curlen = Summarys[0].length;
  allUrl = getShort(Summarys[0].substring(23, curlen - 2));
  return allUrl;
}
// 段落聚集
function getShort(data){
  var temp = data.split('\n');
  var str = temp.join("");
  // console.log(str);
  return str;
}

function http(url, callback) {
  wx.request({
    url: url,
    header: {
      'content-type': 'application/xml' // 默认值
    },
    success: function (res) {
      callback(res.data);
    }
  })
}


//获取小说detail
function getNovelDetail(data){
  return {
    status : getNovelStatus(data),
    latestChapters:getLatestChapter(data)
  }
}
//获取小说状态：连载，完结...
function getNovelStatus(data){
  var reg = new RegExp("小说状态：</dt><dd>(.*?)</dd>");
  // var allUrl = [];
  var temp = data.match(reg);
  return temp === null ? null : temp[1];
}
//获取小说最新章节
function getLatestChapter(data){
  var latestchapters= [];
  var reg = new RegExp("<a class=\"poptext\"(.*?)</li>", "g");
  var temp = data.match(reg);
  if (temp == null)
    return null;
  for (var i in temp){
    latestchapters.push({
      url : getUrl(temp[i]),
      title: getLatestChaptername(temp[i]),
      time: getLatestChapterTime(temp[i])
    })
  }
  return latestchapters;
}


//获取章节的url
function getChapter(data){
  var reg = new RegExp("<a href=\"(.*?)\" class=\"reader\"");
  var chapterUrl = data.match(reg);
  return chapterUrl == null ? null : chapterUrl[1];
}

//获取章节url、name 章节列表
function getChapterList(data){
  var chapterRes = [];
  var reg = new RegExp("<li><a href=\"(.*?)\" title=\"(.*?)\">","g");
  var chapterList = data.match(reg);
  // console.log('chapterList',chapterList);
  var len = chapterList.length;

  for(var i=0; i<len; i++){
    chapterRes.push({
      url  : getUrl(chapterList[i]),
      name : getName(chapterList[i])
    });
  }
  return chapterRes;
}

function getUrl(data){
  var reg = new RegExp("href=\"(.*?)\"");
  var res = data.match(reg);
  if(res == null)
    return null;
  var len = res[0].length;  
  return res[0].substring(6, len-1);
}
function getLatestChaptername(data){
  var reg = new RegExp(">(.*?)</a>");
  var chaptername = data.match(reg);
  // console.log(chaptername);
  return chaptername != null ? chaptername[1]:null;
}
function getLatestChapterTime(data){
  var reg = new RegExp("</a>(.*?)</li>");
  var chaptertime = data.match(reg);
  // console.log(chaptertime);
  return chaptertime != null ? chaptertime[1] : null;
}


function getName(data){
  var reg = new RegExp("title=\"(.*?)\"");
  var res = data.match(reg);
  if(res == null)
    return null;
  var len = res[0].length-1;
  var title = res[0];
  reg = new RegExp("，共(.*?)字");
  var restemp = title.match(reg);
  if(restemp != null)
    len = title.lastIndexOf('，');
  return title.substring(7, len);
}

//提取章节内容
function getChapterContent(data){
  data = loseweightSpace(data);
  data = loseweightEnter(data);
  // console.log("now:",data);
  var reg = new RegExp("style5((.|\s|\n)*?)<[^>]+>([^<]+)",'g');
  var res = data.match(reg);
  // console.log('res:',res);
  if(res != null)
    return res[0].substring(18);
  return null;
}
//去除<br />、&nbsp;
function loseweightSpace(data) {
  data = data.replace(/&nbsp;/g, ' ');
  return data;
}
function loseweightEnter(data) {
  data = data.replace(/<br \/\>/g, '\n');
  return data;
}

function getDetailSummary(data){
  var reg = RegExp("介绍:((.|\n)*?)<br",'g');
  var res = data.match(reg);
  // console.log(res);
  if(res == null)
    return null;
  var len = res[0].length;
  var termin = loseweightSpace(res[0].substring(3,len-3));
  termin = loseweightEnter(termin);
  return termin;
}

//在章节中获取name
function getChapterName(data) {
  var reg = new RegExp("chapter_name(.*?);",'g');
  var res = data.match(reg);
  // console.log('res',res);
  if (res == null)
    return '';
  var len = res[0].length - 2;
  var start = res[0].lastIndexOf('.');
  var title = res[0].substring(start==-1?21:start, len);
  // console.log(title);
  return title;
}

module.exports = {
  extractToBooksContent : extractToBooksContent,
  combineBookContent    : combineBookContent,
  http                  : http,
  getNovelDetail        : getNovelDetail,
  getChapter            : getChapter,
  getChapterList        : getChapterList,
  getChapterContent     : getChapterContent,
  getDetailSummary      : getDetailSummary,
  getChapterName        : getChapterName
}