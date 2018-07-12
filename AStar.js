create();

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
function initGrid(){

}
function drawGrid(closed, dist, graph) {
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    //mClosed.sort( function(a, b) { return a - b; } );
    for (var i = 0; i < 10; i++){
        for (var j = 0; j < 10; j++){
            document.write(graph[i][j] + " ");
        }
        document.write("<br>");
    }

    var i = 0;
    for (var y = 0; y < cols; y++) {
        for (var x = 0; x < rows; x++) { //add boxes by rows
            if (i === source){
                ctx.fillStyle = 'rgba(196,0,255,1)'; //source = purple
            }
            else if (i === end){
                ctx.fillStyle = 'rgba(256,0,0,1)'; //goal = red
            }
            else if (graph[Math.floor(i/rows)][i%cols] === 0){ //a wall
                document.write("index " + i + " is a wall");
                ctx.fillStyle = 'rgba(165,165,165,1)';
            }
            else if (closed[i] === true) { //visited
                ctx.fillStyle = 'rgba(0,256,0,1)';
                //i++; i++ in if statement only for numerical array of visited indices
            }
            else if (dist[y*rows + x] !== -1) //not visited but are accounted for, "adjacent boxes"
                ctx.fillStyle = 'rgba(0,0,256,1)';
            else                              //everything not visited or adjacent
                ctx.fillStyle = 'rgba(256,256,256,1)';
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
    var graph = [];
    //input();
    counter = 0;
    rows = 10;
    cols = 10;
    createGraph(graph);
    weight = 20;

    source = 0;
    end = 99;
    search(graph);
}
function createGraph(graph){

    document.write("here");
    for (var i = 0; i < rows; i++){
        graph[i] = [];
        for (var j = 0; j < cols; j++){
            graph[i][j] = Math.floor(Math.random() * 10);
        }
    }
    for (var i = 0; i < 10; i++){
        for (var j = 0; j < 10; j++){
            document.write(graph[i][j] + " ");
        }
        document.write("<br>");
    }
    return graph;
}
function heuristic(E){
    document.write("heuristic values: ");
    for (var i = 0; i < rows*cols; i++){
        E.push(Math.abs(Math.floor(end/rows) - Math.floor(i/rows)) + Math.abs(end%rows - i%rows))
        if (counter%rows === 0)
            document.write("<br>");
        document.write(E[i] + " ");
        counter++;
    }
}
function search(graph) {
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
        if (counter%rows === 0)
            document.write("<br>");
        document.write(dist[i] + " ");
        counter++;
    }
    document.write("<br> initial closed[]:")
    for (var i = 0; i < rows*cols; i++){
        if (counter%rows === 0)
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
                && isAdjacent(closed, adjIndex)
                && adjIndex !== lowestAdj
                && dist[adjIndex] < dist[lowestAdj] + graph[Math.floor(adjIndex / rows)][adjIndex % cols]
                && dist[adjIndex] === -1) {

                dist[adjIndex] = dist[lowestAdj] + graph[Math.floor(adjIndex / rows)][adjIndex % cols];

                for (var k = 0; k < rows*cols; k++) {
                    if (counter%rows === 0)
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
    drawGrid(closed, dist, graph);
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
function isAdjacent(closed, index){

    if (Math.floor(index/rows) !== 0) {

        if (closed[index-rows] === true) {

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
    if (index !== 99 && index%rows !== 9) {

        if (closed[index+1] === true) {

            return true;
        }
    }
    //is lower bounded, can check down
    if (Math.floor(index/rows) !== 9) {

        if (closed[index+rows] === true) {

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
