#!/usr/bin/env python
import os
import sys
import subprocess

#set current directory
current_dir = "/home/s2647596/public_html"
os.chdir(current_dir)

file_name = f"seq_{sys.argv[1]}"

#create a folder in analysis result for this sequence file
if not os.path.exists(f"./results/{file_name}"):
    os.makedirs(f"./results/{file_name}", exist_ok=True)
    os.chmod(f"./results/{file_name}", 0o777)
    #move this sequence file to the new folder
    source_file = f"./temp/{file_name}.fasta"
    destination_file = f"./results/{file_name}/original_seq.fasta"
    try:
        # read the original file
        with open(source_file, "r") as src:
            content = src.read()
        
        # write in the new file
        with open(destination_file, "w") as dest:
            dest.write(content)     
        os.chmod(destination_file, 0o666) 

        print(file_name)
    except Exception as e:
        print("Failed to read and write file:", e)
        sys.exit(1)