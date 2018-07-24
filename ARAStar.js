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

/*function drawGrid(graph){
    var g = document.getElementById('grid');
    var ctx = g.getContext('2d');
    g.style.left = "0 px";
    g.style.top = "0 px";
    g.style.position = "absolute";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    var gridCanvasSize = 1000;
    var boxSize = gridCanvasSize/rows;

    var i = 0;
    for (var y = 0; y < cols; y++){
        for (var x = 0; x < rows; x++){

            if (i === source){
                ctx.fillStyle = 'rgba(196,0,255,1)'; //source = purple
            }
            else if (i === end){
                ctx.fillStyle = 'rgba(256,0,0,1)'; //goal = red
            }
            else if (graph[Math.floor(i/rows)][i%cols] === 0){ //a wall
                ctx.fillStyle = 'rgba(165,165,165,1)';
            }
            else{
                ctx.fillStyle = 'rgba(256,256,256,1)';
            }
            ctx.beginPath();
            ctx.moveTo(x * boxSize, y * boxSize);
            ctx.lineTo(x * boxSize + boxSize, y * boxSize);
            ctx.stroke();
            ctx.lineTo(x * boxSize + boxSize, y * boxSize + boxSize);
            ctx.stroke();
            ctx.lineTo(x * boxSize, y * boxSize + boxSize);
            ctx.stroke();
            ctx.lineTo(x * boxSize, y * boxSize);
            ctx.stroke();
            ctx.fill();
            i++;
        }
    }
    var j = 0;
    ctx.font="30px Georgia";
    ctx.fillStyle = 'rgba(110,0,132,1)';
    for (var y = boxSize/2; y < gridCanvasSize; y+=boxSize){
        for (var x = boxSize/2 - 0.15*boxSize; x < gridCanvasSize; x+=boxSize){
            ctx.fillText(graph[Math.floor(j/rows)][j%rows],x,y);
            j++;
        }
    }
}*/
function drawPath(closed, dist, graph, path) {
    var p = document.getElementById('path');
    var ctx = p.getContext('2d');
    p.style.left = "1100 px";
    p.style.position = "absolute";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    var pathCanvasSize = 1000;
    var boxSize = pathCanvasSize/rows;

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
                ctx.fillStyle = 'rgba(165,165,165,1)';
            }
            else if (closed[i] === true) { //visited
                ctx.fillStyle = 'rgba(0,255,0,1)';
                //i++; i++ in if statement only for numerical array of visited indices
            }
            else if (dist[y*rows + x] !== -1) //not visited but are accounted for, "adjacent boxes"
                ctx.fillStyle = 'rgba(0,255,154,1)';
            else                              //everything not visited or adjacent
                ctx.fillStyle = 'rgba(256,256,256,1)';
            i++;
            ctx.beginPath();
            ctx.moveTo(x * boxSize, y * boxSize);
            ctx.lineTo(x * boxSize + boxSize, y * boxSize);
            ctx.stroke();
            ctx.lineTo(x * boxSize + boxSize, y * boxSize + boxSize);
            ctx.stroke();
            ctx.lineTo(x * boxSize, y * boxSize + boxSize);
            ctx.stroke();
            ctx.lineTo(x * boxSize, y * boxSize);
            ctx.stroke();
            ctx.fill();
        }
    }
    if (path !== undefined && path.length !== 0) {
        path.sort( function(a, b) { return a - b; } );
        var j = 0;
        var i = 0;
        for (var y = boxSize/2; y < pathCanvasSize; y+=boxSize){
            for (var x = boxSize/2 - 0.15*boxSize; x < pathCanvasSize; x+=boxSize){
                if (i === path[j]) {
                    ctx.fillText("O", x, y);
                    j++;
                }
                i++;

            }
        }
    }
    /*var j = 0;
    ctx.font="30px Georgia";
    ctx.fillStyle = 'rgba(110,0,132,1)';
    for (var y = boxSize/2; y < pathCanvasSize; y+=boxSize){
        for (var x = boxSize/2 - 0.15*boxSize; x < pathCanvasSize; x+=boxSize){
            if (dist[j] !== -1 && dist[j] !== 0)
                ctx.fillText(dist[j],x,y);
            j++;
        }
    }*/
}
function create(){
    var graph = [];
    //input();
    counter = 0;
    rows = 30;
    cols = 30;
    weight = 5;
    source = 0;
    end = 899;

    createGraph(graph);
    //drawGrid(graph);
    improvePath(graph);
}
function createGraph(graph){
    /*for (var i = 0; i < rows; i++){
        graph[i] = [];
        for (var j = 0; j < cols; j++){
            graph[i][j] = Math.floor(Math.random() * 10);
            if ((i*rows + j) === source || (i*rows + j) === end) { //if i is either source or end, while graph of i = 0, keep switching values
                while (graph[i][j] === 0) {
                    graph[i][j] = Math.floor(Math.random() * 10);
                }
            }
        }
    }*/
    for (var i = 0; i < rows; i++) {
        graph[i] = [];
        for (var j = 0; j < cols; j++) {
            var chance = Math.floor(Math.random() * 4);
            if (chance === 0){
                graph[i][j] = 0;
            }
            else
                graph[i][j] = 1;
            if ((i * rows + j) === source || (i * rows + j) === end) { //if i is either source or end, while graph of i = 0, keep switching values
                while (graph[i][j] === 0) {
                    graph[i][j] = 1;
                }
            }
        }
    }
    return graph;
}
function heuristic(E){
    //document.write("heuristic values: ");
    for (var i = 0; i < rows*cols; i++){
        E.push(Math.abs(Math.floor(end/rows) - Math.floor(i/rows)) + Math.abs(end%rows - i%rows))
        /*if (counter%rows === 0)
            document.write("<br>");
        document.write(E[i] + " ");
        counter++;*/
    }
}
function improvePath(graph){
    var incons = [5];
    for (var i = 0; i < 3; i++) {
        console.log("<br> ITERATION CUT <br>");
        //if (incons !== null && incons.length !== 0) {
            weight -= 1;
            search(graph, incons);
        //}
        //else
          //  break;
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function search(graph, incons) {
    var path = [];
    var closed = [];
    var mClosed = [];
    var dist = [];
    var E = [];
    heuristic(E);
    for (var i = 0; i < rows * cols; i++) {//initialize arrays

        closed[i] = false;
        if (graph[Math.floor((i / rows))][i % cols] !== 0) {
            dist.push(-1);
        }
        else {
            dist.push(0);
        }
    }
    /*document.write("<br> initial dist[]:");
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
    }*/
    var lowestAdj = source; //initialize first adj index to source
    dist[source] = 0; //we start at 0 distance
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
                }
            }
            lowestAdj = findMin(dist, E, closed, graph);
            mClosed.push(lowestAdj); //in case i need it, closed does the job right now
            closed[lowestAdj] = true;
            drawPath(closed, dist, graph, path);

            if (lowestAdj === -1 || lowestAdj === end) //lowestAdj becomes -1 when the closed array is filled with true
                break loop1;
            await sleep(50);
        }
    path = chartPath(dist, closed, path);
    drawPath(closed, dist, graph, path);
    printPath(dist); //using document.write() clears the page
    return 1;
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
    //is up bounded, can check up
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
    if (index !== (rows*cols-1) && index%rows !== (cols-1)) {
        if (closed[index+1] === true) {
            return true;
        }
    }
    //is lower bounded, can check down
    if (Math.floor(index/rows) !== (rows-1)) {
        if (closed[index+rows] === true) {
            return true;
        }
    }
    return false; //no adjacent vertex in closed set
}
function adjacentTo(center, neighbor) {
    if (Math.floor(center / rows) !== 0) {
        if (neighbor === (center - rows)) {
            return true;
        }
    }
    //is left bounded, can check left, exception made for (0, 0)
    if (center !== 0 && center % rows !== 0) {
        if (neighbor === (center - 1)) {
            return true;
        }
    }
    //is right bounded, can check right, exception made for bottom right corner
    if (center !== (rows * cols - 1) && center % rows !== (cols - 1)) {
        if (neighbor === (center + 1)) {
            return true;
        }
    }
    //is lower bounded, can check down
    if (Math.floor(center / rows) !== (rows - 1)) {
        if (neighbor === (center + rows)) {
            return true;
        }
    }
    return false; //no adjacent vertex in closed set
}
function chartPath(dist, closed) {
    var path = [];
    path.push(end);
    var min = end;
    var index = 1;
    loop2:
        for (var i = 0; i < closed.length; i++){ //path can be as long as closed, could use more efficient loop but no idea how to move closed's true values into a separate array
            for (var j = 0; j < closed.length; j++) { //search through every closed value for earlier connection in the path
                if (closed[j] === true) { //j is green
                    if (adjacentTo(path[index-1], j)) { //j is adjacent to last plotted value
                        if (dist[j] < dist[min]) //if j is earlier along the path than min is
                            min = j;
                    }
                }
            }
            if (min === source){
                console.log("reached source");
                break loop2;
            }
            if (min !== path[index-1]) {//if not the same as the last one
                console.log("min = " + min + "<br>");
                path.push(min); //gather indices of the path into non-ordered array
                index++; //manual way of keeping track of used indices
            }
        }
    console.log("length = " + (path.length - 1));
    return path;
}
function printPath(dist) {
    if (dist[end] === -1) {
        console.log("oops, something went wrong");
    }
    else
        console.log("the distance to (" + Math.floor(end/rows) + ", " + end%rows + ") is " + (dist[end]-dist[source]));
}
