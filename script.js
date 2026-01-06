// -------- LRU Cache Variables --------
let capacity = 0;
let cacheMap = new Map();

// Doubly Linked List Node
class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

// Head = Most Recently Used
// Tail = Least Recently Used
let head = null;
let tail = null;

// -------- Core Functions --------

// Set cache capacity
function setCapacity() {
    capacity = parseInt(document.getElementById("capacity").value);

    cacheMap.clear();
    head = tail = null;

    alert("Cache capacity set to " + capacity);
}

// Add node to front (Most Recently Used)
function addToFront(node) {
    node.next = head;
    node.prev = null;

    if (head !== null) {
        head.prev = node;
    }

    head = node;

    if (tail === null) {
        tail = node;
    }
}

// Remove node from list
function removeNode(node) {
    if (node.prev !== null) {
        node.prev.next = node.next;
    } else {
        head = node.next;
    }

    if (node.next !== null) {
        node.next.prev = node.prev;
    } else {
        tail = node.prev;
    }
}

// Move node to front
function moveToFront(node) {
    removeNode(node);
    addToFront(node);
}

// Put key-value
function putValue() {
    const key = document.getElementById("key").value;
    const value = document.getElementById("value").value;
    const status = document.getElementById("statusMessage");

    if (!key || !value || capacity === 0) {
        status.innerText = "❌ Please enter capacity, key and value";
        return;
    }

    if (cacheMap.has(key)) {
        // UPDATE
        let node = cacheMap.get(key);
        node.value = value;
        moveToFront(node);

        status.innerText = `✅ Updated key ${key}`;
    } else {
        // PUT
        let newNode = new Node(key, value);

        if (cacheMap.size >= capacity) {
            cacheMap.delete(tail.key);
            removeNode(tail);
        }

        addToFront(newNode);
        cacheMap.set(key, newNode);

        status.innerText = `✅ Added key ${key}`;
    }

    printCache(); // auto refresh UI
}


// Get value (access)
function getValue() {
    const key = document.getElementById("key").value;
    const status = document.getElementById("statusMessage");

    if (!cacheMap.has(key)) {
        status.innerText = `❌ Key ${key} not found`;
        return;
    }

    let node = cacheMap.get(key);
    moveToFront(node);

    status.innerText = `ℹ️ Accessed key ${key}, value = ${node.value}`;
    printCache();
}


//Print Cache
function printCache() {
    const display = document.getElementById("cacheDisplay");
    display.innerHTML = "";

    let current = head;

    if (!current) {
        display.innerText = "Cache is empty";
        return;
    }

    while (current !== null) {
        const nodeDiv = document.createElement("div");
        nodeDiv.className = "node";

        // Highlight MRU & LRU
        if (current === head) {
            nodeDiv.classList.add("mru");
        }
        if (current === tail) {
            nodeDiv.classList.add("lru");
        }

        nodeDiv.innerText = `${current.key} : ${current.value}`;
        display.appendChild(nodeDiv);

        if (current.next !== null) {
            const arrow = document.createElement("span");
            arrow.className = "arrow";
            arrow.innerText = "→";
            display.appendChild(arrow);
        }

        current = current.next;
    }
}
function resetCache() {
    cacheMap.clear();
    head = null;
    tail = null;

    document.getElementById("cacheDisplay").innerHTML = "";
    document.getElementById("statusMessage").innerText = "🔄 Cache cleared";

}
