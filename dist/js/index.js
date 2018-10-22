//假装我获取到的值
localStorage.userNumber = 'cstc\\182722';
localStorage.userName = '赵伟斌';
localStorage.userDepartment = '资讯部';
localStorage.userOffice = '自动化系统组';
function Main(){
    this.checkedNum = 0;
    this.canSubmit = true;
    this.newSaleOrder = {};
    this.sotrePage = 1;
    
}
//原型上定义方法
/**
 * 根据 localstorage.lvOneMenuStatus  默认0
 * 来对 一级菜单进行 单一 变class处理
 */
Main.prototype.initLvOneMenu =  function(){
    localStorage.lvOneMenuStatus = localStorage.lvOneMenuStatus || 0;
    // console.log(localStorage.lvOneMenuStatus)
    let lvOneMenuStatus = localStorage.lvOneMenuStatus;
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
}
/**
 * 根据localstorage.lvOnemenu 生成二级菜单
 * localstorage.lvTowMenu（默认0） 更改 二级菜单 样式  （是否被选中）  
 * 
 */
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
/**
 * 根据 localstorage.lvOneMenuStatus 和 localstorage.lvTwoMenuStatus 
 * 进行不同页面的显示 执行不同函数的  逻辑 判断
 * 
 */
Main.prototype.initTisPage = function(){
    if(localStorage.lvOneMenuStatus === '0' && localStorage.lvTwoMenuStatus === '0') {
        main.makeSendOrderList();
    } else if(localStorage.lvOneMenuStatus === '0' && localStorage.lvTwoMenuStatus === '1') {      
        main.checkSendOrderInfo();
    } else if(localStorage.lvOneMenuStatus === '1' && localStorage.lvTwoMenuStatus === '0') {
        main.storeManagement();
    } else if(localStorage.lvOneMenuStatus === '1' && localStorage.lvTwoMenuStatus === '1') {
        main.checkTireInfo();
    } else if(localStorage.lvOneMenuStatus === '2' && localStorage.lvTwoMenuStatus === '0') {
        main.checkSaleOrder();
    } else if(localStorage.lvOneMenuStatus === '2' && localStorage.lvTwoMenuStatus === '1') {
        main.makeNewSaleOrder();
    }
}
/**
 * 0,0 生成 发货订单列表页
 * header 搜索框 keyup  enter  则 搜索 订单号相关的  订单 
 * sectionHeader 生成  订单内容   的标题   
 * 因为要 ajax请求  也面显示可能会有空白期   添加了  一个动态图  优化一下体验
 * 生成内容 main.postSendOrder()  公共方法  被提取出去
 */
Main.prototype.makeSendOrderList = function(res){
    $('.search').html(`
    <div class="col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-3 col-sm-offset-9 inputBox">
    <input type="search" name="searchSendOrder" class="searchSendOrder">
    <img src="./dist/img/search.png" alt="搜索">
    </div>`).css({display:'block'});
    $('.searchSendOrder').keyup(
       function(event){
        // console.log(event)
        if(event.keyCode === 13) {
            //在每次keyup的时候 将isSearch 设置为false   这样可以防止  
            //由于之前 搜索  翻页之后  再次搜索新内容  若isSearch 仍为true 可能出现 页码超出的bug
            //每次 enter isSearch 都会 初始为false  从而  searchAbsolutePage 每次都初始为1 
            localStorage.isSearch = false;
            main.postSendOrder($(this).val());
            console.log('世界真美好')
        }
       }
    );
    //初始化 默认显示的 按顺序拿出来的 订单
    localStorage.isSearch = 'false';
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
    $('.sectionBody').html(`<img src="./dist/img/wait.gif">`);
    $('.sectionFooter').html('');
    main.postSendOrder();
}
/**
 * 
 * @param {搜索值} value 
 */
Main.prototype.postSendOrder = function(value) {
    //初始化 absolutePage
    let absolutePage
    if(localStorage.absolutePage !== 'undefined' && localStorage.absolutePage !== 'NaN' && localStorage.absolutePage !== undefined) {
        absolutePage = localStorage.absolutePage;
        // localStorage.absolutePage = absolutePage;
        console.log(absolutePage)

    } else {
        // absolutePage = 1;
        console.log(localStorage.absolutePage)
        absolutePage = localStorage.absolutePage = 1;
        console.log(absolutePage)

    }
    let pageSize = 10;  //默认设置pageSize 为10
    // console.log({status:1,absolutePage:absolutePage,pageSize:pageSize})
    if(value){
        if(localStorage.isSearch === 'false') {
            localStorage.isSearch = true;
            localStorage.searchAbsolutePage = 1;
        }
        absolutePage = localStorage.searchAbsolutePage;
        console.log({status:4,absolutePage:absolutePage,pageSize:pageSize,value:value})
        $.post('http://127.0.0.1/tiresale/asp/sendOrder.asp',{status:4,absolutePage:absolutePage,pageSize:pageSize,value:value},function(res,status){
            if(status === 'success') {
                // console.log(res)
                main.makeSendOrderBody(res);
                // localStorage.firstOrder = JSON.parse(res).data[1].Invoice;
                // console.log(JSON.parse(res).data[1].Invoice)
            } else {
                console.log(status)
            }
        })

    } else {
        localStorage.isSearch = false;
        // localStorage.searchAbsolutePage = 0;
        console.log({status:1,absolutePage:absolutePage,pageSize:pageSize})
        $.post('http://127.0.0.1/tiresale/asp/sendOrder.asp',{status:1,absolutePage:absolutePage,pageSize:pageSize},function(res,status){
            if(status === 'success') {
                // console.log(res)
                main.makeSendOrderBody(res);
                // localStorage.firstOrder = JSON.parse(res).data[1].Invoice;
                // console.log(JSON.parse(res).data[1].Invoice)
            } else {
                console.log(status)
            }
        })
    }
}
//postSendOrder
Main.prototype.sendOrderpageControl = function(json, fun) {
    console.log(json)
    if(json.allPage > 1) {   //大于10条 显示分页条
        $('.sectionFooter').html(`
        <div class="row">
            <div class="col-lg-4 pageJump">
                <input type="text" class="jumpTo">
                <button class="jump">GO</button>
            </div>
            <div class="col-lg-4 pageControl">
                <div class="row">
                    <div class="col-lg-3 goPre">
                        ←--
                    </div>
                    <div class="col-lg-2">${localStorage.absolutePage}</div>
                    <div class="col-lg-2">......</div>
                    <div class="col-lg-2">${json.allPage}</div>
                        
                    <div class="col-lg-3 goNex">
                        --→
                    </div>
                </div>
            </div>
        </div>
        `).css({'border-top':'1px solid #ddd'})
        if(localStorage.isSearch === 'true') {  //搜索结果 分页
            $('.goPre').click(function(){
                if(Number(localStorage.searchAbsolutePage) === 1) {
                    return
                } else {
                    localStorage.searchAbsolutePage = Number(localStorage.searchAbsolutePage) - 1;
                    main[fun]($('.searchSendOrder').val());
                }
            })
            $('.goNex').click(function(){
                if(Number(localStorage.searchAbsolutePage) === json.allPage) {
                    return
                } else {
                    localStorage.searchAbsolutePage = Number(localStorage.searchAbsolutePage) + 1;
                    console.log($('.searchSendOrder').val())

                    main[fun]($('.searchSendOrder').val());
                }
            })
            $('.jump').click(function(){
                if($('.jumpTo').val() > json.allPage || $('.jumpTo').val() < 1) {
                    return
                } else{
                    localStorage.searchAbsolutePage = $('.jumpTo').val();
                    main[fun]($('.searchSendOrder').val());
                }
            })
        } else if (localStorage.isSearch === 'false') { //按默认顺序取出 分页
            $('.goPre').click(function(){
                if(Number(localStorage.absolutePage) === 1) {
                    return
                } else {
                    localStorage.absolutePage = Number(localStorage.absolutePage) - 1;
                    main[fun]();
                }
            })
            $('.goNex').click(function(){
                if(Number(localStorage.absolutePage) === json.allPage) {
                    return
                } else {
                    localStorage.absolutePage = Number(localStorage.absolutePage) + 1;
                    main[fun]();
                }
            })
            $('.jump').click(function(){
                if($('.jumpTo').val() > json.allPage || $('.jumpTo').val() < 1) {
                    return
                } else{
                    localStorage.absolutePage = $('.jumpTo').val();
                    main[fun]();
                }
            })
        }
    } else {
        $('.sectionFooter').html('');
    }
    
}
/** 0,1时
 * 查看 某个订单的 详细
 */
