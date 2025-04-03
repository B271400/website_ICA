#!/usr/bin/env python
import os
import sys
import uuid
from Bio import Entrez
from Bio import SeqIO

#set current directory
current_dir = "/home/s2647596/public_html"
os.chdir(current_dir)

Entrez.email = "xi18516833060@gmail.com"
Entrez.api_key = "c4e0330618c7f3295d5c8f561aa06dd7fd08"

# obtain the species name and protein name from php 
species_name = sys.argv[1]
protein_name = sys.argv[2]
# species_name = "Aves"
# protein_name = "glucose-6-phosphatase"

# try to get taxonomy id first
def get_taxonomy_id(taxon_name):
    record = Entrez.read(Entrez.esearch(db="taxonomy", term=taxon_name))
    if record['IdList']:
        return record['IdList'][0]
    else:
        return None
txid = get_taxonomy_id(species_name)

if(txid):
    # use the taxonomy id to search first
    try:
        result = Entrez.read(Entrez.esearch(db="protein",term=f"{protein_name}[Title] AND txid{txid}[Organism]"))
        idList = result["IdList"]
        # print(idList)
    except:
        #if something wrong, exit from the script
        print("cannot connect to NCBI")
        sys.exit(2)
else:
    #esearch and efetch
    #try to use the species name directly
    try:
        result = Entrez.read(Entrez.esearch(db="protein",term=f"{protein_name}[Title] AND {species_name}[Organism]"))
        idList = result["IdList"]
        # print(idList)
    except:
        #if something wrong, exit from the script
        print("cannot connect to NCBI")
        sys.exit(2)
    

#if no result, exit from the script
if not idList:
    print("no_result")
    sys.exit(1)
else:
    #create a uique id for this file
    unique_id = uuid.uuid4().hex[:8]

    #create a folder for this sequence, allowing later analysis use this folder
    file_name = f"seq_{unique_id}"
    os.makedirs(f"./results/{file_name}", exist_ok=True)
    os.chmod(f"./results/{file_name}", 0o777)
    #open the fasta result file
    os.system(f"touch ./results/{file_name}/original_seq.fasta")

    f = open(f"./results/{file_name}/original_seq.fasta", mode="a", encoding="utf-8")

    #esearch and efetch obtain the protein sequence (fasta file)
    for id in idList:
        fasta_result = Entrez.efetch(db="protein", id=id, term=protein_name, rettype="fasta", retmode="text")
        record = SeqIO.read(fasta_result, "fasta")
        f.write(f">{record.description}\n")
        f.write(f"{record.seq}\n")
        f.write("\n")

    os.chmod(f"./results/{file_name}/original_seq.fasta", 0o777) 
    f.close()
    print(unique_id)