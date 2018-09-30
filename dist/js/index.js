"use strict";

//假装我获取到的值
localStorage.userNumber = 'cstc\\182722';
localStorage.userName = '赵伟斌';
localStorage.userDepartment = '资讯部';
localStorage.userOffice = '自动化系统组';

function Main() {} //原型上定义方法

/**
 * 根据 localstorage.lvOneMenuStatus  默认0
 * 
 * 来对 一级此单进行 单一 变class处理
 */


Main.prototype.initLvOneMenu = function () {
  localStorage.lvOneMenuStatus = localStorage.lvOneMenuStatus || 0; // console.log(localStorage.lvOneMenuStatus)

  var lvOneMenuStatus = localStorage.lvOneMenuStatus;

  switch (lvOneMenuStatus) {
    case '0':
      $('.sendOrder').addClass('menu1Checked').parent().siblings().children().addClass('menu1Default');
      break;

    case '1':
      $('.storeStatus').addClass('menu1Checked').parent().siblings().children().addClass('menu1Default');
      break;

    case '2':
      $('.saleOrder').addClass('menu1Checked').parent().siblings().children().addClass('menu1Default');
      break;
  }
};
/**
 * 根据localstorage.lvOnemenu 生成二级菜单
 * localstorage.lvTowMenu（默认0） 更改 二级菜单 样式  （是否被选中）  
 * 
 */


Main.prototype.initLvTowMenu = function () {
  localStorage.lvTwoMenuStatus = localStorage.lvTwoMenuStatus || 0;

  switch (localStorage.lvOneMenuStatus) {
    case '0':
      $('.level-2-menu').html("\n            <div class=\"col-lg-2 col-lg-offset-8 col-sm-3 col-sm-offset-6 col-xs-6 checkSendOrderHistory \" data-page=\"0\">\n                \u67E5\u770B\u5386\u53F2\u53D1\u8D27\u8BA2\u5355\n            </div>\n            <div class=\"col-lg-2 col-sm-3 col-xs-6 changeSendOrderInfo\" data-page=\"1\">\n                \u53D1\u8D27\u8BA2\u5355\u72B6\u6001\u7EF4\u62A4\n            </div>");

      if (localStorage.lvTwoMenuStatus === "0") {
        $('.checkSendOrderHistory').addClass('menu2Checked');
      } else if (localStorage.lvTwoMenuStatus === "1") {
        $('.changeSendOrderInfo').addClass('menu2Checked');
      } else {
        console.log('localstorage lvTwoMenuStatus 出现 异常page');
      }

      break;

    case '1':
      $('.level-2-menu').html("\n            <div class=\"col-lg-2 col-lg-offset-8 col-sm-3 col-sm-offset-6 col-xs-6 storeBrowse \" data-page=\"0\">\n                \u5E93\u5B58\u6D4F\u89C8\n            </div>\n            <div class=\"col-lg-2 col-sm-3 col-xs-6 sizeInfo \" data-page=\"1\">\n                \u89C4\u683C\u660E\u7EC6\n            </div>");

      if (localStorage.lvTwoMenuStatus === "0") {
        $('.storeBrowse').addClass('menu2Checked');
      } else if (localStorage.lvTwoMenuStatus === "1") {
        $('.sizeInfo').addClass('menu2Checked');
      } else {
        console.log('localstorage lvTwoMenuStatus 出现 异常page');
      }

      break;

    case '2':
      $('.level-2-menu').html("\n            <div class=\"col-lg-2 col-lg-offset-8 col-sm-3 col-sm-offset-6 col-xs-6 checkSaleOrder \" data-page=\"0\">\n                \u9500\u552E\u8BA2\u5355\u6D4F\u89C8\n            </div>\n            <div class=\"col-lg-2 col-sm-3 col-xs-6 addSaleOrder\" data-page=\"1\">\n                \u65B0\u5EFA\u9500\u552E\u8BA2\u5355\n            </div>");

      if (localStorage.lvTwoMenuStatus === "0") {
        $('.checkSaleOrder').addClass('menu2Checked');
      } else if (localStorage.lvTwoMenuStatus === "1") {
        $('.addSaleOrder').addClass('menu2Checked');
      } else {
        console.log('localstorage lvTwoMenuStatus 出现 异常page');
      }

      break;
  }
};
/**
 * 根据 localstorage.lvOneMenuStatus 和 localstorage.lvTwoMenuStatus 
 * 进行不同页面的显示 执行不同函数的  逻辑 判断
 * 
 */


