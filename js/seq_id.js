const find_prev_seq = (btn_el, url) => {
    // Return a Promise
    return new Promise((resolve, reject) => {
        btn_el.addEventListener("click", async () => {
            try {
                // Send fetch request
                const response = await fetch(url, {
                    method: "post"
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
                alert(err);
                reject("error");
            }
        }, true);
    });
}

export default find_prev_seq;
