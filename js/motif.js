// Obtain elements
const previous_seq_el = document.getElementById("start-btn");
const seq_id_url = "/~s2647596/php/seq_id.php";
const file_el = document.getElementById("fileUpload")
const content_el = document.getElementById("content-box")
const left_part_el = document.getElementById("left-part")
const upload_url = "/~s2647596/php/upload_file.php"
const motif_url = "/~s2647596/php/motif.php"

//import js files
import find_prev_seq from "./seq_id.js";
import upload_file from "./upload_file.js";

// Use async function to get the stat value
const getStat = async (func, el, url) => {
    try {
        // Should show "success" or "error" after button click or file upload
        const stat = await func(el, url);
        if(stat == "success"){
            content_el.innerHTML = `<div class="loading-box more-sugar-font">
                <img src="./imgs/loading.gif" />
                <p></p>
                <p>Motif searching ...</p>
            </div>`
            // Perform motif searching request
            const response = await fetch(motif_url, {
                method: "post"
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status == "error") {
                    throw new Error(data.message);
                } else {
                    let display_html = `<div class="result-box more-sugar-font">
                                                <p>total sequences scanned: <b>${data.total_seq}</b></p>
                                                <p>sequences with known motifs: <b>${data.motif_seq}</b></p>`
                    if(data.motif_seq<=0){
                        display_html += `<p>did not find matched motifs</p>
                                        <p>please try other sequences</p>
                                        </div>`
                    }else{
                        display_html += `<p>Associated motifs (<b>${data.associated_motif}</b>):</p>
                                        <div>`
                        //obtain the name of each motif
                        for(let motif_name of Object.keys(data.motif_dict)){
                            //display the motif name and matched sequnece number 
                            display_html += `<p> *** <b>${motif_name}</b> (${data.motif_dict[motif_name].length} sequences) *** </p> `
                        }
                        display_html += `</div></div>`
                    }
                                                
                    content_el.innerHTML = display_html
                    left_part_el.innerHTML = `<li class="more-sugar-font zip-download">
                                                    <a href="${data.zip_src}"  download>download results</a>
                                                    <img src="./imgs/heart_box.png" />
                                                </li>
                                                <li class="more-sugar-font zip-download" id="track-box">
                                                    <p>id: seq_${data.uniq_id}</p>
                                                    <img src="./imgs/heart_box.png" />
                                                </li>
                                                <li class="more-sugar-font"><a href="/~s2647596/analysis.html">return</a></li>` 
                    
                    //obtain the track box and copy the tracking id to clipboard
                    document.getElementById("track-box").addEventListener("click",function(){
                        navigator.clipboard.writeText(`seq_${data.uniq_id}`).then(()=>{
                            alert("tracking id copied")
                        }).catch(err=>{
                            alert("copy error" + err)
                        })
                    })

                    //send the result to motif_sqlInsert.php, save the data into sql
                    const formData = new FormData();
                    formData.append("uni_id", data.uniq_id);
                    formData.append("motif_list", Object.keys(data.motif_dict).join(";"));  // join motif names, separated by ";"
                    formData.append("total_seq_num", data.total_seq);
                    formData.append("motif_seq_num", data.motif_seq);
                    formData.append("motif_zip_dir", data.zip_src);

                    const response = await fetch("/~s2647596/php/motif_sqlInsert.php", {
                        method: "POST",
                        body: formData  
                    });

                    const responseData = await response.json();
                    if (!response.ok) {
                        throw new Error(`Error saving motif data: ${responseData.message}`);
                    }
                    
                }
            } else {
                throw new Error(`http code error: ${response.status}`);
            }
        }
    } catch (error) {
        alert(error)
        alert("please try again")
        content_el.innerHTML = `<img src="./imgs/motif.png" />`
        left_part_el.innerHTML = `<li id="upload_new" class=" more-sugar-font">
                                    <img src="./imgs/heart_box.png" />
                                    <label for="fileUpload" class="upload-btn">upload new seq</label>
                                    <input type="file" id="fileUpload" name="fileUpload" >
                                </li>
                                <li id="previous_seq" class=" more-sugar-font">
                                    <p>using previous seq</p>
                                    <img src="./imgs/heart_box.png" />
                                </li>
                                <li class="more-sugar-font"><a href="/~s2647596/analysis.html">return</a></li>`
        window.location.reload(true)
    }
}

// Call the async function
getStat(find_prev_seq, previous_seq_el, seq_id_url);
getStat(upload_file, file_el, upload_url);