Main.prototype.checkSendOrderInfo = function(){
    $('.sectionFooter').html('').css({'border':'none'});
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
                    <input type="text" class="chengeTime" placeholder="请输入状态变更时间">
                </div>
            </div>
        </div>
        <div class="right col-lg-7">
            <div class="row tireClass">
                <div class="col-lg-12 tireClassInfo">
                    <img src="./dist/img/wait.gif">
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
        <div class="col-lg-2 submitwrapper">
        </div>
    </div>
    `);

    main.fn.showSubmit( $('.submitwrapper'),oData.Status);
    
    /**根据status给下拉菜单添加 option */
    $('#orderStatus').html(main.fn.getOption(oData.Status));
    // console.log({Status:2,Invoice:oData.Invoice});
    $.post('http://127.0.0.1/tiresale/asp/sendOrder.asp',{Status:2,Invoice:oData.Invoice},function(res,status){
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
            //待补充 将数量  金额格式化
            $('.sumNum').html(sumNum);
            $('.sumPrice').html(sumPrice);
        }
       }
        
    });
    $('.submit').click(function(){
        if($('#orderStatus').val() == parseInt(oData.Status)) {
            alert('请维护下一状态');
            return
        } else if( !( main.fn.testTime($('.chengeTime').val()))){
            alert('请输入正确时间格式');
            return
        } else {
            console.log({
                status:'3', 
                changeStatus:$('#orderStatus').val(),
                changeTime: $('.chengeTime').val(),
                invoice:oData.Invoice,
                remark:$('#remark').val(),
                timeFlag:main.fn.getNow(),
                number:localStorage.userNumber,
                name:localStorage.userName,
                department:localStorage.userDepartment,
                office: localStorage.userOffice
            })

            $.post('http://127.0.0.1/tiresale/asp/sendOrder.asp',
            {
                status:'3', 
                changeStatus:$('#orderStatus').val(),
                changeTime: $('.chengeTime').val(),
                invoice:oData.Invoice,
                remark:$('#remark').val(),
                timeFlag:main.fn.getNow(),
                number:localStorage.userNumber,
                name:localStorage.userName,
                department:localStorage.userDepartment,
                office: localStorage.userOffice
            },function(res,status){
                if(status === 'success') {
                    let json = JSON.parse(res);
                    if(json.code === 0) {
                        alert('操作成功');
                        localStorage.lvTwoMenuStatus = 0;
                        main.initLvTowMenu();
                        main.initTisPage();
                    }
                }
            })
        }
    })
}
Main.prototype.makeSendOrderBody = function(res) {
    let json = JSON.parse(res);
    // console.log(res);
    if(json.code === 0) {
        let count = json.count;
        let data = json.data;
        let statusStr = ['加工完成','装载完成','完成发货','在途','运输到库','卸载完成'];
        // console.log(json)
        /**
         * 默认获取 本次返回 排在最上面的  即  最后存入数据库的  一条信息
         */
        localStorage.oData = JSON.stringify(data[1]);
        //存储最后一个  order   因为要让 后添加的order 显示在上面
        $('.sectionBody').html('');
        for(let i = 1; i <= count; i++){
            let SendOrderItem = document.createElement('div');
            //改成  更改class 的操作
            $(SendOrderItem).addClass('row value').html(`
            <div class="col-lg-2  col-md-2">
                <div data-count=${i}>${data[i].Invoice}</div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                <div>${data[i].SendPlace}</div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                <div>${data[i].ArrivePlace}</div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                <div>${data[i].SendTime}</div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                <div>${data[i].ArriveTime}</div>
            </div>
            <div class="col-lg-2 col-md-2 ">
                <div>${statusStr[data[i].Status]}</div>
            </div>`).click(function(){
                /**
                 * 预留 此页面 第一个的 data 供 查看详情时使用
                 */
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
        //生成返回结果 控制 组件
        main.sendOrderpageControl(json, 'postSendOrder');
        
    } else {
        console.log(json.err)
    }
}
/**
 *  1, 0 时 查看仓库详情
 */
Main.prototype.storeManagement = function(){
    localStorage.removeItem('absolutePage');
    localStorage.removeItem('isSearch');
    localStorage.removeItem('searchAbsolutePage');
    localStorage.removeItem('oData');
    $('.sectionFooter').html('');
    $('.search').html(`
    <div class="col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-3 col-sm-offset-9 inputBox">
    <input type="search" name="searchSendOrder" class="searchSendOrder">
    <img src="./dist/img/search.png" alt="搜索">
    </div>`).css({display:'block'});
    //初始化 默认显示的 按顺序拿出来的 订单
    localStorage.isSearch = 'false';
    $('.title').html(`
    <div class="col-lg-2 col-md-2 col-sm-12">
        <div>Pral</div>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
        <div>Size</div>
    </div>
    <div class="col-lg-2 col-md-2 col-md-6 col-xs-6">
        <div>累计入库</div>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
        <div>累计销售</div>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
        <div>剩余数量</div>
    </div>
    <div class="col-lg-2 col-md-2">
        <div>查看详情</div>
    </div>
    `);
    $('.sectionBody').html(`<img src="./dist/img/wait.gif">`);
    main.getStoreInfo();
}
Main.prototype.getStoreInfo = function(value){

 //由于  在前端  排列是按照   pral size  所以 在前段  计算后分页   不需要 后端分页  不需要  absolutepage pagesize 等

    if(value){
        if(localStorage.isSearch === 'false') {
            localStorage.isSearch = true;
            localStorage.searchAbsolutePage = 1;
        }
        absolutePage = localStorage.searchAbsolutePage;
        console.log({status:4,absolutePage:absolutePage,pageSize:pageSize,value:value})
        $.post('http://127.0.0.1/tiresale/asp/sendOrder.asp',{status:4,absolutePage:absolutePage,pageSize:pageSize,value:value},function(res,status){
            if(status === 'success') {
                console.log(res)
                main.makeStoreBody(res);
                // localStorage.firstOrder = JSON.parse(res).data[1].Invoice;
                // console.log(JSON.parse(res).data[1].Invoice)
            } else {
                console.log(status)
            }
        })

    } else {
        localStorage.isSearch = false;
        $.post('http://127.0.0.1/tiresale/asp/storeManagement.asp',{status:1},function(res,status){
            if(status === 'success') {
                main.makeStoreBody(res);
            } else {
                console.log(status)
            }
        })
    }
}
Main.prototype.makeStoreBody = function(res){
    //由于前端 依靠  pral 和 size 进行排序 所以 前端分页  
    let json = JSON.parse(res);
    // console.log(json.data)
    if(json.code == 0) {
        let data = json.data;
        // console.log(json.count)
        $('.sectionBody').html('');
        let allSizeArr = [];
        for(var i = 1; i <= json.count; i++) {
            let sizeStr = data[i].pral + ',' + data[i].size;
            // console.log(data[i].quantity)
            if(allSizeArr[sizeStr] === undefined){
                allSizeArr[sizeStr] = parseInt(data[i].quantity);
                //类数组  根据 pral size 计算长度
                allSizeArr.length ++
            } else{
                allSizeArr[sizeStr] = parseInt(allSizeArr[sizeStr]) + parseInt(data[i].quantity);
            }
        }
        console.log(allSizeArr)
        //将pral size 与数量   遍历 添加进body
        //之后 ajax 请求  pral size 在sale info 表单里面 获取 销售数量  之后做减法  得到  剩余数量
        let pagesize = 10;
        let absolutePage = main.sotrePage;
        let count = 0;
        let qureyData = {'status':2};
        qureyData.pral="";
        qureyData.size="";
        var allArriveNumArr = [];
        var queryPralArr = [];
        var querySizeArr = [];
        //将 请求类数组的前10 位   返回 前10 位对应的数量
        localStorage.absolutePage = absolutePage;
        for(item in allSizeArr) {
            if((absolutePage-1)*pagesize <= count && count < absolutePage*pagesize) {
                console.log(count)
                qureyData.pral += "," + (item.split(',')[0]);
                queryPralArr.push(item.split(',')[0]);
                qureyData.size += "," + (item.split(',')[1]);
                querySizeArr.push(item.split(',')[1])

                allArriveNumArr.push(allSizeArr[item])
            }
            count ++
        }
        qureyData.pral = qureyData.pral.slice(1,qureyData.pral.length)
        qureyData.size = qureyData.size.slice(1,qureyData.size.length)
        // console.log(qureyData)
        // console.log(allArriveNumArr)
        // console.log(queryPralArr)
        // console.log(querySizeArr)
        $.post('http://127.0.0.1/tiresale/asp/storeManagement.asp',qureyData,function(res,msg){
            if(msg === 'success') {
                let json = JSON.parse(res)
                if(json.code === 0) {
                    
                    let data = json.data
                    console.log(data)
                    for (var i = 0; i < 10; i++) {
                        let storeItem = document.createElement('div');
                        storeItem.setAttribute('class','row value');
                        console.log(allArriveNumArr[i])
                        console.log(queryPralArr[i])
                        console.log(querySizeArr[i])
                        $(storeItem).html(`
                        <div class="col-lg-2  col-md-2">
                            <div>${queryPralArr[i]}</div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                            <div>${querySizeArr[i]}</div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                            <div>${allArriveNumArr[i]}</div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                            <div>${data[i].SaleNum}</div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                            <div>${allArriveNumArr[i] - data[i].SaleNum}</div>
                        </div>
                        <div class="col-lg-2 col-md-2 ">
                            <div><img src="./dist/img/info.png" class="checkInfo"></div>
                        </div>`);
                        $('.sectionBody').append($(storeItem))
                    }
                    
                    // main.sendOrderpageControl()

                } else {

                }
            } else {
                console.log(res)
            }
        })
            // $.post('http://127.0.0.1/tiresale/asp/storeManagement.asp',{status:2,pral:pral,size:size},function(res,msg){
            //     if(msg === 'success') {
            //         json = JSON.parse(res)
            //         console.log(json)
            //         if(json.code === 0) {
            //             let data = json.data
            //             console.log(data)
            //         }
            //         let storeItem = document.createElement('div');
            //         storeItem.setAttribute('class','row value');
            //         console.log(pral,size,num, data.num, num - data.num)
                    // $(storeItem).html(`
                    // <div class="col-lg-2  col-md-2">
                    //     <div>${pral}</div>
                    // </div>
                    // <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                    //     <div>${size}</div>
                    // </div>
                    // <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                    //     <div>${num}</div>
                    // </div>
                    // <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                    //     <div>${data.num}</div>
                    // </div>
                    // <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                    //     <div>${num - data.num}</div>
                    // </div>
                    // <div class="col-lg-2 col-md-2 ">
                    //     <div><img src="./dist/img/info.png" class="checkInfo"></div>
                    // </div>`);
                    // $('.sectionBody').append($(storeItem))
            //     } else {
            //         console.log(msg)
            //     }
            // })
    }
    
}

