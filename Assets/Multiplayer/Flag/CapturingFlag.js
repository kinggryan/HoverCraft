#pragma strict

// Capturing Flag Component
//		Attaches to a chasis when that player is trying to capture a flag. On a timer expiration, this causes the flag to get 
//		captured.
//			OnServer : 
/*			- Triggers Attachment of GrabbedFlag Component
			- Calls for its own destruction across network if player strays too far from HideFlags
			
			On Client : 
			- Displays GUI loading bar of timer 		*/

public var relatedFlag : CapturableFlag;
public var startTime : float;

public var CAPTURE_TIME = 3.5;

/*****************
	
	Server side
	
	****************/

function Start() {
	if(Network.isServer) {
		CaptureFlag();
	} else {
		startTime = Time.time;
	}
}

function CaptureFlag() {
	yield WaitForSeconds(CAPTURE_TIME);

	networkView.RPC("DestroySelfAndAttachFlag",RPCMode.All,relatedFlag.homeNode.networkView.viewID);
}

/**************

	Client Side
	
	**************/
	
function OnGUI() {
	if(Network.isClient) {
		var repairBarWidth = 200;
		var timePassed = Time.time - startTime;
		var barRatio = timePassed / CAPTURE_TIME;
		var barWidth = repairBarWidth * barRatio;
			
		GUI.Button(Rect((Screen.width / 2) - (.5*barWidth),50,barWidth,20),"Capturing");
	}
}

@RPC
function DestroySelf() {
	gameObject.Destroy(this);
}

@RPC
function DestroySelfAndAttachFlag(homeNode : NetworkViewID) {
	var newFlag : HoldingFlag = gameObject.AddComponent(HoldingFlag);
	newFlag.homeNode = NetworkView.Find(homeNode).gameObject.GetComponent(CaptureNode);

	if(Network.isServer)
		Network.Destroy(relatedFlag.networkView.viewID);

	gameObject.Destroy(this);
}