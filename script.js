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
    if (id == 1) {
        button.className = 'activeTabHead';
        button.style.borderBottom = '1px solid white';
        button.style.backgroundColor = '#2C313A';
    }
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

    if (id == 0) {
        fileName.value = tabs[id];
        changeWidth();
    }
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
    changeWidth();
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
    setActiveTabCSS();
    changeWidth();
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

        // Show Success Message
        showMessage();
    }
});

//2. Rename 
fileName.addEventListener('focusout', () => {
    let fname = (fileName.value).trim()
    renameTab(fname);
    let editor = document.querySelector('.active').innerHTML;
    if (!fileExist(currentFileName) && fname != currentFileName && editor != '') {
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

// 2. set css of current tab head.
function setActiveTabCSS () {
    // Removing previous tab head css.
    let activeTabHead = document.querySelector('.activeTabHead');
    activeTabHead.style.borderBottom = '1px solid #282C34';
    activeTabHead.style.backgroundColor = '#282C34';
    activeTabHead.classList.remove('activeTabHead');

    // Adding css
    let id = document.querySelector('.active').id.split('-')[1];
    activeTabHead = document.getElementById(id);
    activeTabHead.classList.add('activeTabHead');
    activeTabHead.style.borderBottom = '1px solid #fff';
    activeTabHead.style.backgroundColor = '#2C313A';
}
// #endregion --------------------


// #region CSS editing Functions:
function increaseWidth (e) {
    if (e.offsetWidth < 600) {
        e.style.width = 200 + ((e.value.length + 1) * 8) + 'px';
        // e.style.width = (e.value.length + 1) + 'ch';
    }
}

function changeWidth () {
    if (fileName.value.length < 10) {
        fileName.style.width = 200 + 'px';
    } else if (fileName.value.length > 46) {
        fileName.style.width = 600 + 'px';
    } else {
        fileName.style.width = (fileName.value.length + 1) + 'ch';
    }
}

function showMessage () {
    let message = document.getElementById('message');
    message.style.display = 'flex';
    setTimeout(() => {
        message.style.display = 'none';
    }, 900);
}
// #endregion   