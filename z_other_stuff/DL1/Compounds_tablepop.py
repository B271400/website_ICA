#!/usr/bin/python3
import sys
# get sys package for file arguments etc
from getpass import getpass
import pymysql
if(len(sys.argv) != 2) :
  print("Usage: Compounds_tablepop.py infile")
  sys.exit(-1)
user=input("Please enter your user name\n")
passwd=getpass("Please enter your password\n")
dbname=input("Please enter the FULL database name\n")

con = pymysql.connect(host='127.0.0.1', user=user, passwd=passwd, db=dbname)
cur = con.cursor()

input_name = sys.argv[1]
title = True
dosupplier = False
doprops = False
with open(input_name,"r") as fi:
    for line in fi:
        line = line.rstrip()
        #print line
        if(title):
          this_title = line
          title = False
          continue
        if(dosupplier):
          supplier = line
          dosupplier = False
          continue
        if(doprops) :
          if(len(line) < 3) :
            doprops = False
            continue
          else :
            props = line.split()
            if(props[0] == 'MW'):
              mw = props[2]
            if(props[0] == 'nCIC'):
              ncic = props[2]
            if(props[0] == 'RBN'):
              rbn = props[2]
            if(props[0] == 'nHDon'):
              nhd = props[2]
            if(props[0] == 'nHAcc'):
              nha = props[2]
            if(props[0] == 'TPSA'):
              TPSA = props[2]
            if(props[0] == 'XLogP'):
              XLogP = props[2]
        if(line == '$$$$'):
          title = True;
          print(this_title," ",supplier," ",mw," ",ncic," ",rbn," ",nhd," ",nha," ",TPSA," ",XLogP,"\n")
          sql = "SELECT id FROM Manufacturers WHERE name='%s'" % (supplier)
          cur.execute(sql)
          row = cur.fetchone()
          supid = row[0]
          sql = "INSERT INTO Compounds (ncycl,nhdon,nhacc,nrotb,ManuID,catn,mw,TPSA,XLogP) values (%s,%s,%s,%s,%s,'%s',%s,%s,%s)" % (ncic,nhd,nha,rbn,supid,this_title,mw,TPSA,XLogP)
          print(sql,"\n")
          cur.execute(sql)
        if(line[0:12] == ">  <SUPPLIER"):
          dosupplier = True
        if(line[0:13] == ">  <molecular"):
          doprops = True
con.commit()
con.close()


