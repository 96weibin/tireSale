<%@ language="vbscript" codepage="65001"%>
<!--#include file="./connect.asp"-->
<%
    Dim Status
    ' Status = Request.Form("Status")
    Status = 1
    If Status = 1 Then '状态1 查询pral size
        Dim Param, Value, ResponseStr
        ' Param = Request.Form("Param")
        ' Value = Request.Form("Value")
        Param = "pral"
        Value = "0"
        If Value = 0 Then
            Count = 1
			ResponseStr = "{""code"":0,""data"":{"
            Set InvoiceRs = server.CreateObject("Adodb.Recordset")
            InvoiceRs.Open "Select Invoice From P_TyreSaleLogistics WHERE (Status >= 4)",Conn,1,3
            Do while not(InvoiceRs.Bof or InvoiceRs.Eof)
                set ParamRs = server.CreateObject("Adodb.Recordset")
                ' response.write "Select "& Param &" From P_TyreSaleAllTire WHERE (Logistics = '"&InvoiceRs("Invoice")&"')"
                ParamRs.Open "Select "& Param &" From P_TyreSaleAllTire WHERE (Logistics = '"&InvoiceRs("Invoice")&"')",Conn,1,3
                    Do while not(ParamRs.Bof or ParamRs.Eof)
                        ' response.write  Count & ":{" &Param& ":""" & ParamRs(""&Param&"") &"""},"
                        ResponseStr = ResponseStr & Count & ":{" &Param& ":""" & ParamRs(""&Param&"") &"""},"
                        Count = Count + 1
                    ParamRs.movenext
                    Loop
                InvoiceRs.movenext
            Loop
            ResponseStr = left(ResponseStr,len(ResponseStr) - 1)
			response.write ResponseStr &"},""count"":"&Count-1&"}"
            
            ParamRs.Close
            InvoiceRs.Close
            Conn.close
            set ParamRs = Nothing
            set InvoiceRs = Nothing
            set Conn = Nothing
        End If
    End If

%>