let tabs = []
const tab_div = document.getElementById('tabs');
const editor_div = document.getElementById('editor-container');
let fileName = document.getElementById('fileName');
let currentFileName = ''

function init () {
    getFileNames();
    createTabs();
    handleTabs();
    currentFileName = fileName.value;
}
init();


// #region Create Tabs

//1. Main function that creates tabs.
function createTabs () {
    for (let i = 0; i < tabs.length; i++) {
        tab_div.appendChild(createTabHead(i + 1, tabs[i]));
        editor_div.appendChild(createEditor(i));
    }
}

//2. Creates TabHead Node.
function createTabHead (id, data) {
    let button = document.createElement('button');
    button.id = id;
    button.innerHTML = data;
    return button;
}

//3. Creates edtior node.
function createEditor (id) {
    let editor = document.createElement('div');
    editor.className = 'editor' + (id == 0 ? ' active' : '');
    editor.setAttribute('contenteditable', 'true');
    editor.id = `editor-${id + 1}`;
    editor.innerHTML = getEditorData(tabs[id]);

    if (id == 0) fileName.value = tabs[id];

    // if (newTab) {
    //     fileName.value = tabs[id];
    // } else {
    //     editor.innerHTML = getEditorData(tabs[id]);
    // }

    return editor;
}

//4. Creates New Tab:
document.getElementById('newTab').addEventListener('click', () => {
    reset();
    let cnt = 0;
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].includes('untitled')) {
            cnt++;
        }
    }
    if (cnt > 0) tabs.unshift(`untitled-${cnt}`);
    else tabs.unshift('untitled')

    createTabs();
    handleTabs();
});

//5. Rename Tab:
function renameTab (fname) {
    let activeTab = document.querySelector('.active').id;
    activeTab = activeTab.split('-')[1];
    let activeTabHead = document.getElementById(activeTab);
    if (activeTabHead.innerHTML != fname) {
        activeTabHead.innerHTML = fname;
    }
}

// #endregion -----------------------------------


// #region Display Tabs

// 1. sets the event listeners.
function handleTabs () {
    let tab_buttons = document.getElementById('tabs').children;

    for (let button of tab_buttons) {
        button.addEventListener('click', displayTabs);
    }
}

// 2. Callback function for handleTabs event listeners.
function displayTabs (e) {
    let activeTab = document.querySelector('.active').id;
    document.getElementById(activeTab).classList.remove('active');
    document.getElementById("editor-" + e.target.id).classList.add('active');
    fileName.value = e.target.innerHTML;
    currentFileName = fileName.value;
}

// #endregion -------------------------


// #region LocalStorage

//1. Save
editor_div.addEventListener('focusout', () => {
    let editor = document.querySelector('.active').innerHTML;
    let file = fileName.value;

    if (editor != '' && editor != 'Click Here to add new data') {
        localStorage.setItem(file, editor);
        currentFileName = file;
    }
});

//2. Rename 
fileName.addEventListener('focusout', () => {
    let fname = (fileName.value).trim()
    console.log(currentFileName, fname);
    renameTab(fname);
    if (!fileExist(currentFileName) && fname != currentFileName) {
        localStorage.setItem(fname, getEditorData(currentFileName));
        localStorage.removeItem(currentFileName);
        currentFileName = fname;
    }
});

//3. get fileNames
function getFileNames () {
    let data = Object.entries(localStorage);
    if (data.length != 0) {
        for (const i in data) {
            tabs.push(data[i][0]);
        }
    } else {
        tabs.push('untitled')
    }
}

//4. get editor data
function getEditorData (key) {
    return localStorage.getItem(key);
}

//5. check if file exist
function fileExist (fname) {
    return localStorage.getItem(fname) === null;
}

// #endregion --------------------


// #region Utility Functions:

// 1. Reset
function reset () {
    let tab_buttons = document.getElementById('tabs').children;
    for (let button of tab_buttons) {
        button.removeEventListener('click', displayTabs);
    }

    tab_div.innerHTML = "";
    editor_div.innerHTML = "";
}

// #endregion --------------------
