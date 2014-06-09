#pragma strict

function OnGUI() {
	var middle = Screen.width / 2;
	
	GUI.Label(Rect(middle-100,25,200,100),"Play");
	
	if(GUI.Button(Rect(middle - 100,125,200,100),"Host a Game")) {
		NetworkManager.LaunchLocalServer("test");
		NetworkManager.isHost = true;
		Application.LoadLevel(LevelDictionary.GAME_LOBBY);
	}
	if(GUI.Button(Rect(middle - 100,250,200,100),"Join a Game"))
		Application.LoadLevel(LevelDictionary.GAME_LOBBY);
	if(GUI.Button(Rect(middle-100,375,200,100),"Back"))
		Application.LoadLevel(LevelDictionary.MAIN_MENU);
}