var graph = [];
var rows;
var cols;
var counter;
var start;
var goal;
var weight;
createGraph();

function input(){
    weight = document.getElementById("weight").value;
    start = parseFloat(document.getElementById("startX").value) * rows + parseFloat(document.getElementById("startY").value);
    goal = parseFloat(document.getElementById("goalX").value) * rows + parseFloat(document.getElementById("goalY").value);
}
function drawGrid(){
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
            if (i === start){
                ctx.fillStyle = 'rgba(196,0,255,1)'; //start = purple
            }
            else if (i === goal){
                ctx.fillStyle = 'rgba(256,0,0,1)'; //goal = red
            }
            else if (graph[Math.floor(i/rows)][i%cols] === 0){ //a wall
                ctx.fillStyle = 'rgba(165,165,165,1)';
            }
            else                              //everything else white
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
}  
function drawPath(closed, dist, path) {
    var p = document.getElementById('path');
    var ctx = p.getContext('2d');
    p.style.left = "1100 px";
    p.style.position = "absolute";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    var pathCanvasSize = 1000;
    var boxSize = pathCanvasSize/rows;
    var i = 0;
    var j = 0;

    for (var y = 0; y < cols; y++) {
        for (var x = 0; x < rows; x++) { //add boxes by rows
            if (i === start){
                ctx.fillStyle = 'rgba(196,0,255,1)'; //start = purple
            }
            else if (i === goal){
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
             if (path[j] === i){
                ctx.fillStyle = 'rgba(51, 204, 255,1)';
                j++;
            }
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
}
function create(){
    counter = 0;
    input();
    search();
}
function createGraph(){
    rows = 30;
    cols = 30;
    for (var i = 0; i < rows; i++) {
        graph[i] = [];
        for (var j = 0; j < cols; j++) {
            var chance = Math.floor(Math.random() * 5);
            if (chance === 0){
                graph[i][j] = 0;
            }
            else
                graph[i][j] = 1;
            if ((i * rows + j) === start || (i * rows + j) === goal) { //if i is either start or goal, while graph of i = 0, keep switching values
                while (graph[i][j] === 0) {
                    graph[i][j] = 1;
                }
            }
        }
    }
    drawGrid();    
}
function heuristic(E){
    for (var i = 0; i < rows*cols; i++){
        E.push(Math.abs(Math.floor(goal/rows) - Math.floor(i/rows)) + Math.abs(goal%rows - i%rows))
        
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function search() {
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
    var lowestAdj = start; //initialize first adj index to start
    dist[start] = 0; //we start at 0 distance
    closed[start] = true; //change start's closed value
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

            if (lowestAdj === -1 || lowestAdj === goal) //lowestAdj becomes -1 when the closed array is filled with true
                break loop1;
            await sleep(50);
        }
    path = chartPath(dist, closed, path);
    drawPath(closed, dist, path);
    printPath(dist); //using document.write() clears the page
}
function findMin(dist, E, closed){
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
    path.push(goal);
    var min = goal;
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
        if (min === start){
            console.log("reached start");
            break loop2;
        }
        if (min !== path[index-1]) {//if not the same as the last one
            console.log("min = " + min + "<br>");
            path.push(min); //gather indices of the path into non-ordered array
            index++; //manual way of keeping track of used indices
        }
    }
    console.log("length = " + (path.length - 1));
    path.shift();
    path.sort( function(a, b) { return a - b; } );
    return path;
}
function printPath(dist) {
    if (dist[goal] === -1) {
        console.log("oops, something went wrong");
    }
    else
        console.log("the distance to (" + Math.floor(goal/rows) + ", " + goal%rows + ") is " + (dist[goal]-dist[start]));
}
