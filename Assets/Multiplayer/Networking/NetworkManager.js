#pragma strict

static class NetworkManager extends Photon.MonoBehaviour {
	static public var isHost = false;
	static public var inServerMode = false;
	static public var savedLobbyName;
	static public var portNumber = 25000;
	static public var PlayerNumberHashtable : Hashtable;	//	tracks which player to associate with which player number.

	// Called ONLY when setting up the server instance of the game
	static function SetUpServerLobby(lobbyName : String) {
		// Go to game lobby and create a photon room as the networking lobby with a name given as lobbyName
		Debug.LogError("setting up server...");
		inServerMode = true;
		savedLobbyName = lobbyName;
		PhotonNetwork.ConnectUsingSettings("1");
		PieceDictionary.InitializeDictionary();
	}
	
	static function LaunchLocalServer(lobbyName : String) {
		Debug.Log(System.Diagnostics.Process.Start("/Users/kinggryan/MachineBuilder/MakeshiftColiseum.app/Contents/MacOS/MakeshiftColiseum","-n -servermode "+lobbyName));
	}
	
	function OnConnectedToMaster() {
		// if in server mode, initialize room.
		if(inServerMode) {
			Application.LoadLevel(LevelDictionary.GAME_LOBBY);
			Debug.LogError("in servermode");
		}
		else
			Debug.LogError("not in servermode...");
	}
	
	function OnFailedToConnectToPhoton() {
		Debug.LogError("Failure");
	}
	
	function OnConnectedToPhoton() {
		Debug.LogError("Connected");
	}
	
	function OnJoinedLobby(){
		Debug.LogError("Joined Lobby");
	}
}