<%@ language="vbscript" codepage="65001"%>
<!--#include file="./connect.asp"-->
<%
    Dim Status
    Status = Request.Form("Status")
    ' Status = 6

    If Status = 1 Then '状态1 查询pral size
        
        Call GetTireParam

        Sub GetTireParam ()
            Dim ResponseStr, Param, Value, OtherParam, Count
            Param = Request.Form("Param")
            Value = Request.Form("Value")


        IF Not(Param = "" or Value = "") Then
                ' Param = "pral"
                ' Value = "0"
                ' Value = "规格1"
                If Value = "0" Then '没有传value 返回所有的 param

                    Set InvoiceRs = server.CreateObject("Adodb.Recordset")
                    InvoiceRs.Open "Select Invoice From P_TyreSaleLogistics WHERE (Status >= 4)",Conn,1,3
                    'todo  更改 bof eof 判断
                    If not(InvoiceRs.Bof or InvoiceRs.Eof) Then
                        Count = 1
                        ResponseStr = "{""code"":0,""data"":{"
                        Do while not(InvoiceRs.Bof or InvoiceRs.Eof)
                        
                            set ParamRs = server.CreateObject("Adodb.Recordset")
                            ParamRs.Open "Select "& Param &" From P_TyreSaleAllTire WHERE (Logistics = '"&InvoiceRs("Invoice")&"'AND (Status < 2))",Conn,1,3
                            If ParamRs.RecordCount <> 0 Then
                                Do while not(ParamRs.Bof or ParamRs.Eof)
                                    ResponseStr = ResponseStr & """"& Count &""""& ":{"""& Param & """:""" & ParamRs(""& Param &"") &"""},"
                                    Count = Count + 1
                                    ParamRs.MoveNext
                                Loop
                            End If 
                            InvoiceRs.MoveNext
                            ParamRs.Close
                            set ParamRs = Nothing
                        Loop
                        ResponseStr = left(ResponseStr,len(ResponseStr) - 1)
                        response.write ResponseStr &"},""count"":"&Count-1&"}"
                    Else
                        response.write "{""code"":1,""msg"":""暂无进库且未销售完毕的轮胎的船只""}"
                    End If
                    InvoiceRs.Close
                    Conn.close
                    set InvoiceRs = Nothing
                    set Conn = Nothing

                ElseIf Value <> "0" Then


                
                    If Param = "size" Then
                        OtherParam = "pral"
                    ElseIf Param = "pral" Then
                        OtherParam = "size"
                    End If
                    Count = 1
                    ResponseStr = "{""code"":0,""data"":{"
                    Set InvoiceRs = server.CreateObject("Adodb.Recordset")
                    InvoiceRs.Open "Select Invoice From P_TyreSaleLogistics WHERE (Status >= 4)",Conn,1,3
                    Do while not(InvoiceRs.Bof or InvoiceRs.Eof)
                        set ParamRs = server.CreateObject("Adodb.Recordset")
                        ' response.write "Select "& Param &" From P_TyreSaleAllTire WHERE (Logistics = '"&InvoiceRs("Invoice")&"')"
                        ParamRs.Open "Select "& Param &" From P_TyreSaleAllTire WHERE (Logistics = '"&InvoiceRs("Invoice")&"') AND ("&OtherParam&" = '"& Value &"') AND (Status < 2)",Conn,1,3
                            Do while not(ParamRs.Bof or ParamRs.Eof)
                                ' response.write ResponseStr & """"& Count &""""& ":{"& Param & ":""" & ParamRs(""& Param &"") &"""},"
                                ResponseStr = ResponseStr & """"& Count &""""& ":{"""& Param & """:""" & ParamRs(""& Param &"") &"""},"
                                Count = Count + 1
                            ParamRs.MoveNext
                            Loop
                        InvoiceRs.MoveNext
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
            ElseIf Value = "" Then
                response.write "{ ""code"":""1"",""msg"":""place Post value""!} "
            Else
                response.write "{ ""code"":""1"",""msg"":""place Post param""!} "
            End If
            

        End Sub

        
    ElseIf Status = 2 Then '状态2 根据 pral size 查询 
        Call SearchTireParam
        Sub SearchTireParam ()
            Dim Pral, Size, ResponseStr, Num

            Pral = Request.Form("pral")
            Size = Request.Form("size")
            ' Pral = "规格2"
            ' Size = "规格2"
            
            Count = 1
            ResponseStr = "{""code"":0,""data"":{"
            Set InvoiceRs = server.CreateObject("Adodb.Recordset")
            InvoiceRs.Open "Select Invoice From P_TyreSaleLogistics WHERE (Status >= 4)",Conn,1,3
            Do while not(InvoiceRs.Bof or InvoiceRs.Eof)
                ' response.write(InvoiceRs("Invoice"))
                set SomeTireRs = server.CreateObject("Adodb.Recordset")
                ' response.write("SELECT Logistics, Client, Quantity, Status, Price FROM P_TyreSaleAllTire WHERE (Logistics = '"&InvoiceRs("Invoice")&"') AND (Status < 2) AND (Pral = '"& Pral &"') AND (Size = '"& Size &"')")
                SomeTireRs.Open "SELECT Logistics, Client, Quantity, Status, Price FROM P_TyreSaleAllTire WHERE (Logistics = '"&InvoiceRs("Invoice")&"') AND (Status < 2) AND (Pral = '"& Pral &"') AND (Size = '"& Size &"')",Conn,1,3
                Invoice = InvoiceRs("Invoice")
                ' response.write(Invoice)
                Do while not(SomeTireRs.Bof or SomeTireRs.Eof)
                    If SomeTireRs("Status") = "1" Then '销售过   没有 卖完   查询 销售表  中销售的数量   计算  返回剩余数量
                        Num = SomeTireRs("Quantity")
                        set GetSaleNumRS = server.CreateObject("Adodb.Recordset")
                        GetSaleNumRS.Open "SELECT Quantity FROM P_TyreSaleSellOrderInfo WHERE (Invoice = '"& Invoice &"') AND (Pral = '"& Pral &"') AND (Size = '"& Size &"')",Conn,1,3
                        Do while not (GetSaleNumRS.Bof or GetSaleNumRS.Eof)
                            Num = Num - GetSaleNumRS("Quantity")
                            GetSaleNumRS.MoveNext
                        Loop
                        GetSaleNumRS.close
                        set GetSaleNumRS = Nothing

                        ResponseStr = ResponseStr & """"& Count &""""& ":{""Logistics"":""" & SomeTireRs("Logistics") &""",""Client"":""" & SomeTireRs("Client") &""",""Quantity"":""" & Num &""",""Price"":""" & SomeTireRs("Price") &"""},"
                    ElseIf SomeTireRs("Status") = "0" Then   '没有销售过的   
                        ResponseStr = ResponseStr & """"& Count &""""& ":{""Logistics"":""" & SomeTireRs("Logistics") &""",""Client"":""" & SomeTireRs("Client") &""",""Quantity"":""" & SomeTireRs("Quantity") &""",""Price"":""" & SomeTireRs("Price") &"""},"
                    End If
                    Count = Count + 1
                    SomeTireRs.MoveNext
                Loop
                SomeTireRs.close
                set SomeTireRs = Nothing
                InvoiceRs.MoveNext
            Loop
            InvoiceRs.close
            set InvoiceRs = Nothing
            ResponseStr = left(ResponseStr,len(ResponseStr) - 1)
            response.write ResponseStr &"},""count"":"&Count-1&"}"
            Conn.close
            set Conn = Nothing
        End Sub
        
    ElseIf Status = 3 Then '添加销售订单详情  并判断 是否全部销售
        ' Dim SaleOrderId, Invoice, Pral, Size, Quantity, RealPrice, Remark, RealClient, PrePrice, PreClient, SaleTime
        
        SaleOrderId = Request.Form("saleOrderId")
        Invoice = Request.Form("Invoice")
        Pral = Request.Form("pral")
        Size = Request.Form("size")
        Quantity = Request.Form("quantity")
        RealPrice = Request.Form("realPrice")
        Remark = Request.Form("Remark")
        RealClient = Request.Form("realClient")
        PrePrice = Request.Form("prePrice")
        PreClient = Request.Form("preClient")
        SaleTime = Request.Form("saleTime")


        ' SaleOrderId = "no:008"
        ' Invoice = "no:0000004"
        ' Pral = "规格5"
        ' Size = "规格5"
        ' Quantity = "1"
        ' RealPrice = "500"
        ' Remark = "多卖100元"
        ' RealClient = "sbark"
        ' PrePrice = "400"
        ' PreClient = "mask"
        ' SaleTime = "2015-5-5"
        
        set Cmd = server.CreateObject("adodb.command")
        Cmd.activeConnection = Conn
        Cmd.CommandText = "INSERT INTO P_TyreSaleSellOrderInfo (SaleOrderId, Invoice, Pral, Size, Quantity, RealPrice, Remark, RealClient, PrePrice, PreClient, SaleTime) VALUES ('"&SaleOrderId&"', '"&Invoice&"', '"&Pral&"', '"&Size&"', '"&Quantity&"', '"&RealPrice&"', '"&Remark&"', '"&RealClient&"', '"&PrePrice&"', '"&PreClient&"', '"&SaleTime&"')"
        Cmd.Execute

        Cmd.CommandText = "SELECT Quantity FROM P_TyreSaleAllTire WHERE (Logistics = '"&invoice&"') AND (Client = '"&preClient&"') AND (Pral = '"&pral&"') AND (Size = '"&size&"')"
        set PreNumRS = Cmd.Execute()
        preAllnum = PreNumRS("quantity")
        set PreNumRS = Nothing
        ' response.write(preAllnum & "<br>")

        Cmd.CommandText = "SELECT Quantity FROM P_TyreSaleSellOrderInfo WHERE (invoice = '"&invoice&"') AND (PreClient = '"&preClient&"') AND (Pral = '"&pral&"') AND (Size = '"&size&"')"
        set SaleNumRS = cmd.Execute()
        saleNum = 0
        Do While Not(SaleNumRS.Bof or SaleNumRS.Eof) 
            saleNum = saleNum + SaleNumRS("Quantity")
            SaleNumRS.MoveNext
        Loop
        set SaleNumRS = Nothing
        ' response.write(saleNum & "<br>")
        ' response.write(preAllnum - saleNum)
        If preAllnum - saleNum = 0 Then
            Cmd.CommandText =  "UPDATE P_TyreSaleAllTire SET Status = 2 WHERE (Logistics = '"&invoice&"') AND (Client = '"&preClient&"') AND (Pral = '"&pral&"') AND (Size = '"&size&"')"
            Cmd.Execute
            ' response.write "改变状态为2"
        Else
            Cmd.CommandText =  "UPDATE P_TyreSaleAllTire SET Status = 1 WHERE (Logistics = '"&invoice&"') AND (Client = '"&preClient&"') AND (Pral = '"&pral&"') AND (Size = '"&size&"')"
            Cmd.Execute
            ' response.write "改变状态为1"
        End If
        '得到数量   进行对比 从而改变  销售状态
        
        response.write" { ""code"":0,""msg"":""操作成功"" } "
        set Cmd = Nothing
        Conn.close
        set Conn = Nothing
    ElseIf Status = 4 Then '添加销售订单 并添加 销售订单操作记录
        ' allCheap = "-5000"
        ' allPrice = "785900"
        ' allQuanitity = "1002"
        ' client = "tom"
        ' saleOrderId = "011"
        ' saleTime = "2018-6-6"
        allCheap = Request.Form("allCheap")
        allPrice = Request.Form("allPrice")
        allQuanitity = Request.Form("allQuanitity")
        client = Request.Form("client")
        saleOrderId = Request.Form("saleOrderId")
        saleTime = Request.Form("saleTime")
        Number = Request.Form("Number")
        TimeFlag = Request.Form("TimeFlag")
        Name = Request.Form("Name")
        Department = Request.Form("Department")
        Office = Request.Form("Office")

        set Cmd = server.CreateObject("adodb.command")
        Cmd.activeConnection = Conn
        Cmd.CommandText = "INSERT INTO P_TyreSaleSellOrder (SaleOrderId, SaleTime, Client, Quanitity, TotalPrice, Cheap) VALUES ('"&saleOrderId&"', '"&SaleTime&"', '"&Client&"', '"&allQuanitity&"', '"&allPrice&"', '"&allCheap&"')"
        Cmd.Execute
        Cmd.CommandText = "INSERT INTO P_TyreSaleSellOrderLog (Invoice, Number, TimeFlag, Name, Department, Office) VALUES ('"&saleOrderId&"', '"&Number&"', '"&TimeFlag&"', '"&Name&"', '"&Department&"', '"&Office&"')"
        Cmd.Execute
        response.write" { ""code"":0,""msg"":""操作成功"" } "
    ElseIf Status = 5 Then '过去全部销售订单  并分页 有value
		Value = Request.FORM("value")
		' Value = 00
		set Rs = server.createObject("adodb.recordset")
		Rs.open "SELECT SaleOrderId, SaleTime, Client, Quanitity, TotalPrice, Cheap FROM P_TyreSaleSellOrder Where( SaleOrderId like '%"&value&"%') Order By Id DESC ",Conn,1,3
		
		If Not (Rs.Bof and Rs.Eof)  Then
			PageSize = Request.FORM("PageSize")
			' PageSize = 10
			RS.PageSize = PageSize
			Rs.AbsolutePage = Request.FORM("absolutePage")
			' Rs.AbsolutePage = 1

			Count = 1
			RequireJsonStr = "{""code"":0,""data"":{"
			Do While not(Rs.Bof or Rs.Eof) 
				RequireJsonStr = RequireJsonStr&""""&count&""":{""SaleOrderId"":"""&Rs("SaleOrderId")&""",""SaleTime"":"""& Rs("SaleTime") &""",""Client"":"""&Rs("Client")&""",""Quanitity"":"""& Rs("Quanitity") &""",""TotalPrice"":"""& Rs("TotalPrice") &""",""Cheap"":"""&Rs("Cheap")& """},"
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
			'response.write " { ""code"":""1"",""msg"":""无数据"" } "
		END IF
    ElseIf Status = 6 Then '获取全部销售订单  并分页 无value
        set Rs = server.createObject("adodb.recordset")
		Rs.open "SELECT SaleOrderId, SaleTime, Client, Quanitity, TotalPrice, Cheap FROM P_TyreSaleSellOrder Order By Id DESC",Conn,1,3
		PageSize = Request.FORM("PageSize")
		' PageSize = 10
		RS.PageSize = PageSize
		Rs.AbsolutePage = Request.FORM("absolutePage")
		' Rs.AbsolutePage = 1
		If Not (Rs.Bof Or Rs.Eof)  Then
			Count = 1
			RequireJsonStr = "{""code"":0,""data"":{"
			Do While not(Rs.Bof or Rs.Eof)                                                     
				RequireJsonStr = RequireJsonStr&""""&count&""":{""SaleOrderId"":"""&Rs("SaleOrderId")&""",""SaleTime"":"""& Rs("SaleTime") &""",""Client"":"""&Rs("Client")&""",""Quanitity"":"""& Rs("Quanitity") &""",""TotalPrice"":"""& Rs("TotalPrice") &""",""Cheap"":"""&Rs("Cheap")& """},"
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
    Else '状态码错误
        response.write "{ ""code"":""1"",""msg"":""error status mark withi"&status&" place send right code!} "
    End If

%>