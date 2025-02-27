import os
import subprocess
from Bio import Entrez
from Bio import SeqIO

#set current directory
current_dir = "/home/s2647596/public_html/ICA"
os.chdir(current_dir)

Entrez.email = "s2647596@ed.ac.uk"
#set the protein family and species name
#protein family
protein_name = "glucose-6-phosphatase"
#species
species_name = "Aves"

#esearch and efetch
result = Entrez.read(Entrez.esearch(db="protein",term=f"{protein_name}[Title] AND {species_name}[Organism]"))
idList = result["IdList"]
# print(idList)

#open the fasta result file
if os.path.exists(f"./temp_results"):
    os.system(f"rm -rf ./temp_results")
    os.system("mkdir temp_results")
    os.system(f"touch ./temp_results/{species_name}.fa")

f = open(f"./temp_results/{species_name}.fa", mode="a", encoding="utf-8")

#esearch and efetch obtain the protein sequence (fasta file)
for id in idList:
    fasta_result = Entrez.efetch(db="protein", id=id, term=protein_name, rettype="fasta", retmode="text")
    record = SeqIO.read(fasta_result, "fasta")
    f.write(f">{record.description}\n")
    f.write(f"{record.seq}\n")
    f.write("\n")

f.close()

#align the protein sequences and plot the conservation
def plot_conserve(species_name):
    aln_query = f"clustalo -i ./temp_results/{species_name}.fa -o ./temp_results/{species_name}.aln"
    try:
        subprocess.call(aln_query, shell=True)
        with open(f"./temp_results/{species_name}.aln", mode="r") as f:
            print("success alignment")
        #plot the conservation
        plot_query = f"plotcon -sequence ./temp_results/{species_name}.aln -winsize 10 -graph png"
        result = subprocess.check_output(plot_query, shell=True).decode("utf-8")
        print(result)
        os.system(f"mv ./plotcon.1.png ./temp_results/{species_name}.png")
    except Exception as e:
        print(e)

plot_conserve(species_name)

#find motif from PROSTIE database that associated with the protein sequences
#split and save individual sequence to independent FASTA files
#create a directory for fasta files
os.chdir(f"{current_dir}/temp_results")
if not os.path.exists(f"./fasta_files"):
    os.mkdir("./fasta_files")
#split sequence
with open(f"./{species_name}.fa", mode="r") as f:
    fa_result = f.readlines()
    acc_list = []
    for i in range(len(fa_result)):
        line = fa_result[i].strip()
        if line.startswith(">"):
            #use accession number as file name
            acc_id = line.split(" ")[0]
            acc_id = acc_id[1:]
            if "|" in acc_id:
                acc_id = acc_id.split("|")[1]
            acc_list.append(acc_id)
            #header line
            with open(f"./fasta_files/{acc_id}.fasta", mode="w") as inner_f:
                inner_f.write(line)
        elif fa_result[i-1].startswith(">"):
            #first sequence line
            with open(f"./fasta_files/{acc_id}.fasta", mode="a") as inner_f:
                inner_f.write(f"\n{line}")
        else:
            #other sequnece line
            with open(f"./fasta_files/{acc_id}.fasta", mode="a") as inner_f:
                inner_f.write(line)

#use for loop to scan each sequnce
#create a directory for scanning result
if not os.path.exists(f"./motif_files"):
    os.mkdir("./motif_files")

hit_acc_list = []
motif_dict = {}
for acc_id in acc_list:
    motif_query = f"patmatmotifs -sequence ./fasta_files/{acc_id}.fasta -outfile ./motif_files/{acc_id}.txt"
    subprocess.run(motif_query, shell=True, stdout=subprocess.DEVNULL)

    #only save the file with motif result
    with open(f"./motif_files/{acc_id}.txt", mode="r") as f:
        lines = f.readlines()
    for line in lines:
        line = line.strip()
        if line.find("HitCount") != -1:
            #save the hit count number
            hit_num = line.split(" ")[-1]
            hit_num = int(hit_num)
            if hit_num > 0:
                #save the acc number if find motif from this sequence
                hit_acc_list.append(acc_id)
                print(acc_id, hit_num)
            else:
                os.remove(f"./motif_files/{acc_id}.txt")
        if line.find("Motif") != -1:
            motif = line.split(" = ")[-1]
            motif = motif.strip()
            if motif not in motif_dict.keys():
                motif_dict.update({motif:[acc_id]})
            else:
                motif_dict[motif].append(acc_id)
                

# print the final number of motif that found
print(f"total sequences scanned: {len(acc_list)}")
print(f"sequences with known motifs: {len(hit_acc_list)}")
print(f"Associated motifs ({len(motif_dict.keys())} found): ")
for motif in motif_dict.keys():
    seq_num = len(motif_dict[motif])
    print(f" - {motif} ({seq_num} sequences)")