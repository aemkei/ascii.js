var image = new Image(),
  canvas = document.createElement("canvas"),
  ctx = canvas.getContext("2d"),
  cell = { width: 8, height: 12 },
  chars = {},
  scale = 1;

canvas.width = cell.width;
canvas.height = cell.height;
ctx.font = cell.height + "px monospace";

function clear(){
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, cell.width, cell.height);
}

function getCharData(character){
  if (character == "_"){ return; }

  clear();
  ctx.fillStyle = "#000";
  ctx.fillText(character, 0, cell.height/1.2);

  chars[character] = ctx.getImageData(0, 0, cell.width, cell.height).data;
}

for (var c = 32; c < 127; c++){
  getCharData(String.fromCharCode(c));
}

function getNearest(imageData){
  var charData,
    min = Infinity,
    best = " ",
    c, i, diff;

  for (c in chars){
    charData = chars[c];
    diff = 0;

    for (i = 0; i < charData.length; i += 4){
      if (imageData[i+3]){
        diff += Math.abs(imageData[i] > 200 != charData[i] > 200);
      }
    }

    if (diff < min){
      min = diff;
      best = c;
    }
  }

  if (best == "Q" || best == "M"){ return "#"; }

  return best;
}

image.onload = function(){
  var out = "",
    width = image.width * scale,
    height = image.height * scale,
    scaledHeight = height * 0.92,
    data, x, y;

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, scaledHeight);

  for (y = 0; y < scaledHeight; y += cell.height + 2){
    for (x = 0; x < width; x += cell.width){
      data = ctx.getImageData(x, y, cell.width, cell.height).data;
      out += getNearest(data);
    }

    out += "\n";
  }

  ctx.drawImage(image, 0, 0, width, height);


  var output = document.getElementById("output"),
    pre = document.createElement("pre");

  output.style.width = width + "px";
  output.style.height = height + "px";

  pre.innerText = out;
  output.appendChild(canvas);
  output.appendChild(pre);
};

image.src = "image.png";