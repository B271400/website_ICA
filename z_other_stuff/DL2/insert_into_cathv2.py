#!/usr/bin/python3
# get sys package for file arguments etc
import sys
# module for hidden passwords
from getpass import getpass
# get pymysql package for talking to MySQL
import pymysql
# check the command line is correct
if(len(sys.argv) != 2) :
  print("Usage: insert_cathv3.py infile")
  sys.exit(-1)
# get the user details on the fly  
user =        input("What is your MySQL username?\t") ;
db =          input("What is your MySQL database name?\t") ;
password =  getpass("What is your MySQL password?\t") ;

con = pymysql.connect(host='localhost', user=user, password=password, db=db)
cur = con.cursor()
cur.execute("Show tables ;")
print("\nThese are the tables currently in your {} database.".format(db))
print("\nYou need to have cathv2 there already.")

for i in cur.fetchall() :
  print(i)

thisisok = input("\n\nType Y to continue...\t")
if(thisisok.upper() == "Y") :
  input_name = sys.argv[1]
  with open(input_name,"r") as fi:
    for line in fi:
        words = line.split()
        temp = ' '.join(words[5:len(words)])
        sql = "insert into cathv2 (cat,arch,topol,homol,repchn,name) VALUES(%s, %s, %s, %s, '%s', %s)" % (words[0],words[1],words[2],words[3],words[4],temp)
        print(sql,"\n")
        cur.execute(sql)
fi
con.commit()
con.close()
