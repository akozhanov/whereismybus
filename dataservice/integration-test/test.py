import urllib.request
import time

print("waiting for dataservice to start")
time.sleep(100)
print("sending test request")
urllib.request.urlopen("http://wimb-dataservice:10000/data/226?time=2015-09-03T10:16:50Z&lat=50.5174202&long=30.4485796&s=0.0&dir=0.0&sat=25&alt=0.0&acc=26.23900032043457&prov=network&batt=28.0&aid=8a53003a7f32ce99&ser=LGD856cd544cf6").read()
print("done. press enter")
input("Press Enter to continue...")