Main.prototype.initTisPage = function () {
  if (localStorage.lvOneMenuStatus === '0' && localStorage.lvTwoMenuStatus === '0') {
    main.makeSendOrderList();
  } else if (localStorage.lvOneMenuStatus === '0' && localStorage.lvTwoMenuStatus === '1') {
    main.checkSendOrderInfo();
  } else if (localStorage.lvOneMenuStatus === '1' && localStorage.lvTwoMenuStatus === '0') {}
};
/**
 * 0,0 生成 发货订单列表页
 * header 搜索框 keyup  enter  则 搜索 订单号相关的  订单 
 * sectionHeader 生成  订单内容   的标题   
 * 因为要 ajax请求  也面显示可能会有空白期   添加了  一个动态图  优化一下体验
 * 生成内容 main.postSendOrder()  公共方法  被提取出去
 */


Main.prototype.makeSendOrderList = function (res) {
  $('.search').html("\n    <div class=\"col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-3 col-sm-offset-9 inputBox\">\n    <input type=\"search\" name=\"searchSendOrder\" class=\"searchSendOrder\">\n    <img src=\"./dist/img/search.png\" alt=\"\u641C\u7D22\">\n    </div>").css({
    display: 'block'
  });
  $('.searchSendOrder').keyup(function (event) {
    // console.log(event)
    if (event.keyCode === 13) {
      main.postSendOrder($(this).val());
    }
  }); //初始化 默认显示的 按顺序拿出来的 订单

  localStorage.isSearch = 'false';
  $('.title').html("\n    <div class=\"col-lg-2 col-md-2 col-sm-12\">\n        <div>\u53D1\u7968ID</div>\n    </div>\n    <div class=\"col-lg-2 col-md-2 col-sm-6 col-xs-6\">\n        <div>from</div>\n    </div>\n    <div class=\"col-lg-2 col-md-2 col-md-6 col-xs-6\">\n        <div>to</div>\n    </div>\n    <div class=\"col-lg-2 col-md-2 col-sm-6 col-xs-6\">\n        <div>\u51FA\u53D1\u65F6\u95F4</div>\n    </div>\n    <div class=\"col-lg-2 col-md-2 col-sm-6 col-xs-6\">\n        <div>\u5230\u8FBE\u65F6\u95F4</div>\n    </div>\n    <div class=\"col-lg-2 col-md-2\">\n        <div>\u72B6\u6001</div>\n    </div>\n    ");
  $('.sectionBody').html("<img src=\"./dist/img/wait.gif\">");
  main.postSendOrder();
};
/**
 * 
 * @param {搜索值} value 
 */


