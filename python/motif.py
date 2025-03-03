#!/usr/bin/env python
import os
import sys
import subprocess
import json

#set current directory
current_dir = "/home/s2647596/public_html"
os.chdir(current_dir)

#the directory for sequence file
seq_dir = f"./temp"
uniq_id = sys.argv[1]
file_name = f"seq_{uniq_id}"
# file_name = "seq_1"

#create a folder in analysis result for this sequence file
if not os.path.exists(f"./results/{file_name}"):
    os.makedirs(f"./results/{file_name}", exist_ok=True)
    os.chmod(f"./results/{file_name}", 0o777)
    #move this sequence file to the new folder
    source_file = f"{seq_dir}/{file_name}.fasta"
    destination_file = f"./results/{file_name}/original_seq.fasta"
    try:
        # read the original file
        with open(source_file, "r") as src:
            content = src.read()
        
        # write in the new file
        with open(destination_file, "w") as dest:
            dest.write(content)     
        os.chmod(destination_file, 0o666) 
    except Exception as e:
        print("Failed to read and write file:", e)
        sys.exit(1)


#change current directory to that folder
working_dir = f"./results/{file_name}"
os.chdir(working_dir)

#find motif from PROSTIE database that associated with the protein sequences
#split and save individual sequence to independent FASTA files
#create a directory for fasta files
if not os.path.exists(f"./fasta_files"):
    os.mkdir("./fasta_files")
    os.chmod(f"./fasta_files", 0o777)

#split sequence
with open(f"./original_seq.fasta", mode="r") as f:
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
    os.chmod(f"./motif_files", 0o777)

hit_acc_list = []
motif_dict = {}
for acc_id in acc_list:
    motif_query = f"stdbuf -oL -eL patmatmotifs -sequence ./fasta_files/{acc_id}.fasta -outfile ./motif_files/{acc_id}.txt"
    subprocess.run(motif_query, shell=True, stdout=subprocess.DEVNULL, stderr = subprocess.DEVNULL)

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
                # print(acc_id, hit_num)
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
total_seq = len(acc_list)
motif_seq = len(hit_acc_list)
return_result = {
    "uniq_id" : uniq_id,
    "total_seq":total_seq,
    "motif_seq":motif_seq,
    "associated_motif":len(motif_dict.keys()),
    "motif_dict":motif_dict,
    "zip_src":f"./results/{file_name}/motif.zip"
}

#press all the files for the user to download
try:
    subprocess.run("zip -qr motif.zip original_seq.fasta ./fasta_files ./motif_files",
                    shell=True)
    os.chmod("./motif.zip", 0o666)
except Exception as e:
    print("fail to zip the files:", str(e))
    sys.exit(1)

# convert result into json format
json_data = json.dumps(return_result)
#send it to php
print(json_data)

# print(f"total sequences scanned: {total_seq}")
# print(f"sequences with known motifs: {motif_seq}")
# print(f"Associated motifs ({len(motif_dict.keys())} found): ")
# for motif in motif_dict.keys():
#     seq_num = len(motif_dict[motif])
#     print(f" - {motif} ({seq_num} sequences)")