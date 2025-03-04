const find_prev_seq = (btn_el, url) => {
    //obtain user input 
    const input_el = document.getElementById("track-input")
    
    // Return a Promise
    return new Promise((resolve, reject) => {
        btn_el.addEventListener("click", async () => {
            try {
                // Send fetch request
                //the user input
                var input_data = new FormData();
                input_data.append("tracking_id", input_el.value)
                const response = await fetch(url, {
                    method: "post",
                    body:input_data
                });

                if (!response.ok) {
                    throw new Error(`http code error: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === "error") {
                    throw new Error(data.message);
                } else {
                    alert(data.message);
                    resolve("success");
                }
            } catch (err) {
                reject(err);
            }
        }, true);
    });
}

export default find_prev_seq;
