#pragma strict

/* Level Manager class. Each level needs an object with a level manager component. Level Manager's main duties handle:
	-- Player starting positions
	-- Maximum Number of Players
	-- Telling the Server when the local player has joined
	Level manager can be extended to handle different game modes
*/

var maxNumberOfPlayers = 4;
var playerStartPositions : Vector3[];
var playersInGameCount = 0;

function Start() {
	if(!NetworkManager.inServerMode) { // tell server we joined. Buffer RPC in case we get into room before server
		networkView.RPC("PlayerJoinedRoom",RPCMode.AllBuffered);
	}
}

// Called on serer when a player joins the game.
@RPC
function PlayerJoinedRoom() {
	if(NetworkManager.inServerMode) {
		playersInGameCount++;
		if(playersInGameCount == NetworkManager.PlayerNumberHashtable.Count) { // if all players are in game 
			BuildAllPlayerMachines(NetworkManager.PlayerNumberHashtable, playerStartPositions);
			Debug.LogError("Starting game");
		}
	}
}

function BuildAllPlayerMachines(playerNumberHashtable : Hashtable, positions : Vector3[]) {
	for(var i = 0 ; i < playerNumberHashtable.Count ; i++) {
		// Get player id for player number i; then load their design and build it at position i
		var pData : MachineDesignSaveData = MachineDesignNetworkManager.playerMachineDesigns[playerNumberHashtable[i]];
		var pRoot = MachineDesignManager.BuildMachineFromTreeForMultiplayer(pData.rootNode,positions[i]);
		
		Debug.LogError("Root : "+pRoot+" with view id : "+pRoot.networkView.viewID);
		
		var machPieces : MachinePieceAttachments = pRoot.GetComponent(MachinePieceAttachments);
		var plate = machPieces.connectedObjects[0];
		var controller : HoverControllerNetwork = plate.AddComponent(HoverControllerNetwork);

		networkView.RPC("SetCameraForPlayer",RPCMode.All,playerNumberHashtable[i],plate.networkView.viewID);
	}
	
	for(var piece : GameObject in GameObject.FindGameObjectsWithTag("piece"))
		networkView.RPC("PurgeClientSideComponents",RPCMode.Others,piece.networkView.viewID);
}

@RPC
function SetCameraForPlayer(player : NetworkPlayer, viewID : NetworkViewID) {
	if(Network.player == player) {
		var controller : HoverControllerNetwork = NetworkView.Find(viewID).gameObject.AddComponent(HoverControllerNetwork);
		controller.controlledByMe = true;
		var mainCam = GameObject.Find("Main Camera");
		var follower : CameraRobotFollower = mainCam.AddComponent(CameraRobotFollower);
		follower.objToFollow = controller.gameObject;
	}
}

@RPC
function PurgeClientSideComponents(viewID : NetworkViewID) {
	var piece : GameObject = NetworkView.Find(viewID).gameObject;

	piece.Destroy(piece.GetComponent(FixedJoint));
	piece.Destroy(piece.rigidbody);
	piece.Destroy(piece.collider);
	piece.Destroy(piece.GetComponent(Connector));
	piece.Destroy(piece.GetComponent(BattleManager));
}