/**1,1时查看 某类型轮胎的 详情 */
Main.prototype.checkTireInfo = function() {
    console.log('1,1时查看 某类型轮胎的 详情')
}
/**2,0时查看 销售订单列表  */
Main.prototype.checkSaleOrder = function() {
    $('.search').html(`
    <div class="col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-3 col-sm-offset-9 inputBox">
    <input type="search" name="searchSendOrder" class="searchSendOrder">
    <img src="./dist/img/search.png" alt="搜索">
    </div>`).css({display:'block'});
    $('.searchSendOrder').keyup(
        function(event){
         // console.log(event)
         if(event.keyCode === 13) {
             //在每次keyup的时候 将isSearch 设置为false   这样可以防止  
             //由于之前 搜索  翻页之后  再次搜索新内容  若isSearch 仍为true 可能出现 页码超出的bug
             //每次 enter isSearch 都会 初始为false  从而  searchAbsolutePage 每次都初始为1 
             localStorage.isSearch = false;
             main.showAllSaleOrder($(this).val());
             console.log('世界真美好')
         }
        }
     );
     //初始化 默认显示的 按顺序拿出来的 订单
     localStorage.isSearch = 'false';
    $('.title').html(`
    <div class="col-lg-2 col-md-2 col-sm-12">
        <div>发票ID</div>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
        <div>时间</div>
    </div>
    <div class="col-lg-2 col-md-2 col-md-6 col-xs-6">
        <div>客户</div>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
        <div>销售数量</div>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
        <div>销售金额</div>
    </div>
    <div class="col-lg-2 col-md-2">
        <div>优惠/得利</div>
    </div>
    `)
    $('.sectionBody').html(`<img src="./dist/img/wait.gif">`);
    $('.sectionFooter').html('');
    localStorage.removeItem('absolutePage');
    localStorage.removeItem('tireTypeIndex');
    localStorage.removeItem('pral');
    localStorage.removeItem('size');
    localStorage.removeItem('oData');
    localStorage.removeItem('isSearch');
    
    main.showAllSaleOrder();
}