Main.prototype.postSendOrder = function (value) {
  //初始化 absolutePage
  var absolutePage;

  if (localStorage.absolutePage !== 'undefined' && localStorage.absolutePage !== 'NaN' && localStorage.absolutePage !== undefined) {
    absolutePage = localStorage.absolutePage; // localStorage.absolutePage = absolutePage;

    console.log(absolutePage);
  } else {
    // absolutePage = 1;
    console.log(localStorage.absolutePage);
    absolutePage = localStorage.absolutePage = 1;
    console.log(absolutePage);
  }

  var pageSize = 10; //默认设置pageSize 为10
  // console.log({status:1,absolutePage:absolutePage,pageSize:pageSize})

  if (value) {
    if (localStorage.isSearch === 'false') {
      localStorage.isSearch = true;
      localStorage.searchAbsolutePage = 1;
    }

    absolutePage = localStorage.searchAbsolutePage;
    console.log({
      status: 4,
      absolutePage: absolutePage,
      pageSize: pageSize,
      value: value
    });
    $.post('http://127.0.0.1/tyresale/asp/sendOrder.asp', {
      status: 4,
      absolutePage: absolutePage,
      pageSize: pageSize,
      value: value
    }, function (res, status) {
      if (status === 'success') {
        // console.log(res)
        main.makeSendOrderBody(res); // localStorage.firstOrder = JSON.parse(res).data[1].Invoice;
        // console.log(JSON.parse(res).data[1].Invoice)
      } else {
        console.log(status);
      }
    });
  } else {
    localStorage.isSearch = false; // localStorage.searchAbsolutePage = 0;

    console.log({
      status: 1,
      absolutePage: absolutePage,
      pageSize: pageSize
    });
    $.post('http://127.0.0.1/tyresale/asp/sendOrder.asp', {
      status: 1,
      absolutePage: absolutePage,
      pageSize: pageSize
    }, function (res, status) {
      if (status === 'success') {
        // console.log(res)
        main.makeSendOrderBody(res); // localStorage.firstOrder = JSON.parse(res).data[1].Invoice;
        // console.log(JSON.parse(res).data[1].Invoice)
      } else {
        console.log(status);
      }
    });
  }
};

Main.prototype.sendOrderpageControl = function (json) {
  // console.log(json)
  if (json.allPage > 1) {
    //大于10条 显示分页条
    $('.sectionFooter').html("\n        <div class=\"row\">\n            <div class=\"col-lg-4 pageJump\">\n                <input type=\"text\" class=\"jumpTo\">\n                <button class=\"jump\">GO</button>\n            </div>\n            <div class=\"col-lg-4 pageControl\">\n                <div class=\"row\">\n                    <div class=\"col-lg-3 goPre\">\n                        \u2190--\n                    </div>\n                    <div class=\"col-lg-2\">".concat(localStorage.absolutePage, "</div>\n                    <div class=\"col-lg-2\">......</div>\n                    <div class=\"col-lg-2\">").concat(json.allPage, "</div>\n                        \n                    <div class=\"col-lg-3 goNex\">\n                        --\u2192\n                    </div>\n                </div>\n            </div>\n        </div>\n        ")).css({
      'border-top': '1px solid #ddd'
    });

    if (localStorage.isSearch === 'true') {
      //搜索结果 分页
      $('.goPre').click(function () {
        if (Number(localStorage.searchAbsolutePage) === 1) {
          return;
        } else {
          localStorage.searchAbsolutePage = Number(localStorage.searchAbsolutePage) - 1;
          main.postSendOrder($('.searchSendOrder').val());
        }
      });
      $('.goNex').click(function () {
        if (Number(localStorage.searchAbsolutePage) === json.allPage) {
          return;
        } else {
          localStorage.searchAbsolutePage = Number(localStorage.searchAbsolutePage) + 1;
          console.log($('.searchSendOrder').val());
          main.postSendOrder($('.searchSendOrder').val());
        }
      });
      $('.jump').click(function () {
        if ($('.jumpTo').val() > json.allPage || $('.jumpTo').val() < 1) {
          return;
        } else {
          localStorage.searchAbsolutePage = $('.jumpTo').val();
          main.postSendOrder($('.searchSendOrder').val());
        }
      });
    } else if (localStorage.isSearch === 'false') {
      //按默认顺序取出 分页
      $('.goPre').click(function () {
        if (Number(localStorage.absolutePage) === 1) {
          return;
        } else {
          localStorage.absolutePage = Number(localStorage.absolutePage) - 1;
          main.postSendOrder();
        }
      });
      $('.goNex').click(function () {
        if (Number(localStorage.absolutePage) === json.allPage) {
          return;
        } else {
          localStorage.absolutePage = Number(localStorage.absolutePage) + 1;
          main.postSendOrder();
        }
      });
      $('.jump').click(function () {
        if ($('.jumpTo').val() > json.allPage || $('.jumpTo').val() < 1) {
          return;
        } else {
          localStorage.absolutePage = $('.jumpTo').val();
          main.postSendOrder();
        }
      });
    }
  } else {
    $('.sectionFooter').html('');
  }
};
/** 0,1时
 * 查看 某个订单的 详细
 */


