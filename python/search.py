#!/usr/bin/env python
import os
import sys
import uuid
from Bio import Entrez
from Bio import SeqIO

#set current directory
current_dir = "/home/s2647596/public_html"
os.chdir(current_dir)

Entrez.email = "s2647596@ed.ac.uk"

# obtain the species name and protein name from php 
species_name = sys.argv[1]
protein_name = sys.argv[2]
# species_name = "Aves"
# protein_name = "glucose-6-phosphatase"

#esearch and efetch
try:
    result = Entrez.read(Entrez.esearch(db="protein",term=f"{protein_name}[Title] AND {species_name}[Organism]"))
    idList = result["IdList"]
    # print(idList)
except:
    #if something wrong, exit from the script
    print("no_result")
    sys.exit(1)

#if no result, exit from the script
if not idList:
    print("no_result")
    sys.exit(1)
else:
    #create a uique id for this file
    unique_id = uuid.uuid4().hex[:8]

    #open the fasta result file
    os.system(f"touch ./temp/seq_{unique_id}.fasta")

    f = open(f"./temp/seq_{unique_id}.fasta", mode="a", encoding="utf-8")

    #esearch and efetch obtain the protein sequence (fasta file)
    for id in idList:
        fasta_result = Entrez.efetch(db="protein", id=id, term=protein_name, rettype="fasta", retmode="text")
        record = SeqIO.read(fasta_result, "fasta")
        f.write(f">{record.description}\n")
        f.write(f"{record.seq}\n")
        f.write("\n")

    os.chmod(f"./temp/seq_{unique_id}.fasta", 0o777) 
    f.close()
    print(unique_id)