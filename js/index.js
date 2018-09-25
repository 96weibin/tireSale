
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
            <div class="col-lg-2 col-lg-offset-8 col-sm-3 col-sm-offset-6 checkSendOrderHistory " data-page="0">
                查看历史发货订单
            </div>
            <div class="col-lg-2 col-sm-3 changeSendOrderInfo" data-page="1">
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
            <div class="col-lg-2 col-lg-offset-8 col-sm-3 col-sm-offset-6 storeBrowse " data-page="0">
                库存浏览
            </div>
            <div class="col-lg-2 col-sm-3 sizeInfo" data-page="1">
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
            <div class="col-lg-2 col-lg-offset-8 col-sm-3 col-sm-offset-6 checkSaleOrder " data-page="0">
                销售订单浏览
            </div>
            <div class="col-lg-2 col-sm-3 addSaleOrder" data-page="1">
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
        $.post('http://127.0.0.1/weboa/~D/tireSale/asp/main.asp',{status:0},function(res,status){
            if(status === 'success') {
                main.makeSendOrderBody(res);
            } else {
                console.log(status)
            }
        })
    } else if(localStorage.lvOneMenuStatus === '0' && localStorage.lvTwoMenuStatus === '1') {
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
        $.post('http://127.0.0.1/weboa/~D/tireSale/asp/main.asp',{status:0},function(res,status){
            if(status === 'success') {
                main.makeSendOrderBody(res);
            } else {
                console.log(status)
            }
        })
    } 
}
Main.prototype.makeSendOrderBody = function(res){
    let json = JSON.parse(res);
    // console.log(json);
    if(json.code === 0) {
        let count = json.count;
        let data = json.data;
        $('.sectionBody').html('');
        for(;count; count--){
            let SendOrderItem = document.createElement('div');

            //改成  更改class 的操作
            $(SendOrderItem).addClass('row value').html(`
            <div class="col-lg-2  col-md-2">
                <div>${data[count].Invoice}</div>
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
            </div>`).children().click(function(){
                location.href = '#'
            });
            // console.log(SendOrderItem)
            $('.sectionBody').append(SendOrderItem)
        }
    } else {
        console.log(json.err)
    }
}

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
