<%@ language="vbscript" codepage="65001"%>
<!--#include file="./connect.asp"-->
<%
    ' 返回 运输状态为 5\4 的 对应的物流单号
    ' Status = 2
    Status = Request.FORM("Status")
    If Status = 1 Then '状态1 获取所有倒库的轮胎
    
        Call getAllArriveTire()
        Sub getAllArriveTire ()
            dim Status,RequireJsonStr, Count, pageSize, pral,size, num

            set Cmd = server.createObject("adodb.command")
            Cmd.activeConnection = Conn
            Cmd.CommandText = "SELECT Invoice FROM P_TyreSaleLogistics WHERE (Status >= 4)"
            Set InvoiceRS = Cmd.Execute()
            RequireJsonStr = "{""code"":0,""data"":{"
            Count = 1
            Do While not (InvoiceRS.Bof or InvoiceRS.Eof)
                ' response.write(InvoiceRS("invoice"))
                Cmd.CommandText = "SELECT Pral, Size, Quantity FROM P_TyreSaleAllTire Where(Logistics ='"&InvoiceRS("Invoice")&"')"
                
                Set ItemRS = Cmd.Execute()
                Do While not (ItemRS.Bof or ItemRS.Eof)
                    RequireJsonStr = RequireJsonStr  & """"&count&""":{""pral"":"""&ItemRS("Pral")&""",""size"":"""& ItemRS("Size") &""",""quantity"":"""& ItemRS("Quantity")&"""},"
                    Count = Count + 1
                    ItemRS.movenext
                Loop
                InvoiceRS.movenext
            Loop
            RequireJsonStr = left(RequireJsonStr,len(RequireJsonStr) - 1)
            RequireJsonStr = RequireJsonStr & "},""count"":" & """"&count-1&"""" & "}"
            response.write(RequireJsonStr)
            set Cmd = nothing
            Conn.close
            set Conn = nothing
        End Sub
    ElseIf Status = 2 Then '类型数组的 销售的数量 返回数量
        Call ReturnNumArr()
        Sub ReturnNumArr ()
            dim pral, size, ResultJsonStr, Num, item, count

            pral = Request.FORM("pral")
            size = Request.FORM("size")
            ' pral = "规格2,规格1,规格3,规格3,规格5,规格1,规格6,规格7,规格8,规格9"
            ' size = "规格2,规格1,规格3,规格4,规格5,规格3,规格6,规格7,规格8,规格9"
            pral = split(pral,",")
            size = split(size,",")


            set Cmd = server.createObject("adodb.command")
            Cmd.activeConnection = Conn
            ResultJsonStr = "{""code"":0,""data"":{"
            count = 0



            For item = 0 To uBound(Pral)
                ' response.write(pral(item))
                ' response.write(size(item)&"<br>")
                Num = 0
                Cmd.CommandText = "SELECT Quantity FROM P_TyreSaleSellOrderInfo WHERE (Pral = '"&pral(item)&"') AND (Size = '"&size(item)&"')"
                Set SaleNumRs = Cmd.Execute()
                Do While not (SaleNumRs.Bof or SaleNumRs.Eof) 
                    ' response.write(SaleNumRs("quantity")&"<br>")
                    Num = Num + SaleNumRs("quantity")
                    SaleNumRs.movenext
                Loop



                ' response.write(Num & "<br>")
                ResultJsonStr = ResultJsonStr  & """"&count&""":{""SaleNum"":"""&Num&"""},"
                count = count + 1
            next  


            ResultJsonStr = left(ResultJsonStr,len(ResultJsonStr) - 1)
            ResultJsonStr = ResultJsonStr & "},""count"":" & """"&count&"""" & "}"
            response.write(ResultJsonStr)
            set Cmd = nothing
            Conn.close
            set Conn = nothing
        End Sub
        
    End If
   
%>