Main.prototype.checkSendOrderInfo = function () {
  $('.sectionFooter').html('').css({
    'border': 'none'
  });
  var oData = JSON.parse(localStorage.oData);
  $('.title').html("\n    <div class=\"col-lg-5\">\u8BA2\u5355\u7F16\u53F7:".concat(oData.Invoice, "</div>\n    <div class=\"col-lg-7\">\n        <div class=\"row\">\n            <div class=\"col-lg-2\">\u5BA2\u6237</div>\n            <div class=\"col-lg-2\">pral</div>\n            <div class=\"col-lg-2\">size</div>\n            <div class=\"col-lg-2\">\u6761</div>\n            <div class=\"col-lg-2\">\u5355\u4EF7</div>\n            <div class=\"col-lg-2\">\u603B\u4EF7</div>\n        </div>\n    </div>"));
  $('.search').css({
    display: 'none'
  });
  $('.sectionBody').html("\n    <div class=\"row baseInfo\">\n        <div class=\"left col-lg-5\">\n            <div class=\"row value\">\n                <div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-6\">\u53D1\u8D27\u65E5\u671F</div>\n                <div class=\"col-lg-8 col-md-8 col-sm-8 col-xs-6\">".concat(oData.SendTime, "</div>\n            </div>\n            <div class=\"row value\">\n                <div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-6\">\u53D1\u8D27\u5730\u5740</div>\n                <div class=\"col-lg-8 col-md-8 col-sm-8 col-xs-6\">").concat(oData.SendPlace, "</div>\n            </div>\n            <div class=\"row value\">\n                <div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-6\">\u6536\u8D27\u5730\u5740</div>\n                <div class=\"col-lg-8 col-md-8 col-sm-8 col-xs-6\">").concat(oData.ArrivePlace, "</div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-lg-5 order-status-title\">\u7EF4\u62A4\u8BA2\u5355\u72B6\u6001</div>\n            </div>\n            <div class=\"row order-status\">\n                <div class=\"col-lg-2\">\u72B6\u6001 :</div>\n                <div class=\"col-lg-10\">\n                    <select name=\"orderStatus\" id=\"orderStatus\">\n                    </select>\n                </div>\n            </div>\n            <div class=\"row orderTime\">\n                <div class=\"col-lg-2\">\u65F6\u95F4 :</div>\n                <div class=\"col-lg-10\">\n                    <input type=\"text\" class=\"chengeTime\" placeholder=\"\u8BF7\u8F93\u5165\u72B6\u6001\u53D8\u66F4\u65F6\u95F4\">\n                </div>\n            </div>\n        </div>\n        <div class=\"right col-lg-7\">\n            <div class=\"row tireClass\">\n                <div class=\"col-lg-12 tireClassInfo\">\n                    <img src=\"./dist/img/wait.gif\">\n                </div>\n            </div>\n            <div class=\"row sum\">\n                <div class=\"col-lg-2\">\u603B\u8BA1\uFF1A</div>\n                <div class=\"col-lg-4 col-lg-offset-2\"><span class=\"sumNum\"></span>\u6761</div>\n                <div class=\"col-lg-4\"><span class=\"sumPrice\"></span>\u5143</div>\n            </div>\n                \n                \n        </div>\n    </div>\n    <div class=\"row remark\">\n        <div class=\"col-lg-10 \">\n            <textarea name=\"remark\" id=\"remark\"  class=\"inp-text\" placeholder></textarea>\n        </div>\n        <div class=\"col-lg-2 submitwrapper\">\n        </div>\n    </div>\n    "));
  main.fn.showSubmit($('.submitwrapper'), oData.Status);
  /**根据status给下拉菜单添加 option */

  $('#orderStatus').html(main.fn.getOption(oData.Status)); // console.log({Status:2,Invoice:oData.Invoice});

  $.post('http://127.0.0.1/tyresale/asp/sendOrder.asp', {
    Status: 2,
    Invoice: oData.Invoice
  }, function (res, status) {
    if (status === 'success') {
      var json = JSON.parse(res);

      if (json.code === 0) {
        var data = json.data;
        var count = json.count;
        var sumNum = 0;
        var sumPrice = 0;
        $('.tireClassInfo').html('');

        for (; count; count--) {
          sumNum += Number(data[count].Quantity);
          sumPrice += Number(data[count].Quantity) * Number(data[count].Price);
          var tireClassItem = document.createElement('div');
          tireClassItem.setAttribute('class', 'row value');
          tireClassItem.innerHTML = "\n                <div class=\"col-lg-2\">".concat(data[count].Client, "</div>\n                <div class=\"col-lg-2\">").concat(data[count].Pral, "</div>\n                <div class=\"col-lg-2\">").concat(data[count].Size, "</div>\n                <div class=\"col-lg-2\">").concat(data[count].Quantity, "</div>\n                <div class=\"col-lg-2\">").concat(data[count].Price, "</div>\n                <div class=\"col-lg-2\">").concat(data[count].Quantity * data[count].Price, " </div>");
          $('.tireClassInfo').append(tireClassItem);
        } //待补充 将数量  金额格式化


        $('.sumNum').html(sumNum);
        $('.sumPrice').html(sumPrice);
      }
    }
  });
  $('.submit').click(function () {
    if ($('#orderStatus').val() == parseInt(oData.Status)) {
      alert('请维护下一状态');
      return;
    } else if (!/^\d{1,4}[-|/\\\.]\d{1,2}[-|/\\\.]\d{1,4}$/g.test($('.chengeTime').val())) {
      alert('请输入正确时间格式');
      return;
    } else {
      console.log({
        status: '3',
        changeStatus: $('#orderStatus').val(),
        changeTime: $('.chengeTime').val(),
        invoice: oData.Invoice,
        remark: $('#remark').val(),
        timeFlag: main.fn.getNow(),
        number: localStorage.userNumber,
        name: localStorage.userName,
        department: localStorage.userDepartment,
        office: localStorage.userOffice
      });
      $.post('http://127.0.0.1/tyresale/asp/sendOrder.asp', {
        status: '3',
        changeStatus: $('#orderStatus').val(),
        changeTime: $('.chengeTime').val(),
        invoice: oData.Invoice,
        remark: $('#remark').val(),
        timeFlag: main.fn.getNow(),
        number: localStorage.userNumber,
        name: localStorage.userName,
        department: localStorage.userDepartment,
        office: localStorage.userOffice
      }, function (res, status) {
        if (status === 'success') {
          var json = JSON.parse(res);

          if (json.code === 0) {
            alert('操作成功');
            localStorage.lvTwoMenuStatus = 0;
            main.initLvTowMenu();
            main.initTisPage();
          }
        }
      });
    }
  });
};

