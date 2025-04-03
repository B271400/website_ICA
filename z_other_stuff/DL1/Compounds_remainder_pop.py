#!/usr/bin/python3
import sys
# get sys package for file arguments etc
import pymysql
if(len(sys.argv) != 2) :
  print("Usage: Compounds_remainder_pop.py manufacturer")
  sys.exit(-1)

con = pymysql.connect(host='127.0.0.1', user='', passwd='', db='')

cur = con.cursor()
manuname = sys.argv[1]
input_name = manuname+".elc"
sql = "SELECT id FROM Manufacturers WHERE name='%s'" % (manuname)
cur.execute(sql)
row = cur.fetchone()
supid = row[0]
with open(input_name,"r") as fi:
  for line in fi:
    elems = line.split()
    name = elems[0]
    natm = elems[1]
    ncar = elems[2];
    nnit = elems[3];
    noxy = elems[4];
    nsul = elems[5];
    sql = "update Compounds SET natm=%s,  ncar=%s,  nnit=%s,  noxy=%s,  nsul=%s WHERE catn='%s'  and ManuID=%s" % (natm,ncar,nnit,noxy,nsul,name,supid)
    print(sql,"\n")
    cur.execute(sql)
con.commit()
con.close()
