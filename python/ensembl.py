#!/usr/bin/env python
import os
import sys
from Bio import Entrez

#set current directory
current_dir = "/home/s2647596/public_html"
os.chdir(current_dir)

Entrez.email = "s2647596@ed.ac.uk"

# obtain the species name and protein name from php 
# species_name = sys.argv[1]
# protein_name = sys.argv[2]
species_name = "Aves"
protein_name = "glucose-6-phosphatase"

#esearch and efetch
try:
    result = Entrez.read(Entrez.esearch(db="protein",term=f"{protein_name}[Title] AND {species_name}[Organism]"))
    idList = result["IdList"]
    print(idList)
except Exception as e:
    #if something wrong, exit from the script
    print(e)
    sys.exit(1)