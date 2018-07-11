create();

var graph = [];
//var path = []; //for the actual path, not closed list
var rows;
var cols;
var counter;
var source;
var end;
var weight;

function input(){
    source = parseInt(document.getElementById("startX").value) * 10 + parseInt(document.getElementById("startY").value);
    end = parseInt(document.getElementById("endX").value) * 10 + parseInt(document.getElementById("endY").value);
    weight = parseInt(document.getElementById("weight").value);
    document.write("START = " + start +  " END = " + end + " WEIGHT = " + weight);
}

function drawGrid(closed, dist) {
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    //mClosed.sort( function(a, b) { return a - b; } );


    var i = 0;
    for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 5; x++) { //add boxes by rows
            document.write("i = " + i + " " + closed[i] + "<br>");
            if ((closed.length > i) && (closed[i] === true)) {
                ctx.fillStyle = 'rgba(0,256,0,1)';
                //i++; i++ in if statement only for numerical array of visited indices
            }
            else if (dist[y*rows + x] !== -1)
                ctx.fillStyle = 'rgba(0,0,256,1)';
            else
                ctx.fillStyle = 'rgba(0,0,0,1)';
            i++;
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

function create(){
    //input();
    counter = 0;
    rows = 5;
    cols = 5;
    graph = [[1, 2, 0, 3, 4],
            [3, 3, 3, 0, 3],
            [2, 0, 4, 7, 3],
            [3, 2, 3, 0, 3],
            [5, 4, 7, 4, 1]];
    weight = 0;

    source = 0;
    end = 24;
    search();
}
function heuristic(E){
    document.write("heuristic values: ");
    for (var i = 0; i < rows*cols; i++){
        E.push(Math.abs(Math.floor(end/rows) - Math.floor(i/rows)) + Math.abs(end%rows - i%rows))
        if (counter%5 === 0)
            document.write("<br>");
        document.write(E[i] + " ");
        counter++;
    }
}
function search() {
    var closed = [];
    var mClosed = [];
    var dist = [];
    var E = [];
    heuristic(E);
    for (var i = 0; i < rows * cols; i++) {
        closed[i] = false;
        if (graph[Math.floor((i / rows))][i % cols] !== 0) {
            dist.push(-1);
        }
        else {
            dist.push(0);
        }
    }//initialize arrays
    document.write("<br> initial dist[]:");
    for (var i = 0; i < rows*cols; i++){
        if (counter%5 === 0)
            document.write("<br>");
        document.write(dist[i] + " ");
        counter++;
    }
    document.write("<br> initial closed[]:")
    for (var i = 0; i < rows*cols; i++){
        if (counter%5 === 0)
            document.write("<br>");
        document.write(closed[i] + " ");
        counter++;
    }

    var lowestAdj = source; //initialize first adj index to source
    dist[source] = graph[Math.floor(source / rows)][source % cols]; //fill source's distance value
    closed[source] = true; //change source's closed value

    loop1:
    for (var j = 0; j < rows * cols; j++) {
        for (var adjIndex = 0; adjIndex < rows * cols; adjIndex++) {

            if (!closed[adjIndex]
                && graph[Math.floor(adjIndex / rows)][adjIndex % cols] !== 0
                && isAdjacent(dist, closed, adjIndex)
                && adjIndex !== lowestAdj
                && dist[adjIndex] < dist[lowestAdj] + graph[Math.floor(adjIndex / rows)][adjIndex % cols]
                && dist[adjIndex] === -1) {

                dist[adjIndex] = dist[lowestAdj] + graph[Math.floor(adjIndex / rows)][adjIndex % cols];

                for (var k = 0; k < rows*cols; k++) {
                    if (counter%5 === 0)
                        document.write("<br>");
                    document.write(dist[k]+ " ");
                    counter++;
                }
                counter = 0;
                document.write("<br>");
            }
        }
        lowestAdj = findMin(dist, E, closed, graph);
        mClosed.push(lowestAdj); //in case i need it, closed does the job right now
        closed[lowestAdj] = true;
        if (lowestAdj === -1 || lowestAdj === end) //lowestAdj becomes -1 when the closed array is filled with true
            break loop1; //hmmmm....

    }
    printPath(dist);
    drawGrid(closed, dist);
}
function findMin(dist, E, closed, graph){

    var min = 42424242;
    var minIndex= -1;
    for (var i = 0; i < rows*cols; i++){

        //if not part of closed set AND not a wall
        //AND less than current min AND adjacent to closed set

        if (closed[i] === false && graph[Math.floor(i/rows)][i%cols] !== 0
            && dist[i]+ weight*E[i] <= min
            && dist[i] !== -1)
        {

            min = dist[i]+ weight*E[i]; //f = g + h
            minIndex = i;
        }
    }
    return minIndex;
}
function isAdjacent(dist, closed, index){

    if (Math.floor(index/rows) !== 0) {

        if (closed[index-5] === true) {

            return true;
        }
    }
    //is left bounded, can check left, exception made for (0, 0)
    if (index !== 0 && index%rows !== 0) {

        if (closed[index-1] === true) {

            return true;
        }
    }
    //is right bounded, can check right, exception made for (4, 4)
    if (index !== 24 && index%rows !== 4) {

        if (closed[index+1] === true) {

            return true;
        }
    }
    //is lower bounded, can check down
    if (Math.floor(index/rows) !== 4) {

        if (closed[index+5] === true) {

            return true;
        }
    }
    return false; //no adjacent vertex in closed set
}
function printPath(dist) {
    if (dist[end] === -1) {
        document.write("oops, something went wrong");
    }
    else
        document.write("the distance to (" + Math.floor(end/rows) + ", " + end%rows + ") is " + (dist[end]-dist[source]));
}
