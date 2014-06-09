#pragma strict

// MAIN MENU GUI. Displays title and options between PLAY and BUILD menus.
function OnGUI() {
	var middle = Screen.width / 2;
	
	GUI.Label(Rect(middle-100,25,200,100),"Makeshift Coliseum");
	
	if(GUI.Button(Rect(middle - 100,125,200,100),"Build"))
		Application.LoadLevel(LevelDictionary.BUILD_MENU);
	if(GUI.Button(Rect(middle - 100,250,200,100),"Play!"))
		Application.LoadLevel(LevelDictionary.PLAY_MENU);
}