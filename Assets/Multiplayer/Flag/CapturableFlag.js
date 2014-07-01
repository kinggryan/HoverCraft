#pragma strict

// Capturable Flag class
//		Exists on the physical flag on the map. Governs when to start capturing and returning the flag on the server.
//		Collider must be configured as a trigger, as the capture and return triggers use OnTriggerEnter

public var controllingTeam : int;
public var homeNode : CaptureNode;
public var atHome : boolean = true;

function Start() {
	if(Network.isClient) {
		gameObject.Destroy(collider);	// remove collider on clients. Collision detection handled on server
		gameObject.Destroy(GetComponent(Collider),0);
		gameObject.Destroy(rigidbody);
	}
}

@RPC
function AttachCapturingFlag(viewID : NetworkViewID) {
	NetworkView.Find(viewID).gameObject.AddComponent(CapturingFlag);
}

/* Server Side Handles:
	- Capture Trigger
	- Return Trigger
	These triggers won't happen on clients because the collider has been removed
	*/

function OnTriggerStay(other : Collider) {
	var otherPlayerData = other.GetComponent(PlayerData);
	
	if(otherPlayerData != null) {
		if(controllingTeam == otherPlayerData.team) { // && they lack a returning flag component 
			Debug.LogError("Returning Flag");
			// attach returning flag component
		}
		else if(otherPlayerData.GetComponent(CapturingFlag) == null) {
			Debug.LogError("Capturing Flag");
			var cFlag : CapturingFlag = otherPlayerData.gameObject.AddComponent(CapturingFlag);
			cFlag.relatedFlag = this;
			networkView.RPC("AttachCapturingFlag",RPCMode.Others,other.networkView.viewID);
		}
	}
}

function OnTriggerExit(other : Collider) {
	var otherPlayerData = other.GetComponent(PlayerData);
	
	if(otherPlayerData != null) {
		var otherPlayerFlag : CapturingFlag = other.GetComponent(CapturingFlag);
		
		if(otherPlayerFlag != null) {
			if(otherPlayerFlag.relatedFlag == this)
				otherPlayerFlag.networkView.RPC("DestroySelf",RPCMode.All);
		}
	}
}

