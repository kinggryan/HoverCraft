#pragma strict

// Machine Design Network Manager class. Must be attached to an object with a network view so we can send the RPC via network views

public var playerMachineDesigns : Hashtable;

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
}

function BuildAllPlayerMachines(playerNumberHashtable : Hashtable, positions : Vector3[]) {
	for(var i = 0 ; i < playerNumberHashtable.Count ; i++) {
		// Get player id for player number i; then load their design and build it at position i
		var pData : MachineDesignSaveData = playerMachineDesigns[playerNumberHashtable[i]];
		var pRoot = MachineDesignManager.BuildMachineFromTreeForMultiplayer(pData.rootNode,positions[i]);
	}
}