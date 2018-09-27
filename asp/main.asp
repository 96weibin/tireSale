<%@ language="vbscript" codepage="65001"%>

<!--#include file="./connect.asp"-->
<%
	dim Status, RequireJsonStr, Count
	Status = Request.FORM("status")
	If Status = 1 Then
		' 状态1查发货订单
		set Rs = server.createObject("adodb.recordset")
		Rs.open "SELECT Invoice, SendPlace, ArrivePlace, Status, SendTime, ArriveTime FROM P_TyreSaleLogistics",Conn,3,1
		If Not (Rs.Bof and Rs.Eof) Then
			Count = 1
			RequireJsonStr = "{""code"":0,""data"":{"
			Do While not(Rs.Bof or Rs.Eof)
				RequireJsonStr = RequireJsonStr&""""&count&""":{""Invoice"":"""&Rs("Invoice")&""",""SendPlace"":"""& Rs("SendPlace") &""",""ArrivePlace"":"""&Rs("ArrivePlace")&""",""Status"":"""& Rs("Status") &""",""SendTime"":"""& Rs("SendTime") &""",""ArriveTime"":"""&Rs("ArriveTime")& """},"
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
	ElseIF Status = 2 Then
		' 状态2查看 invoice 发货订单 详情
		dim Logistics
		Logistics = Request.FORM("Invoice")
		set Rs = server.createObject("adodb.recordset")
		Rs.open "SELECT   Logistics, Client, Pral, Size, Price, Quantity, Status FROM P_TyreSaleClass WHERE (Logistics = '"& Logistics &"')",Conn,3,1
		If Not (Rs.Bof and Rs.Eof) Then
			Count = 1
			RequireJsonStr = "{""code"":0,""data"":{"
			Do While not(Rs.Bof or Rs.Eof)
				RequireJsonStr = RequireJsonStr&""""&count&""":{""Logistics"":"""&Rs("Logistics")&""",""Client"":"""&Rs("Client")&""",""Pral"":"""&Rs("pral")&""",""Size"":"""&Rs("Size")&""",""Quantity"":"""&Rs("Quantity")&""",""Status"":"""&Rs("Status")&""",""Price"":"""&Rs("Price")&"""},"
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
	ElseIF status =3 Then
		dim changeStatus, Invoice
		ChangeStatus = Request.FORM("changeStatus")
		Invoice = Request.FORM("Invoice")
		Number = Request.Number("Number")
		Name = Request.FORM("Name")
		Department = Request.FORM("Department")
		Office = Request.FROM("office")
		TimeFlag = Request.FORM("TimeFlag")
		Remark = Request.FORM("Remark")
		
		' response.write(ChangeStatus,Invoice)
		Conn.Execute "Update P_TyreSaleLogistics Set Status = '"& ChangeStatus &"'   Where Invoice = '"& Invoice &"'"
		
		'添加  更改状态记录
		Conn.Execute "Insert Into P_TyreSaleSendOrderOperationLog (Invoice, Status, TimeFlag, Remark, Number, Name, Department, Office) Values('"&Invoice&"','"&ChangeStatus&"','"&TimeFlag&"','"&Remark&"','"&Number&"','"&Name&"','"&Department&"','"&Office&"')" 
	
		Conn.Close
		Conn = Nothing
	End if
%>