Main.prototype.makeSendOrderBody = function (res) {
  var json = JSON.parse(res);
  console.log(res);

  if (json.code === 0) {
    (function () {
      var count = json.count;
      var data = json.data;
      var statusStr = ['加工完成', '装载完成', '完成发货', '在途', '运输到库', '卸载完成']; // console.log(json)

      /**
       * 默认获取 本次返回 排在最上面的  即  最后存入数据库的  一条信息
       */

      localStorage.oData = JSON.stringify(data[1]); //存储最后一个  order   因为要让 后添加的order 显示在上面

      $('.sectionBody').html('');

      for (var i = 1; i <= count; i++) {
        var SendOrderItem = document.createElement('div'); //改成  更改class 的操作

        $(SendOrderItem).addClass('row value').html("\n            <div class=\"col-lg-2  col-md-2\">\n                <div data-count=".concat(i, ">").concat(data[i].Invoice, "</div>\n            </div>\n            <div class=\"col-lg-2 col-md-2 col-sm-6 col-xs-6\">\n                <div>").concat(data[i].SendPlace, "</div>\n            </div>\n            <div class=\"col-lg-2 col-md-2 col-sm-6 col-xs-6\">\n                <div>").concat(data[i].ArrivePlace, "</div>\n            </div>\n            <div class=\"col-lg-2 col-md-2 col-sm-6 col-xs-6\">\n                <div>").concat(data[i].SendTime, "</div>\n            </div>\n            <div class=\"col-lg-2 col-md-2 col-sm-6 col-xs-6\">\n                <div>").concat(data[i].ArriveTime, "</div>\n            </div>\n            <div class=\"col-lg-2 col-md-2 \">\n                <div>").concat(statusStr[data[i].Status], "</div>\n            </div>")).click(function () {
          /**
           * 预留第此页面一个的 data 供 查看详情时使用
           */
          var oData = data[$(this).children().eq(0).children().eq(0)[0].dataset.count]; // console.log(oData)

          localStorage.lvTwoMenuStatus = 1;
          localStorage.oData = JSON.stringify(oData);
          main.initLvTowMenu();
          main.checkSendOrderInfo();
        }); // console.log(SendOrderItem)

        $('.sectionBody').append(SendOrderItem);
      } //生成返回结果 控制 组件


      main.sendOrderpageControl(json);
    })();
  } else {
    console.log(json.err);
  }
}; //fn上设置函数库