Main.prototype.showAllSaleOrder = function(value) {
    //初始化 absolutePage
    let absolutePage
    if(localStorage.absolutePage !== 'undefined' && localStorage.absolutePage !== 'NaN' && localStorage.absolutePage !== undefined) {
        absolutePage = localStorage.absolutePage;
        // localStorage.absolutePage = absolutePage;
        console.log(absolutePage)

    } else {
        // absolutePage = 1;
        // console.log(localStorage.absolutePage)
        absolutePage = localStorage.absolutePage = 1;
        // console.log(absolutePage)

    }
    let pageSize = 10;  //默认设置pageSize 为10
    // console.log({status:1,absolutePage:absolutePage,pageSize:pageSize})
    if(value){
        if(localStorage.isSearch === 'false') {
            localStorage.isSearch = true;
            localStorage.searchAbsolutePage = 1;
        }
        absolutePage = localStorage.searchAbsolutePage;
        console.log({status:5,absolutePage:absolutePage,pageSize:pageSize,value:value})
        $.post('http://127.0.0.1/tiresale/asp/saleOrder.asp',{status:5,absolutePage:absolutePage,pageSize:pageSize,value:value},function(res,status){
            if(status === 'success') {
                console.log(res)
                main.makeSaleOrderBody(res);
                // localStorage.firstOrder = JSON.parse(res).data[1].Invoice;
                // console.log(JSON.parse(res).data[1].Invoice)
            } else {
                console.log(status)
            }
        })

    } else {
        localStorage.isSearch = false;
        // localStorage.searchAbsolutePage = 0;
        console.log({status:6,absolutePage:absolutePage,pageSize:pageSize})
        $.post('http://127.0.0.1/tiresale/asp/saleOrder.asp',{status:6,absolutePage:absolutePage,pageSize:pageSize},function(res,status){
            if(status === 'success') {
                // console.log(res)
                main.makeSaleOrderBody(res);
                // localStorage.firstOrder = JSON.parse(res).data[1].Invoice;
                // console.log(JSON.parse(res).data[1].Invoice)
            } else {
                console.log(status)
            }
        })
    }
}
Main.prototype.makeSaleOrderBody = function(res){
    let json = JSON.parse(res);
    // console.log(res);
    if(json.code === 0) {
        let count = json.count;
        let data = json.data;
        console.log(data)
        /**
         * 默认获取 本次返回 排在最上面的  即  最后存入数据库的  一条信息
         */
        localStorage.oData = JSON.stringify(data[1]);
        //存储最后一个  order   因为要让 后添加的order 显示在上面
        $('.sectionBody').html('');
        for(let i = 1; i <= count; i++){
            let saleOrderItem = document.createElement('div');
            //改成  更改class 的操作
            $(saleOrderItem).addClass('row value').html(`
            <div class="col-lg-2  col-md-2">
                <div data-count=${i}>${data[i].SaleOrderId}</div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                <div>${data[i].SaleTime}</div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                <div>${data[i].Client}</div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                <div>${data[i].Quanitity}</div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                <div>${data[i].TotalPrice}</div>
            </div>
            <div class="col-lg-2 col-md-2 ">
                <div>${data[i].Cheap}</div>
            </div>`)
            $('.sectionBody').append(saleOrderItem)
        }
        //生成返回结果 控制 组件
        main.sendOrderpageControl(json,'showAllSaleOrder');
        
    } else {
        console.log(json.err)
    }
}

