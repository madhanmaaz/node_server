
Set oShell = CreateObject ("Wscript.Shell") 
Dim strArgs
strArgs = "cmd.exe /C ""C:\Users\BLACK WIDOW\Documents\GitHub\node_server\\server.bat"" "
oShell.Run strArgs, 0, false

