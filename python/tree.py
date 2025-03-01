#!/usr/bin/env python
import os
import sys
import subprocess
import time

#set current directory
current_dir = "/home/s2647596/public_html"
os.chdir(current_dir)

#the directory for sequence file
seq_dir = f"./temp"

file_name = f"seq_{sys.argv[1]}"

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

#check previous work: whether have multiple aligned sequence file or not
if not os.path.exists("./aligned_seq.aln"):
    #multiple alignment
    MSA_command = "clustalo --force -i original_seq.fasta -o aligned_seq.aln"
    try:
        subprocess.call(MSA_command, shell=True)
        os.chmod("./aligned_seq.aln", 0o666)
    except:
        print("multiple alignment errors")
        sys.exit(1)

with open("./aligned_seq.aln", mode="r") as f:
    lines = f.readlines()
    for line in lines:
        line = line.strip()
        if line.startswith(">"):
            line_list = line.split(" ")
            #remove > of the accession number
            line_list[0] = line_list[0][1:]
            #remove [ and ]\n of the species name
            line_list[-2] = line_list[-2][1:]
            line_list[-1] = line_list[-1][:-1]
            #join the species name and protein name together
            #move accession number to the end
            acc_id = line_list[0]
            line_list = "_".join(line_list[1:])
            new_line = f">{line_list} {acc_id}"
            #write it into the file
            #for the first line
            if line==lines[0]:
                with open("./seq_tree.aln", mode="w") as inner_f:
                    inner_f.write(new_line)
            else:
                with open("./seq_tree.aln", mode="a") as inner_f:
                    inner_f.write(f"\n{new_line}")
        else:
            with open("./seq_tree.aln", mode="a") as inner_f:
                inner_f.write(f"\n{line}")
    os.chmod("./seq_tree.aln", 0o666)


#create the tree file
tree_command = "/localdisk/home/ubuntu-software/iqtree-2.2.0-Linux/bin/iqtree2 -s seq_tree.aln -B 1000 > iqtree.log 2>&1 &"
try:
    subprocess.run(tree_command, shell=True, check=True)
except:
    print("create phylogeny tree error")
    sys.exit(1)

# waiting IQ-Tree create .treefile
treefile_path = "./seq_tree.aln.treefile"
timeout = 360  # the maximum waiting time (seconds)
elapsed_time = 0

while not os.path.exists(treefile_path):
    if elapsed_time > timeout:
        #time out, exits from the system to avoid death loop
        print("IQ-TREE calculation timed out!")
        sys.exit(1)
    #check every 5 seconds
    time.sleep(5)  
    elapsed_time += 5

#press all the files for the user to download
try:
    subprocess.run("zip -qr tree.zip original_seq.fasta iqtree.log aligned_seq.aln seq_tree.aln.*",
                    shell=True)
    os.chmod("./tree.zip", 0o666)
except Exception as e:
    print("fail to zip the files:", str(e))
    sys.exit(1)

# read and print the pythonlogy tree (newick format)
with open(treefile_path, "r") as f:
    line = f.readline()
    line = line.strip()
    print(line)