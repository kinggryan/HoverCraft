#pragma strict

// Capturable Flag class
//		Exists on the physical flag on the map. Governs when to start capturing and returning the flag on the server.
//		Collider must be configured as a trigger, as the capture and return triggers use OnTriggerEnter

public var controllingTeam : int;
public var homeNode : CaptureNode;
public var atHome : boolean = true;

function Start() {
	if(Network.isClient) {
		// remove collider and rigidbody on clients. Collision detection handled on server
		var colliders = GetComponents(Collider);
		
		for(var col in colliders)
			gameObject.Destroy(col,0);
	
		gameObject.Destroy(rigidbody);	
	}
	else {
		GetComponent(TransformInterpolater).enabled = false;
	
		var newID = Network.AllocateViewID();
		networkView.RPC("SetNetworkViewOwnerToServer",RPCMode.All,newID);
	}
}

@RPC
function SetNetworkViewOwnerToServer(viewID : NetworkViewID) {
	networkView.viewID = viewID;
	gameObject.Destroy(GetComponent(TransformInterpolater));
	
	// TODO get interpolater to work on flag
	
	/*var inter : TransformInterpolater = gameObject.AddComponent(TransformInterpolater);
	inter.enabledSet = true;
	if(Network.isClient)
		inter.enabled = true;
	else
		inter.enabled = false; */
	
	Debug.LogError("Set View Owner to Server");
}

@RPC
function AttachCapturingFlag(viewID : NetworkViewID) {
	NetworkView.Find(viewID).gameObject.AddComponent(CapturingFlag);
}

@RPC
function AttachReturningFlag(viewID : NetworkViewID) {
	NetworkView.Find(viewID).gameObject.AddComponent(ReturningFlag);
}

/* Server Side Handles:
	- Capture Trigger
	- Return Trigger
	These triggers won't happen on clients because the collider has been removed
	*/

function OnTriggerStay(other : Collider) {
	var otherPlayerData = other.GetComponent(PlayerData);
	
	if(otherPlayerData != null) {
		if(controllingTeam == otherPlayerData.team && otherPlayerData.GetComponent(ReturningFlag) == null) {
			Debug.LogError("Returning Flag");
			var rFlag : ReturningFlag = otherPlayerData.gameObject.AddComponent(ReturningFlag);
			rFlag.relatedFlag = this;
			networkView.RPC("AttachReturningFlag",RPCMode.Others,other.networkView.viewID);
		}
		else if(otherPlayerData.team != controllingTeam && otherPlayerData.GetComponent(CapturingFlag) == null) {
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
		
		var otherPlayerReturningFlag : ReturningFlag = other.GetComponent(ReturningFlag);
		
		if(otherPlayerFlag != null) {
			if(otherPlayerFlag.relatedFlag == this)
				otherPlayerFlag.networkView.RPC("DestroySelf",RPCMode.All);
		}
	}
}

function ReturnHome() {
	transform.position = homeNode.transform.TransformPoint(homeNode.FLAG_RELATIVE_SPAWN_POINT);
	rigidbody.velocity = Vector3.zero;
	atHome = true;
}