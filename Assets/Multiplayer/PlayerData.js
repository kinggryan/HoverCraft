#pragma strict

class PlayerData extends MonoBehaviour {
	public var player;		// the player who controls the object that this component attaches to.
	public var team : int;	// the team that the relevant player is on
	static private var playerDataArray : ArrayList;		// tracks all player data objects

	function PlayerData() {
		if(!Network.isClient && !Network.isServer) {	// if offline, remove this
			//DelayedDestroy();
		}
		else {
			if (playerDataArray == null)
				playerDataArray = new ArrayList();
		
			playerDataArray.Add(this);				
		}
	}
	
	function Start() {
		if(!Network.isClient && !Network.isServer) {	// if offline, remove this
			gameObject.Destroy(this);
		}
	}

	function OnDestroy() {
		if(Network.isClient || Network.isServer)
			playerDataArray.Remove(this);
	}

	// returns the player chasis piece for the given player
	static function GetPlayerChasisPiece(player : NetworkPlayer) {
		var pDataArray : PlayerData = null;
	
		for(var currData : PlayerData in playerDataArray) {
			if (currData.player == player) {
				pDataArray = currData;
			}
		}
	
		if(pDataArray == null) {
			Debug.LogError("Player not found when looking for chasis");
			return null;
		}
		else {
			return pDataArray.gameObject;
		}
	}

	// returns the player data object attached to the given player's chasis
	static function GetPlayerData(player : NetworkPlayer) : PlayerData{
		var pDataArray : PlayerData = null;
	
		for(var currData : PlayerData in playerDataArray) {
			if (currData.player == player) {
				pDataArray = currData;
			}
		}
	
		if(pDataArray == null) {
			Debug.LogError("Player not found when looking for chasis");
			return null;
		}
		else {
			return pDataArray;
		}
	}
	
	static function GetAllPlayerData() {
		return playerDataArray;
	}

	function SetPlayerDataOnAllClients(newPlayer : NetworkPlayer, newTeam : int) {
		networkView.RPC("SetPlayerDataOnClient",RPCMode.All,newPlayer,newTeam);
	}

	function SetTeamOnAllClients(newTeam : int) {
		networkView.RPC("SetTeamOnClient",RPCMode.All,newTeam);
	}
	
	@RPC
	function SetTeamOnClient(newTeam : int) {
		team = newTeam;
	}

	@RPC
	function SetPlayerDataOnClient(newPlayer : NetworkPlayer, newTeam : int) {
		player = newPlayer;
		team = newTeam;
	}

	// This syncs the player and team
/*	function OnSerializeNetworkView(stream : BitStream, info : NetworkMessageInfo) {
		var tempPlayer : NetworkPlayer;
		var tempTeam : int;
		if(stream.isWriting) {
			tempPlayer = player;
			tempTeam = team;
			stream.Serialize(tempPlayer);
			stream.Serialize(tempTeam);
		}
		else {
			stream.Serialize(tempPlayer);
			stream.Serialize(tempTeam);
			player = tempPlayer;
			team = tempTeam;
		}
	} */
}