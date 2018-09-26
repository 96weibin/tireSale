
function Main(){
}
Main.prototype.initLvOneMenu =  function(){
    localStorage.lvOneMenuStatus = localStorage.lvOneMenuStatus || 0;
    // console.log(localStorage.lvOneMenuStatus)
    let lvOneMenuStatus = localStorage.lvOneMenuStatus;
    switch(lvOneMenuStatus){
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

}
Main.prototype.initLvTowMenu = function(){
    localStorage.lvTwoMenuStatus = localStorage.lvTwoMenuStatus || 0;
    switch (localStorage.lvOneMenuStatus) {
        case '0':
            $('.level-2-menu').html(`
            <div class="col-lg-2 col-lg-offset-8 col-sm-3 col-sm-offset-6 col-xs-6 checkSendOrderHistory " data-page="0">
                查看历史发货订单
            </div>
            <div class="col-lg-2 col-sm-3 col-xs-6 changeSendOrderInfo" data-page="1">
                发货订单状态维护
            </div>`)
            if(localStorage.lvTwoMenuStatus === "0") {
                $('.checkSendOrderHistory').addClass('menu2Checked');
            } else if (localStorage.lvTwoMenuStatus === "1") {
                $('.changeSendOrderInfo').addClass('menu2Checked');
            } else {
                console.log('localstorage lvTwoMenuStatus 出现 异常page')
            }

        break;
        case '1':
            $('.level-2-menu').html(`
            <div class="col-lg-2 col-lg-offset-8 col-sm-3 col-sm-offset-6 col-xs-6 storeBrowse " data-page="0">
                库存浏览
            </div>
            <div class="col-lg-2 col-sm-3 col-xs-6 sizeInfo " data-page="1">
                规格明细
            </div>`)
            if(localStorage.lvTwoMenuStatus === "0") {
                $('.storeBrowse').addClass('menu2Checked');
            } else if (localStorage.lvTwoMenuStatus === "1") {
                $('.sizeInfo').addClass('menu2Checked');
            } else {
                console.log('localstorage lvTwoMenuStatus 出现 异常page')
            }
        break;
        case '2':
            $('.level-2-menu').html(`
            <div class="col-lg-2 col-lg-offset-8 col-sm-3 col-sm-offset-6 col-xs-6 checkSaleOrder " data-page="0">
                销售订单浏览
            </div>
            <div class="col-lg-2 col-sm-3 col-xs-6 addSaleOrder" data-page="1">
                新建销售订单
            </div>`)
            if(localStorage.lvTwoMenuStatus === "0") {
                $('.checkSaleOrder').addClass('menu2Checked');
            } else if (localStorage.lvTwoMenuStatus === "1") {
                $('.addSaleOrder').addClass('menu2Checked');
            } else {
                console.log('localstorage lvTwoMenuStatus 出现 异常page')
            }
        break;
    }

}
Main.prototype.initTisPage = function(){
    if(localStorage.lvOneMenuStatus === '0' && localStorage.lvTwoMenuStatus === '0') {
        main.makeSendOrderList();
    } else if(localStorage.lvOneMenuStatus === '0' && localStorage.lvTwoMenuStatus === '1') {      
        main.checkSendOrderInfo();
    }
}
Main.prototype.makeSendOrderList = function(res){
    $('.search').html(`
    <div class="col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-3 col-sm-offset-9 inputBox">
    <input type="search" name="searchSendOrder">
    <img src="./img/search.png" alt="搜索">
    </div>`).css({display:'block'});
    $('.title').html(`
    <div class="col-lg-2 col-md-2 col-sm-12">
        <div>发票ID</div>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
        <div>from</div>
    </div>
    <div class="col-lg-2 col-md-2 col-md-6 col-xs-6">
        <div>to</div>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
        <div>出发时间</div>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
        <div>到达时间</div>
    </div>
    <div class="col-lg-2 col-md-2">
        <div>状态</div>
    </div>
    `)
    $('.sectionBody').html(`<img src="./img/wait.gif">`);
    $.post('http://127.0.0.1/tiresale/asp/main.asp',{status:1},function(res,status){
        if(status === 'success') {
            console.log(res)
            let json = JSON.parse(res);
            if(json.code === 0) {
                let count = json.count;
                let data = json.data;

                localStorage.oData = JSON.stringify(data[json.count]);
                //存储最后一个  order   因为要让后 添加的order 显示在上面
                $('.sectionBody').html('');
                for(;count; count--){
                    let SendOrderItem = document.createElement('div');

                    //改成  更改class 的操作
                    $(SendOrderItem).addClass('row value').html(`
                    <div class="col-lg-2  col-md-2">
                        <div data-count=${count}>${data[count].Invoice}</div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                        <div>${data[count].SendPlace}</div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                        <div>${data[count].ArrivePlace}</div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                        <div>${data[count].SendTime}</div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                        <div>${data[count].ArriveTime}</div>
                    </div>
                    <div class="col-lg-2 col-md-2 ">
                        <div>${data[count].Status}</div>
                    </div>`).click(function(){
                        let oData = data[$(this).children().eq(0).children().eq(0)[0].dataset.count];
                        // console.log(oData)
                        localStorage.lvTwoMenuStatus = 1;
                        localStorage.oData =  JSON.stringify(oData);
                        main.initLvTowMenu();
                        main.checkSendOrderInfo();
                    });
                    // console.log(SendOrderItem)
                    $('.sectionBody').append(SendOrderItem)
                }
            } else {
                console.log(json.err)
            }
            // localStorage.firstOrder = JSON.parse(res).data[1].Invoice;
            // console.log(JSON.parse(res).data[1].Invoice)
        } else {
            console.log(status)
        }
    })
}
Main.prototype.checkSendOrderInfo = function(){
    let oData = JSON.parse(localStorage.oData)
    
    $('.title').html(`
    <div class="col-lg-5">订单编号:${oData.Invoice}</div>
    <div class="col-lg-7">
        <div class="row">
            <div class="col-lg-2">客户</div>
            <div class="col-lg-2">pral</div>
            <div class="col-lg-2">size</div>
            <div class="col-lg-2">条</div>
            <div class="col-lg-2">单价</div>
            <div class="col-lg-2">总价</div>
        </div>
    </div>`);
    $('.search').css({display:'none'});

    $('.sectionBody').html(`
    <div class="row baseInfo">
        <div class="left col-lg-5">
            <div class="row value">
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">发货日期</div>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-6">${oData.SendTime}</div>
            </div>
            <div class="row value">
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">发货地址</div>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-6">${oData.SendPlace}</div>
            </div>
            <div class="row value">
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">收货地址</div>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-6">${oData.ArrivePlace}</div>
            </div>
            <div class="row">
                <div class="col-lg-5 order-status-title">维护订单状态</div>
            </div>
            <div class="row order-status">
                <div class="col-lg-2">状态 :</div>
                <div class="col-lg-10">
                    <select name="orderStatus" id="orderStatus">
                    </select>
                </div>
            </div>
            <div class="row orderTime">
                <div class="col-lg-2">时间 :</div>
                <div class="col-lg-10">
                    <input type="text" placeholder="请输入状态变更时间">
                </div>
            </div>
        </div>
        <div class="right col-lg-7">
            <div class="row tireClass">
                <div class="col-lg-12 tireClassInfo">
                    <img src="./img/wait.gif">
                </div>
            </div>
            <div class="row sum">
                <div class="col-lg-2">总计：</div>
                <div class="col-lg-4 col-lg-offset-2"><span class="sumNum"></span>条</div>
                <div class="col-lg-4"><span class="sumPrice"></span>元</div>
            </div>
                
                
        </div>
    </div>
    <div class="row remark">
        <div class="col-lg-10 ">
            <textarea name="remark" id="remark"  class="inp-text" placeholder></textarea>
        </div>
        <div class="col-lg-2">
            <div class="submit">确认更改</div>
        </div>
    </div>`);
    $('#orderStatus').html(main.fn.getOption(oData.Status));


    console.log({Status:2,Invoice:oData.Invoice});
    $.post('http://127.0.0.1/tiresale/asp/main.asp',{Status:2,Invoice:oData.Invoice},function(res,status){
       if(status === 'success'){
        let json = JSON.parse(res);
        if (json.code === 0) {
            let data = json.data;
            let count = json.count;
            let sumNum = 0;
            let sumPrice = 0;
            $('.tireClassInfo').html('');
            for( ;count;count--){
                sumNum += Number(data[count].Quantity);
                sumPrice += Number(data[count].Quantity) * Number(data[count].Price);
                let tireClassItem = document.createElement('div');
                tireClassItem.setAttribute('class','row value');
                tireClassItem.innerHTML = `
                <div class="col-lg-2">${data[count].Client}</div>
                <div class="col-lg-2">${data[count].Pral}</div>
                <div class="col-lg-2">${data[count].Size}</div>
                <div class="col-lg-2">${data[count].Quantity}</div>
                <div class="col-lg-2">${data[count].Price}</div>
                <div class="col-lg-2">${data[count].Quantity * data[count].Price} </div>`;
                $('.tireClassInfo').append(tireClassItem)
            }
            $('.sumNum').html(sumNum);
            $('.sumPrice').html(sumPrice);

        }
       }
        
    });
    // $('.sectionBody').html('');
}



Main.prototype.fn = {};

Main.prototype.fn.getOption = function(status){
    let oOption = [
        `<option value="0">加工完成</option>`,
        `<option value="1">装载完成</option>`,
        `<option value="2">完成发货</option>`,
        `<option value="3">在途</option>`,
        `<option value="4">运输到库</option>`,
        `<option value="5">卸载完成</option>`
    ];
    let res = ``;
    // console.log(status + '-----' + oOption.length)
    for(let i = status; i < oOption.length; i ++) {
        res += oOption[i]
    }
    // console.log(res);
    return res;
}
// Main.prototype.fn.numFormat = function(num){
    
// }
// Main.prototype.fn.moneyFormat = function(money){

// }

//new构造函数 然后执行 生成一级 目录 生成二级目录 生成默认 页面
var main = new Main();
main.initLvOneMenu();
main.initLvTowMenu();
main.initTisPage();

/**
 * 头部导航条 点击  单个变色
 * 生成二级菜单
 * 显示默认列表
 */
$('.level-1-menu').click(function(event){
    let navOneItem = $(event.target).not('.col-lg-2').not('.level-1-menu');
    navOneItem.addClass('menu1Checked').removeClass('menu1Default').parent().siblings().children().removeClass('menu1Checked').addClass('menu1Default');
    localStorage.lvOneMenuStatus = navOneItem[0].dataset.page;
    localStorage.lvTwoMenuStatus = '';
    main.initLvTowMenu();
    main.initTisPage();
})

$('.level-2-menu').click(function(){
    var navTowItem = $(event.target).not('.level-2-menu');
    navTowItem.addClass('menu2Checked').siblings().removeClass('menu2Checked');
    localStorage.lvTwoMenuStatus = navTowItem[0].dataset.page;
    main.initTisPage();
})
