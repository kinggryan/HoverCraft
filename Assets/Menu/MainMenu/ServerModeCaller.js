#pragma strict

// ServerModeCaller class - should always be in the first scene of the game on startup. Checks the command line args and
//		calls network manager server setup class.

// Awake() is called when the game starts up, as this is a static class. Here, we can check command line args and initialize
//		server mode if that is what is needed.
function Awake() {
	var args : String[] = System.Environment.GetCommandLineArgs();
	
	if(args.Length >= 4) {	
		if (String.Compare(args[2],"-servermode") == 0) {
			Debug.LogError("NEW server mode initialized");
			Debug.LogError("setting up server...");
			Screen.SetResolution(800,600,false);
			NetworkManager.inServerMode = true;
			NetworkManager.savedLobbyName = args[3];
			PhotonNetwork.ConnectUsingSettings("1");
		}
		else
			gameObject.Destroy(this);
	}
	else if(args.Length == 3) {
		if (String.Compare(args[1],"-servermode") == 0) {
			Debug.LogError("server mode initialized");
			NetworkManager.SetUpServerLobby(args[2]);
		}
		else
			gameObject.Destroy(this);
	}
	else
		gameObject.Destroy(this);
} 

	function OnConnectedToMaster() {
		// if in server mode, initialize room.
		if(NetworkManager.inServerMode) {
			Debug.LogError("in servermode");
			PhotonNetwork.CreateRoom(NetworkManager.savedLobbyName);
			Application.LoadLevel(LevelDictionary.GAME_LOBBY);
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
		// if in server mode, initialize room.
		if(NetworkManager.inServerMode) {
			Debug.LogError("in servermode");
		//	PhotonNetwork.CreateRoom(NetworkManager.savedLobbyName);
			Application.LoadLevel(LevelDictionary.GAME_LOBBY);
		}
		else
			Debug.LogError("not in servermode...");
	}
	
	function OnJoinedRoom() {
		Debug.Log("Joined Room");
	}
	
	function OnPhotonJoinRoomFailed() {
		Debug.Log("Joined Room Failed");
	}