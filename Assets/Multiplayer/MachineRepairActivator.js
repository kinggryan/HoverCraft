#pragma strict

// 		Machine Repair Activator Class
//	
//		When clicked by a player, if that player's machine is close enough, this will 
//			connect a machine repairer component to that machine
	
public var relatedCaptureNode : CaptureNode;

private var displayGUI : boolean = false;

/**************

	Server Side :
		- Tells client when machine has entered or exited
		
	*****************/

function OnTriggerEnter(other : Collider) {
	if(Network.isServer) {
		var pData = other.GetComponent(PlayerData) as PlayerData;

		if(pData != null && pData.team == relatedCaptureNode.controllingTeam) {	
			networkView.RPC("PlayerEntered",RPCMode.Others,pData.player);
		}
	}
}

function OnTriggerExit(other : Collider) {
	if(Network.isServer) {
		var pData = other.GetComponent(PlayerData) as PlayerData;

		if(pData != null && pData.team == relatedCaptureNode.controllingTeam)
			networkView.RPC("PlayerExited",RPCMode.Others,pData.player);
	}
}

/************

	Client Side:
		- Creates GUI element while player is inside
		
	*************/
	
@RPC
function PlayerEntered(player : NetworkPlayer) {
	if(player == Network.player) {
		displayGUI = true;
	}
}

@RPC
function PlayerExited(player : NetworkPlayer) {
	if(player == Network.player)
		displayGUI = false;
}

function OnGUI() {
	if(displayGUI) {
		if(GUI.Button(Rect(15,75,50,50),"REPAIR")) {
			var chasisObj : GameObject = PlayerData.GetPlayerData(Network.player).gameObject;
			
			// if they don't have a repairer already, add one
			if(chasisObj.GetComponent(MachineRepairer) == null)
				chasisObj.AddComponent(MachineRepairer);
		}
	}
}