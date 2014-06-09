#pragma strict

// Controls the GUI for the main menu
var loadFileName : String = "MyDesign";

function Start() {
	if(!Directory.Exists(Application.dataPath+"/MachineDesigns"))
		Directory.CreateDirectory(Application.dataPath+"/MachineDesigns");
}

function OnGUI () {
	// New Design Button
	if(GUI.Button(Rect(25,25,100,100),"New Design"))
		Application.LoadLevel(LevelDictionary.TEST_LEVEL);
		
	// load file button
	loadFileName = GUI.TextField(Rect(25,135,100,20),loadFileName,25);
	if(GUI.Button(Rect(25,155,100,100),"Load Design")) {
		MachineDesignManager.loadFlag = true;
		MachineDesignManager.loadFileName = loadFileName;
		Application.LoadLevel(LevelDictionary.TEST_LEVEL);
	}
	
	if(GUI.Button(Rect(150,25,100,100),"Back"))
		Application.LoadLevel(LevelDictionary.MAIN_MENU);
}