Main.prototype.fn = {};

Main.prototype.fn.getOption = function (status) {
  var oOption = ["<option value=\"0\">\u52A0\u5DE5\u5B8C\u6210</option>", "<option value=\"1\">\u88C5\u8F7D\u5B8C\u6210</option>", "<option value=\"2\">\u5B8C\u6210\u53D1\u8D27</option>", "<option value=\"3\">\u5728\u9014</option>", "<option value=\"4\">\u8FD0\u8F93\u5230\u5E93</option>", "<option value=\"5\">\u5378\u8F7D\u5B8C\u6210</option>"];
  var res = ""; // console.log(status + '-----' + oOption.length)

  for (var i = status; i < oOption.length; i++) {
    res += oOption[i];
  } // console.log(res);


  return res;
};

Main.prototype.fn.replaceSpace = function (str) {
  return str.replace(/\s+/g, '');
};

Main.prototype.fn.showSubmit = function (parent, status) {
  if (status != '5') {
    parent.html("<div class=\"submit\">\u786E\u8BA4\u66F4\u6539</div>");
  } else {
    // console.log(oData.Status)
    parent.html("");
  }
};

Main.prototype.fn.getNow = function () {
  var str = '',
      now = new Date();
  str = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  return str;
}; // Main.prototype.fn.numFormat = function(num){
// }
// Main.prototype.fn.moneyFormat = function(money){
// }
//new构造函数 然后执行 生成一级 目录 生成二级目录 生成默认 页面
//每次刷新的时候执行


var main = new Main();
main.initLvOneMenu();
main.initLvTowMenu();
main.initTisPage();
/**
 * 头部导航条 点击  单个变色
 * 生成二级菜单
 * 显示默认列表
 */

$('.level-1-menu').click(function (event) {
  var navOneItem = $(event.target).not('.col-lg-2').not('.level-1-menu');
  navOneItem.addClass('menu1Checked').removeClass('menu1Default').parent().siblings().children().removeClass('menu1Checked').addClass('menu1Default');
  localStorage.lvOneMenuStatus = navOneItem[0].dataset.page;
  localStorage.lvTwoMenuStatus = '';
  main.initLvTowMenu();
  main.initTisPage();
});
$('.level-2-menu').click(function () {
  var navTowItem = $(event.target).not('.level-2-menu');
  navTowItem.addClass('menu2Checked').siblings().removeClass('menu2Checked');
  localStorage.lvTwoMenuStatus = navTowItem[0].dataset.page;
  main.initTisPage();
});