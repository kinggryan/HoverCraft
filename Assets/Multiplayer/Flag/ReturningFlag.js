#pragma strict

// Returning Flag COmponent
//		Attaches to a chasis when that player is trying to return a flag. On a timer expiration, this causes the flag to get 
//		return.
//			OnServer : 
/*			- Moves flag on map back to its home node after set amount of Time.
			
			On Client : 
			- Displays GUI loading bar of timer 		*/

public var relatedFlag : CapturableFlag;
public var startTime : float;

public var RETURN_TIME = 5.0;

/*****************
	
	Server side
	
	****************/

function Start() {
	if(Network.isServer) {
		ReturnFlag();
	} else {
		startTime = Time.time;
	}
}

function ReturnFlag() {
	yield WaitForSeconds(RETURN_TIME);

	relatedFlag.ReturnHome();
	networkView.RPC("DestroySelf",RPCMode.All,relatedFlag.homeNode.networkView.viewID);
}

/**************

	Client Side
	
	**************/
	
function OnGUI() {
	if(Network.isClient) {
		var repairBarWidth = 200;
		var timePassed = Time.time - startTime;
		var barRatio = timePassed / RETURN_TIME;
		var barWidth = repairBarWidth * barRatio;
			
		GUI.Button(Rect((Screen.width / 2) - (.5*barWidth),50,barWidth,20),"Returning");
	}
}

@RPC
function DestroySelf() {
	gameObject.Destroy(this);
}