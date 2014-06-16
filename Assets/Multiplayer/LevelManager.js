#pragma strict

/* Level Manager class. Each level needs an object with a level manager component. Level Manager's main duties handle:
	-- Player starting positions
	-- Maximum Number of Players
	Level manager can be extended to handle different game modes
*/

var maxNumberOfPlayers = 4;
var playerStartPositions : Vector3[];

function BuildAllPlayerMachines(playerNumberHashtable : Hashtable, positions : Vector3[]) {
	for(var i = 0 ; i < playerNumberHashtable.Count ; i++) {
		// Get player id for player number i; then load their design and build it at position i
		var pData : MachineDesignSaveData = MachineDesignNetworkManager.playerMachineDesigns[playerNumberHashtable[i]];
		var pRoot = MachineDesignManager.BuildMachineFromTreeForMultiplayer(pData.rootNode,positions[i]);
	}
}