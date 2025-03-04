// Obtain elements
const previous_seq_el = document.getElementById("start-btn");
const seq_id_url = "/~s2647596/php/seq_id.php";
const file_el = document.getElementById("fileUpload")
const content_el = document.getElementById("content-box")
const left_part_el = document.getElementById("left-part")
const upload_url = "/~s2647596/php/upload_file.php"
const conservation_url = "/~s2647596/php/conservation.php"

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
                <p>Multiple alignment ...</p>
                <p>Conservation analysis ...</p>
             </div>`
            // Perform conservation plot request
            const response = await fetch(conservation_url, {
                method: "post"
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status == "error") {
                    throw new Error(data.message);
                } else {
                    content_el.innerHTML = `<img src=${data.plot_src} />`
                    left_part_el.innerHTML = `<li class="more-sugar-font zip-download">
                                                    <a href="${data.zip_src}"  download>download results</a>
                                                    <img src="./imgs/heart_box.png" />
                                                </li>
                                                <li class="more-sugar-font zip-download" id="track-box">
                                                    <p>id: ${data.tracking_id}</p>
                                                    <img src="./imgs/heart_box.png" />
                                                </li>
                                                <li class="more-sugar-font"><a href="/~s2647596/analysis.html">return</a></li>`

                    //obtain the track box and copy the tracking id to clipboard
                    document.getElementById("track-box").addEventListener("click",function(){
                        navigator.clipboard.writeText(data.tracking_id).then(()=>{
                            alert("tracking id copied")
                        }).catch(err=>{
                            alert("copy error" + err)
                        })
                    })
                    
                }
            } else {
                throw new Error(`http code error: ${response.status}`);
            }
        }
    } catch (error) {
        alert(error)
        alert("please try again")
        content_el.innerHTML = `<img src="./imgs/conservation.png" />`
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