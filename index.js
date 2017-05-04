//'use strict';
const electron = require('electron');
var {app, BrowserWindow, ipcMain, Menu} = electron


function setPage(txt) { mainWindow.webContents.send('page', {msg: txt})}

//function setPage(txt) { setTimeout(function() {mainWindow.webContents.send('info', {msg: txt})}, 300)/
//}
//
function mConnections() {setPage('connections')}
//function mConnections() {console.log('menuJs Connections'); 
//	sendWindow('Page2')}

const template = [
    { label: 'File',
    submenu: [
		{ label: 'Sizing', click: function() { setPage('sizing')}},
        { label: 'Connections', click: function() { mConnections() } },
        { label: 'Exit', role: 'close', }
     ]}
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
var mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

function sendWindow(txt) { console.log('indexJs->sendWindow sending '+txt); 
	setTimeout(function() {mainWindow.webContents.send('info', {msg: txt})}, 300)
}

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
		setTimeout(sendWindow('activate'))
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});

//ipcMain.on('pagesJsUp', function(e) {console.log('indexJs received pagesUp')})

//ipcMain.on('message1', function() {console.log('indexJs received message1')})