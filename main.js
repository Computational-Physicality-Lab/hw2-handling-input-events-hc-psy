// NOTE: The variable "shirts" is defined in the shirts.js file as the full list of shirt offerings
//       You can access this variable here, and should use this variable here to build your webpages

function home() {
    window.location.href = "index.html";
}

function details(i) {
    localStorage.clear();
    localStorage.setItem('id', i);
    window.open("details.html", "_self");
}

let closePreview = () => {
    document.getElementById("preview-box").style.display = "none";
    let node_id = localStorage.getItem("prev_shirt");
    console.log(node_id);
    document.getElementById(node_id).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

let getColorNumAndPreview = (colors) => {
    let cnt = 0;
    let preview_front = "";
    let preview_back = "";
    for (var i in colors) {
        if (preview_front == "") {
            preview_front = colors[i].front;
            preview_back = colors[i].back;
        }
        cnt++;
    }
    return { "cnt": cnt, "preview_front": preview_front, "preview_back": preview_back };
}


let initProducts = () => {
    for (let i = 0; i < shirts.length; i += 1) {
        localStorage.setItem(shirts[i].name, JSON.stringify(shirts[i]));

        var element = document.getElementById('products');

        var productName = shirts[i].name ? shirts[i].name : 'Unnamed';
        var productImage = shirts[i].colors.white ? shirts[i].colors.white.front : shirts[i].default.front;
        var productColors = Object.keys(shirts[i].colors).length;
        var div = document.createElement('div');
        div.className = "individual_product";

        var image = document.createElement('img');
        image.setAttribute('src', productImage);
        image.style.width = "100%";

        var name = document.createElement('h4');
        name.innerHTML = productName;

        var availability = document.createElement('p');
        var text1 = document.createTextNode("Available in ");
        var text2 = document.createTextNode(productColors);
        var text3 = document.createTextNode(" colors");
        availability.appendChild(text1);
        availability.appendChild(text2);
        availability.appendChild(text3);

        let btn_div = document.createElement("div");
        btn_div.className = 'btn_wrapper';

        let quick_view = document.createElement("button");
        quick_view.className = 'product_btn';
        quick_view.innerHTML = "Quick View";

        // Missing Values
        let avail_colors = getColorNumAndPreview(shirts[i].colors);
        let avail_colors_front = avail_colors.preview_front ? avail_colors.preview_front : shirts[i].default.front;
        let avail_colors_back = avail_colors.preview_back ? avail_colors.preview_back : shirts[i].default.back;
        let title = shirts[i].name ? shirts[i].name : 'Unnamed';
        let price = shirts[i].price ? shirts[i].price : 'No on sale';
        let text = shirts[i].description ? shirts[i].description : 'TBA...';


        quick_view.onclick = () => {
            let preview_box = document.getElementById("preview-box");
            preview_box.style.display = "flex";
            document.getElementById("preview-img-front").src = avail_colors_front;
            document.getElementById("preview-img-back").src = avail_colors_back;
            document.getElementById("preview-img-front").onclick = () => {
                localStorage.clear();
                localStorage.setItem('id', id);
                window.open("details.html", "_self");
            }
            document.getElementById("preview-img-back").onclick = () => {
                localStorage.clear();
                localStorage.setItem('id', id);
                window.open("details.html", "_self");
            }
            document.getElementById("preview-title").innerText = title;
            document.getElementById("preview-price").innerText = price;
            document.getElementById("preview-text").innerText = text;
            preview_box.scrollIntoView({ behavior: 'smooth', block: 'center' });
            localStorage.setItem('prev_shirt', id);
        }

        let see_page = document.createElement("button");
        see_page.className = 'product_btn';
        see_page.innerHTML = "See Page";
        see_page.onclick = function () { details(i) };

        div.appendChild(image);
        div.appendChild(name);
        div.appendChild(availability);
        div.appendChild(btn_div)
        btn_div.appendChild(quick_view);
        btn_div.appendChild(see_page);

        element.appendChild(div);
    }
};


const appendSideButton = (rootNode, img_front, img_back) => {
    if (img_front) {
        var new_button = document.createElement("div");
        new_button.innerText = "Front";
        new_button.className = "detail-content-side-button";
        new_button.onclick = () => {
            document.getElementById("detail-content-img").src = img_front;
        }
        rootNode.appendChild(new_button);
    }
    if (img_back) {
        var new_button = document.createElement("div");
        new_button.innerText = "Back";
        new_button.className = "detail-content-side-button";
        new_button.onclick = () => {
            document.getElementById("detail-content-img").src = img_back;
        }
        rootNode.appendChild(new_button);
    }
}

let initDetails = () => {
    let product_id = localStorage.getItem("id");
    console.log(product_id);

    // Missing Values
    let avail_colors = getColorNumAndPreview(shirts[product_id].colors);
    let avail_colors_front = avail_colors.preview_front ? avail_colors.preview_front : shirts[product_id].default.front;
    let avail_colors_back = avail_colors.preview_back ? avail_colors.preview_back : shirts[product_id].default.back;
    let title = shirts[product_id].name ? shirts[product_id].name : 'Unnamed';
    let price = shirts[product_id].price ? shirts[product_id].price : 'Not on sale';
    let text = shirts[product_id].description ? shirts[product_id].description : 'TBA...';

    document.getElementById("detail-title").innerText = title;
    document.getElementById("detail-content-img").src = avail_colors_front;
    document.getElementById("detail-content-price").innerText = price;
    document.getElementById("detail-content-text").innerText = text;

    let side_button_box = document.getElementById("detail-content-side-button-box");
    let color_button_box = document.getElementById("detail-content-color-button-box");
    color_button_box.innerHTML = shirts[product_id].colors ? "" : "Not Available";
    side_button_box.innerHTML = shirts[product_id].colors ? "" : "Not Available";


    for (var color in shirts[product_id].colors) {
        console.log(color, shirts[product_id].colors[color]);

        if (side_button_box.innerHTML == "") {
            appendSideButton(side_button_box, shirts[product_id].colors[color].front, shirts[product_id].colors[color].back);
        }

        var new_button = document.createElement("div");
        new_button.innerText = color.charAt(0).toUpperCase() + color.slice(1);
        new_button.className = "detail-content-color-button";
        new_button.style.backgroundColor = color;

        let img_front = shirts[product_id].colors[color].front;
        let img_back = shirts[product_id].colors[color].back;
        new_button.onclick = () => {
            side_button_box.innerHTML = "";
            document.getElementById("detail-content-img").src = img_front;
            appendSideButton(side_button_box, img_front, img_back);
        }
        color_button_box.appendChild(new_button);
    }
};