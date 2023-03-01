// Learn more https://docs.expo.io/guides/customizing-metro

// Add support for svg files: https://github.com/react-native-svg/react-native-svg#use-with-svg-files

const fs = require('fs');
const path = require('path');

const { getDefaultConfig } = require('expo/metro-config');

function getWorkspaceRoot() {
	const packageFile = path.join(__dirname, '../../package.json');
	const packageContent = fs.existsSync(packageFile) ? fs.readFileSync(packageFile, 'utf-8') : null;
	if (packageContent && JSON.parse(packageContent).name === '@wcpos/monorepo') {
		console.log('Found workspace root');
		return path.resolve(__dirname, '../..');
	}
	return null;
}

const projectRoot = __dirname;
const workspaceRoot = getWorkspaceRoot();

module.exports = (() => {
	const config = getDefaultConfig(__dirname);

	const {
		resolver: { sourceExts, assetExts },
	} = config;

	if (workspaceRoot) {
		config.watchFolders = [workspaceRoot];
	}

	config.resolver.disableHierarchicalLookup = true;
	config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

	// add target platform to sourceExts
	config.resolver.sourceExts = ['tauri.js', 'tauri.ts', 'tauri.tsx', 'tauri.jsx', ...sourceExts];

	if (workspaceRoot) {
		config.resolver.nodeModulesPaths.push(path.resolve(workspaceRoot, 'node_modules'));
	}

	return config;
})();
