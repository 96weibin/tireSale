//假装我获取到的值
localStorage.userNumber = 'cstc\\182722';
localStorage.userName = '赵伟斌';
localStorage.userDepartment = '资讯部';
localStorage.userOffice = '自动化系统组';
alert('hah')
function Main(){
}
//原型上定义方法
/**
 * 根据 localstorage.lvOneMenuStatus  默认0
 * 
 * 来对 一级此单进行 单一 变class处理
 */
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
        $.post('http://127.0.0.1/tyresale/asp/sendOrder.asp',{status:4,absolutePage:absolutePage,pageSize:pageSize,value:value},function(res,status){
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
        $.post('http://127.0.0.1/tyresale/asp/sendOrder.asp',{status:1,absolutePage:absolutePage,pageSize:pageSize},function(res,status){
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
Main.prototype.sendOrderpageControl = function(json) {
    // console.log(json)
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
                    main.postSendOrder($('.searchSendOrder').val());
                }
            })
            $('.goNex').click(function(){
                if(Number(localStorage.searchAbsolutePage) === json.allPage) {
                    return
                } else {
                    localStorage.searchAbsolutePage = Number(localStorage.searchAbsolutePage) + 1;
                    console.log($('.searchSendOrder').val())

                    main.postSendOrder($('.searchSendOrder').val());
                }
            })
            $('.jump').click(function(){
                if($('.jumpTo').val() > json.allPage || $('.jumpTo').val() < 1) {
                    return
                } else{
                    localStorage.searchAbsolutePage = $('.jumpTo').val();
                    main.postSendOrder($('.searchSendOrder').val());
                }
            })
        } else if (localStorage.isSearch === 'false') { //按默认顺序取出 分页
            $('.goPre').click(function(){
                if(Number(localStorage.absolutePage) === 1) {
                    return
                } else {
                    localStorage.absolutePage = Number(localStorage.absolutePage) - 1;
                    main.postSendOrder();
                }
            })
            $('.goNex').click(function(){
                if(Number(localStorage.absolutePage) === json.allPage) {
                    return
                } else {
                    localStorage.absolutePage = Number(localStorage.absolutePage) + 1;
                    main.postSendOrder();
                }
            })
            $('.jump').click(function(){
                if($('.jumpTo').val() > json.allPage || $('.jumpTo').val() < 1) {
                    return
                } else{
                    localStorage.absolutePage = $('.jumpTo').val();
                    main.postSendOrder();
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
    $.post('http://127.0.0.1/tyresale/asp/sendOrder.asp',{Status:2,Invoice:oData.Invoice},function(res,status){
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
        } else if( !( /^\d{1,4}[-|/\\\.]\d{1,2}[-|/\\\.]\d{1,4}$/g.test($('.chengeTime').val()))){
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

            $.post('http://127.0.0.1/tyresale/asp/sendOrder.asp',
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
    console.log(res);
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
        main.sendOrderpageControl(json);
        
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
        $.post('http://127.0.0.1/tyresale/asp/sendOrder.asp',{status:4,absolutePage:absolutePage,pageSize:pageSize,value:value},function(res,status){
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
        console.log({status:1})
        $.post('http://127.0.0.1/tyresale/asp/storeManagement.asp',{status:1},function(res,status){
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
    console.log(json)
    if(json.code == 0) {
        let data = json.data;
        console.log(data)
        console.log(json.count)
        $('.sectionBody').html('');
        let allSizeArr = [];
        for(var i = 1; i <= json.count; i++) {
            let sizeStr = data[i].pral + '|' + data[i].size;
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


    }
    
}

/**1,1时查看 某类型轮胎的 详情 */
Main.prototype.checkTireInfo = function() {
    console.log('1,1时查看 某类型轮胎的 详情')
}
/**2,0时查看 销售订单列表  */
Main.prototype.checkSaleOrder = function() {
    
}


/**2,2 时新建 销售订单*/
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
    $('.sectionBody').html(`
    <div class="row oneTireType">
        <div class="col-lg-12">
            <div class="row getParam">
                <div class="col-lg-2 getPral">
                    <span>pral : </span>
                    <select>
                        
                    </select>
                </div>
                <div class="col-lg-2 getSize">
                    <span>size : </span>
                    <select>
                       
                    </select>
                </div>
            </div>
            <div class="row getTireInfo">
                <div class="col-lg-12">
                    <!-- 这个型号有2种库存 -->
                    <div class="row tireInfoTitle">
                        <div class="col-lg-2">
                            物流订单号
                        </div>
                        <div class="col-lg-2">
                            预设客户
                        </div>
                        <div class="col-lg-1">
                            预设单价
                        </div>
                        <div class="col-lg-1">
                            剩余数量
                        </div>
                        <div class="col-lg-2 col-lg-offset-1">
                            使用数量
                        </div>
                        <div class="col-lg-2">
                            实售单价
                        </div>
                        <div class="col-lg-1">
                            选中
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="row addRemark">
                <div class="col-lg-6">
                    <textarea>添加备注</textarea>
                </div>
                <div class="col-lg-6">
                    <div class="row">
                        <div class="col-lg-4">小计总数</div>
                        <div class="col-lg-4">小计总售价</div>
                        <div class="col-lg-4">小计总差价</div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    </div>`)
    $('.sectionFooter').html(`
    <div class="row newSaleOrderControl">
        <div class="col-lg-5 col-lg-offset-1">
            <div class="row">
                <div class="col-lg-4">累计数量</div>
                <div class="col-lg-4">累计总销售价</div>
                <div class="col-lg-4">累计总差价</div>
            </div>
            <div class="row">
                <div class="col-lg-4">350</div>
                <div class="col-lg-4">45000</div>
                <div class="col-lg-4">4000</div>
            </div>
        </div>
        <div class="col-lg-2 col-lg-offset-1 addTireType">添加型号</div>
        <div class="col-lg-2 col-lg-offset-1 submit">提交</div>
    </div>
    `)
    /** ajax 获取  所有的 pral 和 size 放入 select
     */
    let pralArr = main.fn.getParam('pral');
    let sizeArr = main.fn.getParam('size');
}


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
/**
 * 参数 param  判断是要获取  pral 还是 size
 *      value 若有则获取 是与之成对    的参数的值
 *             若没有则 获取  全部的 此参数
 */
Main.prototype.fn.getParam = function(param, value) {
    let oData = {};
    if (param === 'pral' && value) {
        console.log('查size：'+value+'对应的所有pral')
        oData = {status:1, param:'size', value:value};
    } else if (param === 'size' && value){
        console.log('查pral：'+value+'对应的所有size')
        oData = {status:1, param:'pral', value:value};
    } else if (param === 'pral' && !value) {
        console.log('查所有的pral')
        oData = {status:1, param:'pral', value:0};
    } else if (param === 'size' && !value) {
        console.log('查所有的size')
        oData = {status:1, param:'pral', value:0};
        
    }
    $.ajax({
        url : 'http://127.0.0.1/tyresale/asp/saleOrder.asp',
        type : 'post',
        async : false,
        data :oData,
        success : function(arguments) {
            console.log(arguments);
        }
    })
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

