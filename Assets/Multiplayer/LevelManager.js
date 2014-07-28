#pragma strict

/* Level Manager class. Each level needs an object with a level manager component. Level Manager's main duties handle:
	-- Player starting positions
	-- Maximum Number of Players
	-- Telling the Server when the local player has joined
	Level manager can be extended to handle different game modes
*/

var maxNumberOfPlayers = 6;
var playerStartPositions : Vector3[];
var playersInGameCount = 0;
var GAME_END_MESSAGE_DISPLAY_TIME = 4.5;

function Start() {
	if(NetworkManager.inServerMode) {
		
	}
	else { // tell server we joined. Buffer RPC in case we get into room before server
		networkView.RPC("PlayerJoinedRoom",RPCMode.AllBuffered);
	}
}

/****************

	Server-side functions
	
	**************/

// Called on server when a player joins the game.
@RPC
function PlayerJoinedRoom() {
	if(NetworkManager.inServerMode) {
		playersInGameCount++;
		if(playersInGameCount == NetworkManager.PlayerNumberHashtable.Count) { // if all players are in game 
			BuildAllPlayerMachines(NetworkManager.PlayerNumberHashtable, playerStartPositions);
			Debug.LogError("Starting game");
			StartGame(); 	// inherited by children classes
		}
	}
}

function StartGame() {
	// empty prototype, expanded  in inheriting classes
}

function BuildAllPlayerMachines(playerNumberHashtable : Hashtable, positions : Vector3[]) {
	for(var i = 0 ; i < playerNumberHashtable.Count ; i++) {
		// Get player id for player number i; then load their design and build it at position i
	//	Debug.LogError("player number and hashtable count" + playerNumberHashtable[i] +" "+ playerNumberHashtable.Count);
		var pData : MachineDesignSaveData = MachineDesignNetworkManager.playerMachineDesigns[playerNumberHashtable[i]];
		var machinePosition = positions[i];
		Debug.LogError("Machine Position " + machinePosition + " " + i);
		Debug.LogError("Machine : " + (pData == null));
		var pRoot = MachineDesignManager.BuildMachineFromTreeForMultiplayer(pData.rootNode,machinePosition);
		Debug.LogError("Now root is at : "+pRoot.transform.position);
		
		Debug.LogError("Root : "+pRoot+" with view id : "+pRoot.networkView.viewID);
		
		// Add player data tracker
		var playerDataObj : PlayerData = pRoot.GetComponent(PlayerData);
		playerDataObj.SetPlayerDataOnAllClients(playerNumberHashtable[i],-1);
		
		// add hovercontroller and set camera for player
		var machPieces : MachinePieceAttachments = pRoot.GetComponent(MachinePieceAttachments);
		var plate = machPieces.connectedObjects[0];
		var controller : HoverControllerNetwork = plate.AddComponent(HoverControllerNetwork);
		Debug.LogError("plate : "+ plate);
		controller.controller = playerNumberHashtable[i];
		
		// Set controller of machine
		pRoot.networkView.RPC("SetControllerOfMachine",RPCMode.All,playerNumberHashtable[i]);

		networkView.RPC("SetCameraForPlayer",RPCMode.All,playerNumberHashtable[i],plate.networkView.viewID);
	}
	
	for(var piece : GameObject in GameObject.FindGameObjectsWithTag("piece"))
		networkView.RPC("PurgeClientSideComponents",RPCMode.Others,piece.networkView.viewID);
}

function DestroyMachineAcrossNetwork(chasis : GameObject) {
	var machPieces : MachinePieceAttachments = chasis.GetComponent(MachinePieceAttachments);
	for(var currObject in machPieces.connectedObjects) {
		if(currObject != null)
			Network.Destroy(currObject.networkView.viewID);
	}
	
	Network.Destroy(chasis.networkView.viewID);
}

function BuildMachineForPlayer(player : NetworkPlayer, position : Vector3, rotation : Quaternion) {
	var pData : MachineDesignSaveData = MachineDesignNetworkManager.playerMachineDesigns[player];
	var pRoot = MachineDesignManager.BuildMachineFromTreeForMultiplayer(pData.rootNode,position);
	
	pRoot.transform.rotation = rotation;
	
	// Add player data tracker
	var playerDataObj : PlayerData = pRoot.GetComponent(PlayerData);
//	playerDataObj.player = player;
//	playerDataObj.team = -1;	// signifies unteamed
	playerDataObj.SetPlayerDataOnAllClients(player,-1);
	
	var machPieces : MachinePieceAttachments = pRoot.GetComponent(MachinePieceAttachments);
	var plate = machPieces.connectedObjects[0];
	var controller : HoverControllerNetwork = plate.AddComponent(HoverControllerNetwork);
	controller.controller = player;

	networkView.RPC("SetCameraForPlayer",RPCMode.All,player,plate.networkView.viewID);
	
	for(var piece : GameObject in GameObject.FindGameObjectsWithTag("piece"))
		networkView.RPC("PurgeClientSideComponents",RPCMode.Others,piece.networkView.viewID);
}

// Called when the game ends. Displays a message and, after some set time, returns to the game lobby
function FinishGameWithMessageAndReturnToLobby(message : String) {
	networkView.RPC("ShowMessageForTime",RPCMode.Others,message,GAME_END_MESSAGE_DISPLAY_TIME);
	yield WaitForSeconds(GAME_END_MESSAGE_DISPLAY_TIME + 1.0);	// add a second to account for latency, I suppose
	networkView.RPC("GoToLobby",RPCMode.All);
}

@RPC
function RepairMachine(originalChasis : NetworkViewID, player : NetworkPlayer, position : Vector3, rotation: Quaternion) {
	DestroyMachineAcrossNetwork(NetworkView.Find(originalChasis).gameObject);
	BuildMachineForPlayer(player, position, rotation);
}

// Kill the server if a player disconnects and there are no players left in the game aside from the server
function OnPlayerDisconnected(player : NetworkPlayer) {
	Debug.LogError("num players " +Network.connections.Length);
	if(Network.isServer && Network.connections.Length == 1) {
		Application.Quit();
	}
}

/****************

	Client-side Functions
	
	*************/

@RPC
function SetCameraForPlayer(player : NetworkPlayer, viewID : NetworkViewID) {
	if(Network.player == player) {
		var controller : HoverControllerNetwork = NetworkView.Find(viewID).gameObject.AddComponent(HoverControllerNetwork);
		controller.controlledByMe = true;
		var mainCam = GameObject.Find("Main Camera");
		mainCam.Destroy(mainCam.GetComponent(CameraRobotFollower));
		var follower : CameraRobotFollower = mainCam.AddComponent(CameraRobotFollower);
		follower.objToFollow = controller.gameObject;
	}
}

@RPC
function PurgeClientSideComponents(viewID : NetworkViewID) {
	if(NetworkView.Find(viewID) != null) {
		var piece : GameObject = NetworkView.Find(viewID).gameObject;

		piece.Destroy(piece.GetComponent(FixedJoint));
		piece.Destroy(piece.rigidbody);
		piece.Destroy(piece.collider);
		piece.Destroy(piece.GetComponent(Connector));
		piece.Destroy(piece.GetComponent(BattleManager));
	}
}

@RPC
function ShowMessageForTime(message : String, time : float) {
	HUDManager.ShowTextForTime(message,time);
}

@RPC
function GoToLobby() {
	Application.LoadLevel(LevelDictionary.GAME_LOBBY);
}