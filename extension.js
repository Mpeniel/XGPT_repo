// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
const jsbeautify = require('js-beautify').html_beautify
const textDocuments = vscode.workspace.textDocuments;
const lastTextDocument = textDocuments.slice(-1)[0];
const config = vscode.workspace.getConfiguration();
let selection = vscode.window.activeTextEditor.selection;
//const startLine = selection.start.line;
const endLine = selection.end.line;
const languages = [
	{ label: 'English', value: 'anglais' },
	{ label: 'Français', value: 'français' },
	{ label: 'Español', value: 'espagnole' },
	{ label: 'Deutsch', value: 'allemand' },
  ];
let doc;
async function getApiKey(){
	const apiKey = await vscode.window.showInputBox({
		prompt: "Saisissez votre clé API"
	  });
	  return apiKey;  
}
//Construction du header de la requête 
const axio = axios.default.create({
    headers: {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${config.get('apikey')}`
	}
});
let panel;
/* function insertTextInLastTextEditor(text){
	if (textEditor) {
		textEditor.edit(editBuilder =>{
			const lastLine = textEditor.document.lineCount - 1;
			const lastChar = textEditor.document.lineAt(lastLine).text.length;
			editBuilder.insert(new vscode.Position(lastLine, lastChar), `${text}`);
		} )
	}
} */
//Container où s'afficheront les résultats des requêtes
const getHtml = (prompt) => {
	return `
	<div id="container" style="background-color: black; margin-top: 10px; border-radius: 10px; display: flex; justify-content: center; align-items: center; height: 100%; width: 100%;">
  		<div id="result" style="background-color: black; border-radius: 10px; color: white; text-align: center; padding: 10px;">
   			 <!-- ANSWER -->
				${jsbeautify(prompt, {indent_size: 2})}
  		</div>
	</div>
	`
}
async function setLanguage(){
	const languageSelection = await vscode.window.showQuickPick(
		languages.map((l) => l.label),
		{placeHolder: 'Select your language', title : 'Language'}
	  );
	  
	  if (!languageSelection) {
		return 'français'; // l'utilisateur a annulé la sélection de langue
	  }
	  return languages.find((l) => l.label === languageSelection).value;
}
// Gère l'insertion du résultat dans l'éditeur de texte
function insertText(text) {
	vscode.window.activeTextEditor.edit(editBuilder => {
		const lastLine = lastTextDocument.lineCount - 1;
		const lastChar = lastTextDocument.lineAt(lastLine).text.length;
		editBuilder.insert(new vscode.Position(lastLine, lastChar), `${text}`);
	  });
}
function insertTextAsk(text) {
	vscode.window.activeTextEditor.edit(editBuilder => {
		const lastLine = endLine;
		//const lastChar = lastTextDocument.lineAt(lastLine).text.length;
		editBuilder.insert(new vscode.Position(lastLine, 0), `${text}`);
	  });
}
//Requête envoyée par l'utilisateur
async function openAiRequest(prompt,type) {
    try {
        // Envoyer une requête à l'API OpenAI
        await axio.post('https://api.openai.com/v1/completions', {
            prompt: prompt,
			model: "text-davinci-003",
            max_tokens: 2048,
            temperature: 0.5,
        }).then(async response => {
			const result = response.data.choices[0].text;
			console.log(jsbeautify(response.data.choices[0].text, {indent_size: 2}));
			switch (type) {
				case 'webView':
				  panel.webview.html += getHtml(result);
				  break;
				case 'explain':
				  insertText(result);
				  break;
				case 'ask':
					insertTextAsk(result);
					break;
				default:
					panel.webview.html += getHtml(result);
			  }
			
		});
    } catch (error) {
        vscode.window.showErrorMessage(error.message);
    }
}
// Barre de progression, loading
function gptAnswerWithProgressBar(prompt,type){
	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
	title: "LOADING...",
	cancellable: false
	}, (progress) => {
		return new Promise(async (resolve) =>{
			progress.report({ increment: 30 });
			progress.report({ increment: 60 });
			await openAiRequest(prompt,type);
			progress.report({ increment: 100 });
			resolve();
		})
	})
}
//Récupérer le text qui se trouve entre '//' et le curseur
function getTextBehindCursor() {
	const editor = vscode.window.activeTextEditor;
    if(!editor){
        vscode.window.showErrorMessage("Aucun éditeur n'est ouvert");
        return;
    }
    if(!editor.selection){
        vscode.window.showErrorMessage("Aucun texte n'est sélectionné");
        return;
    }
	 const selection = editor.selection;
	 const selectedText = editor.document.getText(selection);
	 let text = selectedText || editor.document.lineAt(selection.start.line).text.substring(0, selection.start.character);
 
	 // Extraire le texte entre '//' et le curseur
	 const startIndex = text.lastIndexOf('//');
	 if (startIndex !== -1) {
		 text = text.substring(startIndex + 2);
	 } else {
		 vscode.window.showInformationMessage('Aucun texte entre "//" et le curseur');
		 return;
	 }
	 return text;
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "heygpt" is now active!');

	let start = vscode.commands.registerCommand('heygpt.start', async function(){
		//let apiKey = config.get('apikey');
			/* if (!apiKey) {
			vscode.window.showWarningMessage("Please enter your API Key before using the extension");
			const apikey = await getApiKey();
			await vscode.workspace.getConfiguration().update('apikey',apikey, vscode.ConfigurationTarget.Global)
			} */
			const apiKeys = config.get('openaiApiKeys');
			let openaiApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
			await vscode.workspace.getConfiguration().update('apikey',openaiApiKey, vscode.ConfigurationTarget.Global)
			vscode.window.showInformationMessage('We have generated an api key for you :-) !');
		let xlanguage = config.get('xlanguage');
			if(!xlanguage){
				vscode.window.showWarningMessage("Please choose your favorite language before using the extension");
				const lang = await setLanguage();
				await vscode.workspace.getConfiguration().update('xlanguage',lang, vscode.ConfigurationTarget.Global)
			}
			
			panel = vscode.window.createWebviewPanel(
				'openAiResult',
				'GPT Result',
				vscode.ViewColumn.Beside,
				{ enableScripts: true }
			);
			doc = await vscode.workspace.openTextDocument({content:"//"});
			// Show the document in a new text editor
			await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside, preserveFocus:false });
			//console.log(textEditors, vscode.workspace.textDocuments)
			vscode.window.showInformationMessage('You can use XGPT now !'); 
	});

	let disposable = vscode.commands.registerCommand('heygpt.question', function () {
		// The code you place here will be executed every time your command is executed
		vscode.window.showInputBox({
			placeHolder: "What is your question ?"
		}).then(prompt =>{
			gptAnswerWithProgressBar(prompt+'.Mets ta réponse les dans un format html',"webView")
		});
	});
	let setApiKey = vscode.commands.registerCommand('heygpt.setApiKey', async function () {
		const apikey = await getApiKey();
		await vscode.workspace.getConfiguration().update('apikey',apikey, vscode.ConfigurationTarget.Global);
		console.log(config.get('apikey'))
		vscode.window.showInformationMessage('Your Api Key is registred. RESTART VSCODE !'); 
	});
	let setLang = vscode.commands.registerCommand('heygpt.setLanguage', async function () {
		const xlanguage = await setLanguage();
		await vscode.workspace.getConfiguration().update('xlanguage',xlanguage, vscode.ConfigurationTarget.Global);
		console.log(config.get('xlanguage'))
		vscode.window.showInformationMessage('Your favorite language is registred ! RESTART VSCODE'); 
	});
	let heygpt = vscode.commands.registerCommand('heygpt.search', function (prompt) {
		gptAnswerWithProgressBar(prompt,"webView")
	});
	let cmtogpt = vscode.commands.registerCommand('heygpt.cmtogpt', function () {
		let textBehind = getTextBehindCursor;
		if (textBehind !== undefined){
		let prompt = `Rédige moi un code avec des commentaires en ${config.get('xlanguage')} pour la requête suivante : `+getTextBehindCursor();
		gptAnswerWithProgressBar(prompt,"explain");}else{console.log('undefined')}
	});
	let explain = vscode.commands.registerCommand('heygpt.explain', ()=>{
		const selection = vscode.window.activeTextEditor.selection;

        if (selection) {
			let prompt= `Explique moi le code suivant en ${config.get('xlanguage') ? config.get('xlanguage') : 'français'}: ${vscode.window.activeTextEditor.document.getText(selection)}
			Et tes explications met les dans un format html`;
			vscode.commands.executeCommand('heygpt.search',prompt);
        }else{
			vscode.window.
			showErrorMessage("No items have been selected. Please select a text")
		}
	});
	let ask = vscode.commands.registerCommand('heygpt.ask', async ()=>{
		let question = await vscode.window.showInputBox({
			placeHolder: "How can i help you ?"
		});

        if (selection) {
			let prompt= `Voici mon code: ${vscode.window.activeTextEditor.document.getText(selection)}.
			${question}`;
			gptAnswerWithProgressBar(prompt,'ask')
        }else{
			vscode.window.
			showErrorMessage("No items have been selected. Please select a text")
		}
	})

	context.subscriptions.push(start);
	context.subscriptions.push(disposable);
	context.subscriptions.push(explain);
	context.subscriptions.push(ask);
	context.subscriptions.push(heygpt);
	context.subscriptions.push(setApiKey);
	context.subscriptions.push(setLang);
	context.subscriptions.push(cmtogpt);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
