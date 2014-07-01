#pragma strict

public var controllingTeam 	: int = -1;			// -1 marks uncontrolled
public var adjacentNodes	: CaptureNode[];	// adjacent nodes
public var contested		: boolean;			// any node adjacent to enemy controlled nodes is contested
public var capturable		: boolean = true;			// nodes are uncapturable for a period of time after being captured

public var relatedFlag		: GameObject;		// the flag that allows capture of this node

public var UNCAPTURABLE_TIME : float = 30.0;	// amount of time a node is uncapturable after it has been captured
public var MAXIMUM_REPAIR_DISTANCE : float = 8.0;

function Start() {
	if(Network.isClient) {
		// set the color based on starting team
		ChangeTeam(controllingTeam);	
	}
}

/* Server-side handles:
	- declare capture
	- check if neighbors are contested
	- mark capturable or uncapturable
	*/
	
// sets this node to be contested if it is, or uncontested if it isn't
function CheckContested() {
	var tempContested = false;
	
	for(var node in adjacentNodes) {
		if(node.controllingTeam != controllingTeam)
			tempContested = true;
	}
	
	contested = tempContested;
	
	if(contested) {
		// spawn a flag
	}
	else {
		// destroy flag
	}
}

function Capture(team : int) {
	controllingTeam = team;
	
	networkView.RPC("ChangeTeam",RPCMode.Others,team);
	
	for(node in adjacentNodes) 
		node.CheckContested();
		
	capturable = false;
	
	MarkCapturable(UNCAPTURABLE_TIME);	
}

function MarkCapturable(delay : float) {
	yield WaitForSeconds(delay);
	
	capturable = true;
	CheckContested();
}

/* Client-Side handles:
	- Change visuals on captured node
	- start repair sequence when clicked
	*/
	
@RPC
function ChangeTeam(team : int) {
	switch(team) {
		case -1 : renderer.material.SetColor("_Color",Color.white); break;
		case  0 : renderer.material.SetColor("_Color",Color.red); break;
		case  1 : renderer.material.SetColor("_Color",Color.blue); break;
		default : break;
	}
}

function OnMouseDown() {
	for(var currObj in GameObject.FindGameObjectsWithTag("piece")) {
		var controller : HoverControllerNetwork = currObj.GetComponent(HoverControllerNetwork);
		if(controller != null) 
	//		controller.controller == Network.player && 
	//		(currObj.transform.position - transform.position).magnitude < MAXIMUM_REPAIR_DISTANCE &&
		{
			var machPieces : MachinePieceAttachments = currObj.GetComponent(MachinePieceAttachments);
			var chasis = machPieces.connectedObjects[0]; 
			
			chasis.AddComponent(MachineRepairer);
		}
	}
	
}