#!/usr/bin/env python
import os
import sys
import subprocess

#set current directory
current_dir = "/home/s2647596/public_html"
os.chdir(current_dir)

file_name = f"seq_{sys.argv[1]}"


#change current directory to that folder
working_dir = f"./results/{file_name}"
os.chdir(working_dir)

#multiple alignment
MSA_command = "clustalo --force -i original_seq.fasta -o aligned_seq.aln"

try:
    subprocess.call(MSA_command, shell=True)
    os.chmod("./aligned_seq.aln", 0o666)
except:
    print("multiple alignment errors")
    sys.exit(1)

#plot the conservation plot
plot_command = "stdbuf -oL -eL plotcon -sequence aligned_seq.aln -winsize 10 -graph png"
try:
    result = subprocess.run(plot_command, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.chmod("./plotcon.1.png", 0o666)

    #press all the files for the user to download
    subprocess.call("zip -qr conservation.zip original_seq.fasta aligned_seq.aln plotcon.1.png",
                    shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.chmod("./conservation.zip", 0o666)
    print(working_dir)

except subprocess.CalledProcessError as e:
    print("Fail to plot the conservation graph!")
    print("Return Code:", e.returncode)
    sys.exit(1)
except Exception as e:
    print("fail to zip the files:", str(e))
    sys.exit(1)