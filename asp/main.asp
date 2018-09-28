<%@ language="vbscript" codepage="65001"%>

<!--#include file="./connect.asp"-->
<%
	dim Status
	Status = Request.FORM("status")
	' status=4
	If Status = 1 Then
		' 状态1查发货订单
		' 后入先出  从后向前取
		dim RequireJsonStr, Count, PageSize

		set Rs = server.createObject("adodb.recordset")
		Rs.open "SELECT Invoice, SendPlace, ArrivePlace, Status, SendTime, ArriveTime FROM P_TyreSaleLogistics Order By Id DESC",Conn,1,3
		PageSize = Request.FORM("PageSize")
		RS.PageSize = PageSize
		Rs.AbsolutePage = Request.FORM("absolutePage")
		' Rs.AbsolutePage = 1
		If Not (Rs.Bof and Rs.Eof)  Then
			Count = 1
			RequireJsonStr = "{""code"":0,""data"":{"
			Do While not(Rs.Bof or Rs.Eof)
				RequireJsonStr = RequireJsonStr&""""&count&""":{""Invoice"":"""&Rs("Invoice")&""",""SendPlace"":"""& Rs("SendPlace") &""",""ArrivePlace"":"""&Rs("ArrivePlace")&""",""Status"":"""& Rs("Status") &""",""SendTime"":"""& Rs("SendTime") &""",""ArriveTime"":"""&Rs("ArriveTime")& """},"
				count = count + 1
				Rs.movenext
				PageSize = PageSize - 1
				' response.write("------"&PageSize)s
				If PageSize < 1 Then Exit Do
				'分页后 设置遍历个数  返回指定长度的字符串
			Loop
			RequireJsonStr = left(RequireJsonStr,len(RequireJsonStr) - 1)
			response.write RequireJsonStr &"},""count"":"&count-1&",""allPage"":"&RS.pageCount&"}"
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
		'发货订单状态维护
		dim changeStatus, Invoice, Number, Name, Department, Office, TimeFlag, Remark, ChangeTime
		ChangeStatus = Request.FORM("changeStatus")
		ChangeTime = Request.FORM("changeTime")
		Invoice = Request.FORM("Invoice")
		Number = Request.FORM("Number")
		Name = Request.FORM("Name")
		Department = Request.FORM("Department")
		Office = Request.FORM("office")
		TimeFlag = Request.FORM("TimeFlag")
		Remark = Request.FORM("Remark")


		' changeStatus = 5
		' changeTime = "2019-10-1"
		' department = "资讯部"
		' invoice = "no:0000007"
		' name = "赵伟斌"
		' number = "cstc\182722"
		' office = "自动化系统组"
		' remark = "直接维护最后一状态"
		' timeFlag = "2018-9-28 10:13:30"


		' response.write(ChangeStatus,Invoice)

		set Cmd = server.createObject("adodb.command")
		Cmd.activeConnection = Conn	'设置cmd对象所属的con对象

		Cmd.CommandText = "Update P_TyreSaleLogistics Set Status = '"& ChangeStatus &"'   Where Invoice = '"& Invoice &"'"
		Cmd.Execute
		'添加  更改状态记录
		If changeStatus = 4 Then 
			Cmd.CommandText = "Update P_TyreSaleLogistics Set arriveTime = '"&ChangeTime&"' Where Invoice = '"&Invoice&"'"
			Cmd.Execute
		End IF
		If changeStatus = 5 Then
			Cmd.CommandText = "Select ArriveTime From P_TyreSaleLogistics Where Invoice = '"&Invoice&"'"
			RS = Cmd.Execute()
			
			' response.write(RS("ArriveTime"))
			If isNull(RS("ArriveTime")) Then
				Conn.Execute "Update P_TyreSaleLogistics Set arriveTime = '"&ChangeTime&"' Where Invoice = '"&Invoice&"'"
			End If
		End IF

		Conn.Execute "Insert Into P_TyreSaleSendOrderOperationLog (Invoice, Status, TimeFlag, Remark, Number, Name, Department, Office, ChangeTime) Values('"&Invoice&"','"&ChangeStatus&"','"&TimeFlag&"','"&Remark&"','"&Number&"','"&Name&"','"&Department&"','"&Office&"','"&changeTime&"')" 
		response.write " { ""code"":0,""msg"":""操作成功"" } "		
		Conn.Close
		set Cmd = Nothing
	ElseIF status = 4 Then
	'员工编号搜索
		dim  Value
		Value = Request.FORM("value")
		' Value = 50
		set Rs = server.createObject("adodb.recordset")
		Rs.open "SELECT Invoice, SendPlace, ArrivePlace, Status, SendTime, ArriveTime FROM P_TyreSaleLogistics Where( Invoice like '%"&value&"%') Order By Id DESC ",Conn,1,3
		
		If Not (Rs.Bof and Rs.Eof)  Then
			PageSize = Request.FORM("PageSize")
			' PageSize = 10
			RS.PageSize = PageSize
			Rs.AbsolutePage = Request.FORM("absolutePage")
			' Rs.AbsolutePage = 1

			Count = 1
			RequireJsonStr = "{""code"":0,""data"":{"
			Do While not(Rs.Bof or Rs.Eof)
				RequireJsonStr = RequireJsonStr&""""&count&""":{""Invoice"":"""&Rs("Invoice")&""",""SendPlace"":"""& Rs("SendPlace") &""",""ArrivePlace"":"""&Rs("ArrivePlace")&""",""Status"":"""& Rs("Status") &""",""SendTime"":"""& Rs("SendTime") &""",""ArriveTime"":"""&Rs("ArriveTime")& """},"
				count = count + 1
				Rs.movenext
				PageSize = PageSize - 1
				' response.write("------"&PageSize)s
				If PageSize < 1 Then Exit Do
				'分页后 设置遍历个数  返回指定长度的字符串
			Loop
			RequireJsonStr = left(RequireJsonStr,len(RequireJsonStr) - 1)
			response.write RequireJsonStr &"},""count"":"&count-1&",""allPage"":"&RS.pageCount&"}"
			Rs.Close
			set Rs = Nothing
		Else
			response.write " { ""code"":""1"",""msg"":""无数据"" } "
		END IF
	End if
%>