/**2,1 时新建 销售订单*/
Main.prototype.makeNewSaleOrder = function() {
    $('.search').css({'display':'none'});
    $('.title').html(`
    <div class="col-lg-2 col-md-2 col-sm-12">
        <input type="text" placeholder="发货订单id" class="saleOrderId">
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6">
        <input type="text" placeholder="销售客户" class="saleClient">
    </div>
    <div class="col-lg-2 col-md-2 col-md-6 col-xs-6">
        <input type="text" placeholder="销售时间" class="saleTime">
    </div>`)
    //默认 添加选择一种 轮胎类型  进行开单
    $('.sectionBody').html('');
    localStorage.tireTypeIndex = 1;
    main.addOneTypeTire(localStorage.tireTypeIndex);
    $('.sectionFooter').html(`
    <div class="row newSaleOrderControl">
        <div class="col-lg-5 col-lg-offset-1">
            <div class="row">
                <div class="col-lg-4">累计数量</div>
                <div class="col-lg-4">累计总销售价</div>
                <div class="col-lg-4">累计总差价</div>
            </div>
            <div class="row total">
                <div class="col-lg-4"></div>
                <div class="col-lg-4"></div>
                <div class="col-lg-4"></div>
            </div>
        </div>
        <div class="col-lg-2 col-lg-offset-1 addTireType">添加型号</div>
        <div class="col-lg-2 col-lg-offset-1 submit">提交</div>
    </div>
    `)
    localStorage.pral = '{}';
    localStorage.size = '{}';
    $('.addTireType').click(function(){
        localStorage.tireTypeIndex = parseInt(localStorage.tireTypeIndex) + 1;
        main.addOneTypeTire(localStorage.tireTypeIndex)
    });
    $('.submit').click(function(){
        if(main.canSubmit) {
            main.canSubmit = false;
            console.log(main.checkedNum)
            if (main.checkedNum === 0) {
                alert("请至少选中一个要开单的轮胎规格");
            } else {
                let saleOrderId = $('.saleOrderId').val();
                let realClient = $('.saleClient').val();
                let saleTime = $('.saleTime').val();

                let allQuanitity = main.fn.replaceSpace($('.total').children().eq(0)[0].innerHTML);
                // console.log(allQuanitity);
                let allPrice = main.fn.replaceSpace($('.total').children().eq(1)[0].innerHTML);
                let allCheap = main.fn.replaceSpace($('.total').children().eq(2)[0].innerHTML);
                $('.checked:checked').each(function(index,item){
                    let msg = JSON.parse(item.dataset.msg);
                    let realNum = $(item).parent().siblings().eq(5).children().val();
                    let realPrice = $(item).parent().siblings().eq(4).children().val();
                    let invoice = main.fn.replaceSpace($(item).parent().siblings().eq(0)[0].innerHTML);
                    let remark = $(item).parent().parent().parent().parent().siblings().eq(1).children().eq(0).children().val();
                    if(remark === '添加备注') {
                        remark = '';
                    }
                    console.log({
                        status:3,
                        saleOrderId:saleOrderId,
                        invoice:invoice,
                        pral:msg.pral,
                        size:msg.size,
                        quantity:realNum,
                        realPrice:realPrice,
                        remark:remark,
                        realClient:realClient,
                        prePrice:msg.prePrice,
                        preClient:msg.client,
                        saleTime:saleTime
                    })
                    $.post('http://127.0.0.1/tiresale/asp/saleOrder.asp',{
                        status:3,
                        saleOrderId:saleOrderId,
                        invoice:invoice,
                        pral:msg.pral,
                        size:msg.size,
                        quantity:realNum,
                        realPrice:realPrice,
                        remark:remark,
                        realClient:realClient,
                        prePrice:msg.prePrice,
                        preClient:msg.client,
                        saleTime:saleTime,
                    },function(res,msg){
                        if(msg === 'success') {
                            // console.log(msg)
                            // console.log(res)
                            
                        }
                    })
                })
                console.log({
                    status:4,
                    saleOrderId: saleOrderId,
                    saleTime:saleTime,
                    client:realClient,
                    allQuanitity:allQuanitity,
                    allPrice:allPrice,
                    allCheap:allCheap,
                    number:localStorage.userNumber,
                    department:localStorage.userDepartment,
                    name:localStorage.userName,
                    office: localStorage.userOffice,
                    timeFlag : main.fn.getNow()
                })
                
                $.post('http://127.0.0.1/tiresale/asp/saleOrder.asp',{
                    status:4,
                    saleOrderId: saleOrderId,
                    saleTime:saleTime,
                    client:realClient,
                    allQuanitity:allQuanitity,
                    allPrice:allPrice,
                    allCheap:allCheap,
                    number:localStorage.userNumber,
                    department:localStorage.userDepartment,
                    name:localStorage.userName,
                    office: localStorage.userOffice,
                    timeFlag : main.fn.getNow()
                },function(res,msg){
                    if(msg === 'success') {
                        localStorage.lvOneMenuStatus = 2;
                        localStorage.lvTwoMenuStatus = 0;
                        main.initLvTowMenu();
                        main.initTisPage();
                    }
                })
            }
            setTimeout(() => {
                main.canSubmit = true
            }, 3000);
        } else {
            return
        }
        
    })
};

Main.prototype.addOneTypeTire = function(index) {
    let oneTireType = document.createElement('div');
    oneTireType.setAttribute('class',`row oneTireType ${index}`);
    oneTireType.innerHTML = 
    `<div class="col-lg-12">
        <div class="row getParam">
            <div class="col-lg-2 getPral">
                <span>pral : </span>
                <select class="pral ">
                </select>
            </div>
            <div class="col-lg-2 getSize">
                <span>size : </span>
                <select class="size">
                </select>
            </div>
            <div class="col-lg-1 col-lg-offset-7">
                <img class="deleteOneType" src="http://127.0.0.1/tiresale/dist/img/close.png">
            </div>
        </div>
        <div class="row getTireInfo">
            <div class="col-lg-12 tireTitleContainer">
                <!-- 这个型号有2种库存 -->
                <div class="row tireInfoTitle">
                    <div class="col-lg-2 ">
                        物流订单号
                    </div>
                    <div class="col-lg-2">
                        预设客户
                    </div>
                    <div class="col-lg-1 ">
                        预设单价
                    </div>
                    <div class="col-lg-1 ">
                        剩余数量
                    </div>
                    <div class="col-lg-2 col-lg-offset-1">
                        实售单价
                    </div>
                    <div class="col-lg-2">
                        实售数量
                    </div>
                    <div class="col-lg-1">
                        选中
                    </div>
                </div>
            </div>
            <div class="col-lg-12 tireInfoContainer">
                <!--插入某类型轮胎 -->
            </div>
        </div>
        <div class="row addRemark">
            <div class="col-lg-6">
                <textarea class="remark">添加备注</textarea>
            </div>
            <div class="col-lg-6 ">
                <div class="row ">
                    <div class="col-lg-4">小计总数</div>
                    <div class="col-lg-4">小计总售价</div>
                    <div class="col-lg-4">小计总差价</div>
                </div>
                <div class="row subtotal">
                    <div class="col-lg-4"></div>
                    <div class="col-lg-4"></div>
                    <div class="col-lg-4"></div>
                </div>
            </div>
        </div>
    </div>`;
    $('.sectionBody').append(oneTireType);
    /** ajax 获取  所有的 pral 和 size 放入 select
     * 参数1   要获取的参数
     * 参数2   获取参数插入的  select 的class名
     */
    $('.'+ index + ' .deleteOneType').click(function(){
        $('.'+index).remove();
        let pralObj = JSON.parse(localStorage.pral);
        let sizeObj = JSON.parse(localStorage.size);
        delete pralObj[index];
        delete sizeObj[index];
        localStorage.pral = JSON.stringify(pralObj);
        localStorage.size = JSON.stringify(sizeObj);
        main.fn.getAllCheap();
        main.fn.getAllNum();
        main.fn.getAllPrice();
    })
    main.initParam('pral','pral',index)
    main.initParam('size','size',index)
    
}
/**
 * 参数 param  判断是要获取  pral 还是 size
 *      value 若有则获取 是与之成对    的参数的值
 *             若没有则 获取  全部的 此参数
 *  value 为  与param 的 不同的  参数的 值
 *  container 是当前参数  的父级 select的class
 *  index 是 轮胎类型的   最外层的  添加的一个用于区分的  class
 *  value 是  另一个参数  change 根据value 来的到对应  的这个参数的 option   有value 时  取消change事件绑定
 */

