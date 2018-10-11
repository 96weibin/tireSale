<%@ language="vbscript" codepage="65001"%>
<!--#include file="./connect.asp"-->
<%
    ' 返回 运输状态为 5\4 的 对应的物流单号
    dim Status
    Status = 1
    ' Status = Request.FORM("Status")
    If Status = 1 Then
        Dim RequireJsonStr, Count, pageSize
        pageSize = Request("pageSize")
        absolutePage = Request("absolutePage")
		Set Cmd = server.createObject("adodb.command")
		Cmd.activeConnection = Conn
		Cmd.CommandText = "SELECT Invoice FROM P_TyreSaleLogistics WHERE (Status >= 4)"
        Set InvoiceRS = Cmd.Execute()
        RequireJsonStr = "{""code"":0,""data"":{"
        Count = 1
        Do While not (InvoiceRS.Bof or InvoiceRS.Eof)
            ' response.write(InvoiceRS("invoice"))
            Cmd.CommandText = "SELECT Logistics, Client, Pral, Size, Quantity, Status, Price FROM P_TyreSaleAllTire Where(Logistics ='"&InvoiceRS("Invoice")&"' ) And (Status <= 2)"
            Set ItemRS = Cmd.Execute()
            Do While not (ItemRS.Bof or ItemRS.Eof)
                RequireJsonStr = RequireJsonStr  & """"&count&""":{""pral"":"""&ItemRS("Pral")&""",""size"":"""& ItemRS("Size") &""",""status"":"""&ItemRS("status")&""",""price"":"""& ItemRS("Price")&""",""quantity"":"""& ItemRS("Quantity")&"""},"
                Count = Count + 1
                ItemRS.movenext
            Loop
            InvoiceRS.movenext
        Loop
        RequireJsonStr = left(RequireJsonStr,len(RequireJsonStr) - 1)
        RequireJsonStr = RequireJsonStr & "},""count"":" & """"&count-1&"""" & "}"
        response.write(RequireJsonStr)
    End If
%>
