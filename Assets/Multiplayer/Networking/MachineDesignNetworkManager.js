#pragma strict

// Machine Design Network Manager class. Must be attached to an object with a network view so we can send the RPC via network views

static public var playerMachineDesigns : Hashtable;

// Returns true if machine design file exists on the local machine, false if otherwise.
function LocalMachineDesignExists(filePath : String) {
	if(File.Exists("MachineDesigns/"+filePath))
		return true;
	else
		return false;
}

function SendMachineDesignToServer(filePath : String) {
	// TODO make machine design folder at location relative to application directory - we may already do this
	var fileData = SaveLoad.MachineDesignToBytes("MachineDesigns/"+filePath);
	networkView.RPC("LoadMachineDesignOnServer",RPCMode.Server,fileData);
}

@RPC
function LoadMachineDesignOnServer(data : byte[], info : NetworkMessageInfo) {
	Debug.Log("Data length as string: " + data.Length);
	var rootNode = SaveLoad.LoadMachineDesignFromBytes(data);
	playerMachineDesigns.Add(info.sender,rootNode);
	
	// mark player as ready
	var gui : GameLobbyGUI = GetComponent(GameLobbyGUI);
	if(gui != null) {
		gui.ReadyPlayer(info.sender);
	}
}

function BuildAllPlayerMachines(playerNumberHashtable : Hashtable, positions : Vector3[]) {
	for(var i = 0 ; i < playerNumberHashtable.Count ; i++) {
		// Get player id for player number i; then load their design and build it at position i
		var pData : MachineDesignSaveData = playerMachineDesigns[playerNumberHashtable[i]];
		var pRoot = MachineDesignManager.BuildMachineFromTreeForMultiplayer(pData.rootNode,positions[i]);
	}
}