Main.prototype.initParam = function(param, container, index, value){
    let otherContainer = main.fn.getOtherContainer(container)
    main.newSaleOrder[index] = {};
    main.fn.getParam(param, container, index)
    $('.' + index + ' .' + container).change(function(){
        let localObj = JSON.parse(localStorage[container]);
        //当 出初始化后  其中一项进行改变之后   改变localstoragre  里面改变项对应的值
        localObj[index] = $('.'+ index +' .'+container).val();
        localStorage[container] = JSON.stringify(localObj);
        //记录 改变的参数 
        main.newSaleOrder[index][container] = $('.'+ index +' .'+container).val();
        console.log('主改变时记录  主改变的值'+main.newSaleOrder[index])
        // 生成 与之对应的另一个 param      传value
        main.fn.getParam(otherContainer, otherContainer,index, $('.'+ index +' .'+container).val());
    })
}
/**
 * 根据  localstorage 里的 parl 和 size  进行查询 
 * 所有 物流状态 》=4的  且 销售状态 <2 的 且 符合 parl 和 size 的
 * 
 * 页面显示   物流订单号 预设客户 预设价格 剩余数量    用户填入  使用数量  价格后  
 * 打勾   计算  差价 总和等
 */
Main.prototype.showAlltire = function (index) {
    let pral = JSON.parse(localStorage.pral)[index];
    let size = JSON.parse(localStorage.size)[index];
    // console.log({status:2,pral:pral,size:size})
    $.post('http://127.0.0.1/tiresale/asp/saleOrder.asp',{status:2,pral:pral,size:size},function(res,msg){
        if (msg === 'success') {
            // console.log(res)
            main.canChecked = false;

            let json = JSON.parse(res);
            if(json.code === 0) {
                let data = json.data;
                let count = json.count;
                // console.log(data)
                // console.log(count)
                $('.' + index + ' .tireInfoContainer').html('');
                for ( let i = 1; i <= count; i++) {
                    let tireItem = document.createElement('div');
                    let tireItemNum = 'tire' + i;
                    tireItem.setAttribute('class',`row tireInfo ${tireItemNum}`);
                    tireItem.innerHTML = `
                        <div class="col-lg-2">
                            ${data[i].Logistics}
                        </div>
                        <div class="col-lg-2">
                            ${data[i].Client}
                        </div>
                        <div class="col-lg-1 prePrice">
                        ${data[i].Price}
                        </div>
                        <div class="col-lg-1 residueNum">
                            ${data[i].Quantity}
                        </div>
                        <div class="col-lg-2 col-lg-offset-1">
                            <input type="number" class="salePrice">
                        </div>
                        <div class="col-lg-2">
                            <input type="number" class="saleQuantity">
                        </div>
                        <div class="col-lg-1" >
                            <input type="checkbox" class="checked" data-msg='{"logistics":"${data[i].Logistics}","client":"${data[i].Client}","prePrice":"${data[i].Price}","quantity":"${data[i].Quantity}","pral":"${pral}","size":"${size}"}'>
                        </div>
                    `;
                    $('.' + index + ' .tireInfoContainer').append(tireItem);
                    //数据添加完成  可以提交了
                    main.canChecked = true;
                    (function(){
                        $('.' + index + ' .'+ tireItemNum + ' .checked').click(function(){
                            if(main.canChecked) {
                                if($(this).prop("checked")){
                                    console.log("选中");
                                    if(! $('.saleOrderId').val()) {
                                        alert ("请输入销售订单id");
                                        main.fn.warning($('.saleOrderId')[0],$(this));
                                        return
                                    } else if(! $('.saleClient').val()) {
                                        alert("请输入销售客户");
                                        main.fn.warning($('.saleClient')[0],$(this));
                                        return
                                    } else if(! $('.saleTime').val()) {
                                        main.fn.warning($('.saleTime')[0],$(this));
                                        alert("请输入销售时间");
                                        return
                                    }else if(! main.fn.testTime($('.saleTime').val())){
                                        main.fn.warning($('.saleTime')[0],$(this));
                                        alert("请输入 如 2018-8-8 格式时间");
                                        return
                                    }else if(! $('.' + index +' .'+ tireItemNum + ' .salePrice').val()){
                                        main.fn.warning($('.' + index +' .'+ tireItemNum + ' .salePrice')[0],$(this));
                                        alert ("请输入销售金额");
                                        return
                                    } else if (Number($('.' + index +' .'+ tireItemNum + ' .salePrice').val()) != Number($('.' + index +' .'+ tireItemNum + ' .prePrice').html()) && $('.' + index +' .addRemark'+ ' .remark').val() === '添加备注' ) {
                                        // console.log(parseInt($('.' + index +' .'+ tireItemNum + ' .salePrice').val()))
                                        // console.log(parseInt(($('.' + index +' .'+ tireItemNum + ' .prePrice').html())))
                                        alert('销售单价与预设单价不符,请添加备注');
                                        main.fn.warning($('.' + index + ' .remark')[0],$(this));
                                        return
                                    } else if (! $('.' + index + ' .'+ tireItemNum + ' .saleQuantity').val()) {
                                        alert('请输入数量')
                                        main.fn.warning($('.' + index + ' .'+ tireItemNum + ' .saleQuantity')[0],$(this));
                                        return
                                    } else if (Number($('.' + index + ' .'+ tireItemNum + ' .saleQuantity').val()) > Number($('.' + index + ' .'+ tireItemNum + ' .residueNum').html())) {
                                        main.fn.warning($('.' + index + ' .'+ tireItemNum + ' .saleQuantity')[0],$(this));
                                        alert("数量超出请重新输入");
                                        $('.' + index + ' .'+ tireItemNum + ' .saleQuantity')[0].value = parseInt($('.' + index + ' .'+ tireItemNum + ' .residueNum').html());
                                        return 
                                    } 
                                    let subtotal = $('.' + index +' .addRemark .subtotal')[0];
                                    let beforeNum = $('.' + index + ' .'+ tireItemNum + ' .saleQuantity').val();
                                    let beforePrice = $('.' + index +' .'+ tireItemNum + ' .salePrice').val();
                                    let oCheckbox = $(this)
                                    let saleNum = Number($('.' + index + ' .'+ tireItemNum + ' .saleQuantity').val());
                                    let salePrice = Number($('.' + index + ' .'+ tireItemNum + ' .salePrice').val());
                                    main.fn.checked('checked',index, tireItemNum)

                                    $('.' + index + ' .'+ tireItemNum + ' .saleQuantity').change(function(){
                                        console.log('num change')
                                        main.checkedNum -= 1;
                                        subtotal.children[0].innerHTML = Number(subtotal.children[0].innerHTML) - beforeNum;
                                        subtotal.children[1].innerHTML = Number(subtotal.children[1].innerHTML) - beforeNum * beforePrice;
                                        subtotal.children[2].innerHTML = Number(subtotal.children[2].innerHTML) - (salePrice * saleNum - beforePrice * beforeNum )
                                        main.fn.getAllNum();
                                        main.fn.getAllPrice();
                                        main.fn.getAllCheap();
                                        oCheckbox.prop('checked',false);
                                        $('.' + index +' .'+ tireItemNum + ' .salePrice').unbind()
                                        $('.' + index + ' .'+ tireItemNum + ' .saleQuantity').unbind();

                                    })
                                    $('.' + index +' .'+ tireItemNum + ' .salePrice').change(function(){
                                        console.log('price change')
                                        main.checkedNum -= 1;
                                        subtotal.children[0].innerHTML = Number(subtotal.children[0].innerHTML) - beforeNum;
                                        subtotal.children[1].innerHTML = Number(subtotal.children[1].innerHTML) - beforeNum * beforePrice;
                                        subtotal.children[2].innerHTML = Number(subtotal.children[2].innerHTML) - (salePrice * saleNum - beforePrice * beforeNum )
                                        main.fn.getAllNum();
                                        main.fn.getAllPrice();
                                        main.fn.getAllCheap();
                                        oCheckbox.prop('checked',false);
                                        $('.' + index +' .'+ tireItemNum + ' .salePrice').unbind()
                                        $('.' + index + ' .'+ tireItemNum + ' .saleQuantity').unbind();
                                    })
                                } else {
                                    //取消选中
                                    main.fn.checked('unChecked', index, tireItemNum)
                                }
                            } else {
                                alert('请稍等 。。。等待数据查询')
                            }
                        })

                    })()
                    
                }
            }
        }
    })
}
// {"code":0,"data":{"1":{"Logistics":"no:0000001","Client":"mask","Quantity":"500","Price":"350",}},"count":1}


