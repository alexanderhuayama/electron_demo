'use strict';

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;
let newProductWindow;

// Reload in Development for Browser Windows
if (process.env.NODE_ENV === 'development') {
	require('electron-reload')(__dirname, {
		electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
	});
}

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		}
	});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'views/index.html'),
		protocol: 'file',
		slashes: true
	}));

	const mainMenu = Menu.buildFromTemplate(templateMenu);
	Menu.setApplicationMenu(mainMenu);

	mainWindow.on('closed', () => {
		app.quit();
	});
})

function createNewProuctWindow() {
	newProductWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		width: 400,
		height: 330,
		title: 'Add a New Product'
	});

	// newProductWindow.setMenu(null);

	newProductWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'views/new-product.html'),
		protocol: 'file',
		slashes: true
	}));

	newProductWindow.on('closed', () => {
		newProductWindow = null;
	});
}

ipcMain.on('product:new', (e, prod) => {
	mainWindow.webContents.send('product:new', prod);
	newProductWindow.close();
});

const templateMenu = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Product',
				accelerator: 'Ctrl+N',
				click() {
					createNewProuctWindow()
				}
			},
			{
				label: 'Remove All Products',
				click() {
					mainWindow.webContents.send('products:remove-all');
				}
			},
			{
				label: 'Exit',
				accelerator: process.platform === 'darwin' ? 'command+Q' : 'Ctrl+Q',
				click() {
					app.quit();
				}
			}
		]
	}
];

if (process.platform === 'darwin') {
	templateMenu.unshift({
		label: app.getName()
	});
}

if (process.env.NODE_ENV !== 'development') {
	templateMenu.push({
		label: 'DevTools',
		submenu: [
			{
				label: 'Show/Hide Dev Tools',
				accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	})
}