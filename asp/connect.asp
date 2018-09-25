<%
    set Conn = server.createObject("adodb.connection")
    Conn.connectionString = "driver={sql server}; server=10.30.1.99;uid=dev;pwd=dev;dataBase=Development"
    Conn.open
%>