//fn上设置函数库
Main.prototype.fn = {};
Main.prototype.fn.getOption = function (status) {
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
Main.prototype.fn.replaceSpace = function (str){
    return str.replace(/\s+/g,'')
}
Main.prototype.fn.showSubmit = function (parent, status) {
    if(status != '5') {
        parent.html(`<div class="submit">确认更改</div>`);
    } else {
        // console.log(oData.Status)
        parent.html(``);
    }
}
Main.prototype.fn.getNow = function() {
    let str = '',
        now = new Date();
    str = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    return str
}
Main.prototype.fn.getOtherContainer = function(container){
    if(container === 'pral') {
        return 'size';
    } else if (container === 'size') {
        return 'pral';
    } else {
        return 'container param error';
    }
}
//第一次 没有value 初始化  两个param   点击改变之后  传 param 获取 


//有 value 传入的是  参数b 容器b   参数a的值
//ajax 返回 包含所有倒库 与参数a成对 的 参数b 的一个对象
Main.prototype.fn.getParam = function(param, container, index, value){
    console.log('param::::' + param + '----container::::' + container + '----index::::' + index + '----value::::' + value)
    //size size 1 pral的值
    //newSaleOrder  是为了获取  判断 阻止 pral,size 参数对重复
    // console.log(main.newSaleOrder)
    let oData = {};
    // console.log(param, container, value)
    // console.log(param === 'pral')
    if (param === 'pral' && value) {
        // console.log('查size：'+value+'对应的所有pral')
        oData = {status:1, param:'pral', value:value};
    } else if (param === 'size' && value){
        // console.log('查pral：'+value+'对应的所有size')
        oData = {status:1, param:'size', value:value};
    } else if (param === 'pral' && !value) {
        // console.log('查所有的pral')
        oData = {status:1, param:'pral', value:0};
    } else if (param === 'size' && !value) {
        // console.log('查所有的size')
        oData = {status:1, param:'size', value:0};
    }
    // console.log(oData);
    $.ajax({
        url : 'http://127.0.0.1/tiresale/asp/saleOrder.asp',
        type : 'post',
        async : true,
        data :oData,
        success : function(res,msg) {
            console.log(res)
            if(msg === 'success') {
                let json = JSON.parse(res)
                let paramArr = [];
                if(json.code === 0) {
                    $('.'+ index +' .' + container).html('');
                    // console.log($('.'+ index +' .' + container))
                    let data = json.data;
                    // console.log(data)
                    // console.log($('.' + index +' .' +container)[0]);

                    for(var i = 1; i <= json.count; i ++) {
                        if(paramArr.indexOf(data[i][param]) === -1){
                            paramArr.push(data[i][param])
                        }
                        // console.log(paramItem)
                        // console.log($('.'+container))
                    }
                    console.log(paramArr)
                    for(var i = 0; i < paramArr.length; i++) {
                        let paramItem = document.createElement('option');
                        // // console.log(data[i][param])
                        paramItem.innerHTML = paramArr[i];
                        paramItem.value =  paramArr[i];
                        $('.' + index +' .' +container).append(paramItem);
                    }
                    //如果在 localstorage.newSaleOrder 里面没有重复则 设置localStorage 与 index 相关
                    let localObj = JSON.parse(localStorage[param])
                    localObj[index] = $('.' + index +' .' +container).val();
                    main.newSaleOrder[index][param] = $('.' + index +' .' +container).val();

                    //有无 value 都是  的到  要改变的那个量 以及其改变后的值
                    console.log('主改变 得到附的：'+ param + JSON.stringify(main.newSaleOrder[index]));
                    // console.log(localObj)
                    localStorage[param] = JSON.stringify(localObj);
                    //有value 的才会生成  所以
                    if(value) {
                        //主改变后  取消 附的 事件  赋予新事件
                        $('.'+ index +' .' + param).unbind();
                        $('.'+ index +' .' + param).change(function(){

                            let localObj = JSON.parse(localStorage[param]);
                            localObj[index] = $('.' + index +' .' + param).val();
                            main.newSaleOrder[index][param] = $('.' + index +' .' + param).val();
                            console.log( main.newSaleOrder[index]);
                            localStorage[param] = JSON.stringify(localObj)
                            let count = 0;
                            for(var item in main.newSaleOrder) {
                                let otherParam = main.fn.getOtherContainer(param);
                                // console.log('有value item---------' + JSON.stringify(main.newSaleOrder[item]))
                                let nowParamValue = $('.' + index +' .' +container).val();
                                console.log(main.newSaleOrder[item][param] == nowParamValue )
                                console.log(main.newSaleOrder[item][otherParam] == value)
                                if(main.newSaleOrder[item][param] == nowParamValue  && main.newSaleOrder[item][otherParam] == value) {
                                    count ++
                                    console.log(count)
                                    if(count > 1) {
                                        alert ('此型号已选择请选择其他型号')
                                        $('.' + index + ' .tireInfoContainer').html('');
                                        return
                                    }
                                } else {
                                    console.log(main.newSaleOrder[item][param] + '!==' + nowParamValue )
                                    console.log(main.newSaleOrder[item][otherParam] + '!==' + value)
                                }
                            }
                            main.showAlltire(index)
                            //ajax 请求回来数据 之后生成页面
                        })
                        //主改变  时 判断  是否重复  从而 是否返回  生成 符合此类型轮胎的 页面的一部分
                        let count = 0;
                        for(var item in main.newSaleOrder) {
                            let otherParam = main.fn.getOtherContainer(param);
                            // console.log('有value item---------' + JSON.stringify(main.newSaleOrder[item]))
                            let nowParamValue = $('.' + index +' .' +container).val();
                            console.log('flag-----------'+ (main.newSaleOrder[item][param] == nowParamValue ))
                            console.log('flag-----------'+(main.newSaleOrder[item][otherParam] == value))
                            if(main.newSaleOrder[item][param] == nowParamValue  && main.newSaleOrder[item][otherParam] == value) {
                                count ++
                                console.log(count)
                                if(count > 1) {
                                    alert ('此型号已选择请选择其他型号')
                                    $('.' + index + ' .tireInfoContainer').html('');
                                    return
                                }
                            }
                        }
                        main.showAlltire(index)
                        
                        
                    } else {
                        // localStorage.unchange = false;
                    }
                    
                } else {
                    console.log('返回数据error');
                }
            }
        }
    })
    
}
Main.prototype.fn.testTime = function(time){
    // console.log(time)
    let res = /^\d{1,4}[-|/\\\.\/]\d{1,2}[-|/\\\.\/]\d{1,4}$/g.test(time);
    // console.log(res)
    return res
}
Main.prototype.fn.warning = function (dom,checked) {
    dom.focus();
    checked.prop('checked',false);
}
Main.prototype.fn.checked = function(status, index, tireItemNum){
    let subtotal = $('.' + index +' .addRemark .subtotal')[0];
    let saleNum = Number($('.' + index + ' .'+ tireItemNum + ' .saleQuantity').val());
    let salePrice = Number($('.' + index + ' .'+ tireItemNum + ' .salePrice').val());
    let prePrice = Number($('.' + index +' .'+ tireItemNum + ' .prePrice').html());
    if(status === 'checked') {
        main.checkedNum += 1;
        subtotal.children[0].innerHTML = Number(subtotal.children[0].innerHTML) + saleNum;
        subtotal.children[1].innerHTML = Number(subtotal.children[1].innerHTML) + saleNum * salePrice;
        subtotal.children[2].innerHTML = Number(subtotal.children[2].innerHTML) + (salePrice * saleNum - prePrice * saleNum );
        main.fn.getAllNum();
        main.fn.getAllPrice();
        main.fn.getAllCheap()
    } else {
        main.checkedNum -= 1;
        subtotal.children[0].innerHTML = Number(subtotal.children[0].innerHTML) - saleNum;
        subtotal.children[1].innerHTML = Number(subtotal.children[1].innerHTML) - saleNum * salePrice;
        subtotal.children[2].innerHTML = Number(subtotal.children[2].innerHTML) - (salePrice * saleNum - prePrice * saleNum )
        // $('.total')[0].children[0].innerHTML = main.fn.getAllNum();
        // $('.total')[0].children[1].innerHTML = main.fn.getAllPrice();
        // $('.total')[0].children[2].innerHTML = main.fn.getAllCheap()
        main.fn.getAllNum();
        main.fn.getAllPrice();
        main.fn.getAllCheap();
    }
}
Main.prototype.fn.getAllNum = function(){
    let allNum,len, subtotal;
    subtotal = document.getElementsByClassName('subtotal');
    allNum = 0;
    len = subtotal.length;
    for (var i = 0; i < len; i++) {
        allNum += Number(subtotal[i].children[0].innerHTML);
    }
    $('.total')[0].children[0].innerHTML = allNum;
}
Main.prototype.fn.getAllPrice = function(){
    let allPrice,len, subtotal;
    allPrice = 0;
    subtotal = document.getElementsByClassName('subtotal');
    len = $('.subtotal').length;
    for (var i = 0; i < len; i++) {
        allPrice += Number(subtotal[i].children[1].innerHTML);
    }
    $('.total')[0].children[1].innerHTML = allPrice;
}
Main.prototype.fn.getAllCheap = function(){
    let AllCheap,len, subtotal;
    subtotal = document.getElementsByClassName('subtotal');
    AllCheap = 0;
    len = $('.subtotal').length;
    for (var i = 0; i < len; i++) {
        AllCheap += Number(subtotal[i].children[2].innerHTML);
    }
    $('.total')[0].children[2].innerHTML = AllCheap;
}
// Main.prototype.fn.numFormat = function(num){
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
$('.level-1-menu').click(function(event){
    var navOneItem = $(event.target).not('.col-lg-2').not('.level-1-menu');
    navOneItem.addClass('menu1Checked').removeClass('menu1Default').parent().siblings().children().removeClass('menu1Checked').addClass('menu1Default');
    localStorage.lvOneMenuStatus = navOneItem[0].dataset.page;
    localStorage.lvTwoMenuStatus = '';
    main.initLvTowMenu();
    main.initTisPage();
})
$('.level-2-menu').click(function(event){
    let navTowItem = $(event.target).not('.level-2-menu');
    navTowItem.addClass('menu2Checked').siblings().removeClass('menu2Checked');
    localStorage.lvTwoMenuStatus = navTowItem[0].dataset.page;
    main.initTisPage();
})
// console.log($('.deleteOneType'))
// $('.deleteOneType').click(function(){
//     alert("世界真美好!");
// })
// $('.deleteOneType').unbind();