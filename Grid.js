create();
var rows;
var path = [];
var dist = [];
function create(){
    rows = 5;
    loop();
}
function loop(){
    path = [4, 3, 7, 9, 10];
    dist = [0, 0, -1, 0, 0, -1, 0, 0, -1, -1, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0];


    path.sort( function(a, b) { return a - b; } );
    for (var i = 0; i < path.length; i++){
        document.write(path[i] + " ");
    }

    drawGrid();
}
function drawGrid() {
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    var i = 0;
    for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 5; x++) { //add boxes by rows
            document.write((path[i] === (y * rows + x)) + " comparing " + path[i] + " and " + (y*rows+x) +  "<br>");
            if ((path.length > i) && (path[i] === (y * rows + x))) {
                ctx.fillStyle = 'rgba(0,256,0,1)';
                i++;
                document.write("in");
            }
            else if (dist[y*rows + x] !== -1)
                ctx.fillStyle = 'rgba(0,0,256,1)';
            else
                ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.beginPath();
            ctx.moveTo(x * 100, y * 100);
            ctx.lineTo(x * 100 + 100, y * 100);
            ctx.stroke();
            ctx.lineTo(x * 100 + 100, y * 100 + 100);
            ctx.stroke();
            ctx.lineTo(x * 100, y * 100 + 100);
            ctx.stroke();
            ctx.lineTo(x * 100, y * 100);
            ctx.stroke();
            ctx.fill();

        }
    }
}
