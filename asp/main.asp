<%@ language="vbscript" codepage="65001"%>
<!--#include file="./connect.asp"-->

<%
dim Status, RequireJsonStr, Count

Status = Request.FORM("status")
	If Status = 0 Then
		' 状态0查发货订单
		set Rs = server.createObject("adodb.recordset")
		Rs.open "SELECT Id, Invoice, SendPlace, ArrivePlace, Status, SendTime, ArriveTime FROM P_TyreSellLogistics",Conn,3,1
		If Not (Rs.Bof and Rs.Eof) Then
		'Rs.PageSize = 5
		'allPage = Rs.pageCount
		'Rs.Absolutepage = page
		Count = 1
		RequireJsonStr = "{""code"":0,""data"":{"
		Do While not(Rs.Bof or Rs.Eof)
			RequireJsonStr = RequireJsonStr & """"&count&""":{""Invoice"":"""&Rs("Invoice")&""",""SendPlace"":"""& Rs("SendPlace") &""",""ArrivePlace"":"""&Rs("ArrivePlace")&""",""Status"":"""& Rs("Status") &""",""SendTime"":"""& Rs("SendTime") &""",""ArriveTime"":"""&Rs("ArriveTime")& """},"
			count = count + 1
			Rs.movenext
		Loop
		RequireJsonStr = left(RequireJsonStr,len(RequireJsonStr) - 1)
		response.write RequireJsonStr &"},""count"":"&count-1&"}"
		Rs.Close
		set Rs = Nothing
		Else
			response.write " { ""code"":""1"",""msg"":""无数据"" } "
		END IF
	Else
		' false
	End if
	

	

%>