// import the content change function
import contentChange from "./contentChange.js"

// obtain elements
const father_el = document.getElementById("analysis-ul")
const content_el = document.getElementById("content_box")
const slider_el = document.getElementById("slider-box")
const id_content_obj = {
    "conservation":"This function examines the evolutionary conservation of protein sequences within a selected taxonomic group. By aligning the sequences and comparing similarity scores across residues, the analysis highlights conserved regions that may play essential biological roles. The resulting conservation plot visually represents sequence similarity, helping to identify functionally important domains.",
    "motif":"This function scans protein sequences for known motifs using the PROSITE database. Motifs are conserved sequence patterns that often indicate functional or structural significance in proteins. By identifying these motifs, this analysis helps uncover potential protein functions, interactions, and evolutionary relationships. The results display matched motifs along with the number of sequences containing them.",
    "tree":"This function reconstructs the evolutionary relationships between protein sequences using IQ-TREE. The generated Newick-format tree file is fully processed, with sequence names labeled by species name and protein name for user-friendly interpretation. You can download the tree file and visualize it using iTOL for further customization and analysis."
}

// change content and class name
contentChange(father_el, content_el,id_content_obj, slider_el, 4)

//click the button => jump to that page
father_el.addEventListener("click",e=>{
    const targetLi = e.target.closest('li');
    if(targetLi && father_el.children){
        window.location = `/~s2647596/${targetLi.id}.html`
    }
}, true)

