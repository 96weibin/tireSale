<%@ language="vbscript" codepage="65001"%>
<%
dim param, paramArr
param = "规格2,规格1,规格3,规格3,规格5,规格1,规格6,规格7,规格8,规格9"
response.write(varType(param))
paramArr = split(param,",")

for i=0 to uBound(paramArr)
    response.write(paramArr(i))
next
%>