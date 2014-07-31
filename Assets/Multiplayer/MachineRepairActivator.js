#pragma strict

// 		Machine Repair Activator Class
//	
//		When clicked by a player, if that player's machine is close enough, this will 
//			connect a machine repairer component to that machine
	
public var MAXIMUM_REPAIR_DISTANCE : float = 8.0;
	
function Start() {
	Debug.LogError("Starting");
}
	
function OnMouseDown() {
	// look in pieces for plates
	Debug.LogError("clicked");
	for(var currObj in GameObject.FindGameObjectsWithTag("piece")) {
		var controller : HoverControllerNetwork = currObj.GetComponent(HoverControllerNetwork);
		
		// if this is a plate and it's controlled by me, and the plate is close enough, then repair
		if(controller != null )// &&
	//		controller.controller == Network.player && 
	//		(currObj.transform.position - transform.position).magnitude < MAXIMUM_REPAIR_DISTANCE)
		{
			var machPieces : MachinePieceAttachments = currObj.GetComponent(MachinePieceAttachments);
			var chasis = machPieces.connectedObjects[0]; 
			
			chasis.AddComponent(MachineRepairer);
		}
	}
}

// When moused over, should display text that says "Begin Repair" that is blue when close enough and red when too far away.
//  beyond a certin distance, don't display this text
function OnMouseOver() {

}