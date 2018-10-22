# tireSell

use jquery asp sqlServer trace tire sell

## 第一天 画思维导图 分析需求 设计 数据库

![icon](https://github.com/96weibin/tireSell/blob/master/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE/%E8%BD%AE%E8%83%8E%E8%B7%9F%E8%B8%AA-%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE.png)

## 第二天 用墨刀 画 业务逻辑

<https://modao.cc/app/vqjW7PaLQerktgnIJKBw75UQhTuuyRl>

## 第三天 开发


    竟然在 vbScript 里面  "0"   是  false
    而 在js 中  "0"  为true

    cBool 函数  只能判断 数字字符串  不能判断是不是   传别的字符串  回 报错。。。。
    而且  if 里面判断   不能将字符串 直接放上去进行判断    会报   类型错误
    所以判断  的时候  可以用   not(key = "" or value = "")   