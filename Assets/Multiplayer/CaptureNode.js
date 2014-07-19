#pragma strict

public var controllingTeam 	: int = -1;			// -1 marks uncontrolled
public var adjacentNodes	: CaptureNode[];	// adjacent nodes
public var contested		: boolean;			// any node adjacent to enemy controlled nodes is contested
public var capturable		: boolean = true;			// nodes are uncapturable for a period of time after being captured

public var relatedFlag		: GameObject;		// the flag that allows capture of this node

public var UNCAPTURABLE_TIME : float = 30.0;	// amount of time a node is uncapturable after it has been captured
public var MAXIMUM_REPAIR_DISTANCE : float = 8.0;
public var FLAG_RELATIVE_SPAWN_POINT : Vector3 = Vector3(0,0,2.5);

function Start() {
	if(Network.isClient) {
		// set the color based on starting team
		ChangeTeam(controllingTeam);	
	}
	else {
		// Create Flag on server and set relevant info
	/*	var flagPrefab : GameObject = Resources.Load("MapFlag",GameObject);
		var flag : GameObject = Network.Instantiate(flagPrefab,transform.position + Vector3.up*2.5,Quaternion.identity,0);
		var flagInfo : CapturableFlag = flag.GetComponent(CapturableFlag);
		
		flagInfo.homeNode = this;
		flagInfo.controllingTeam = controllingTeam;
		relatedFlag = flag; */
		
		CheckContested();
	}
}

/************************

	 Server-side handles:
	- declare capture
	- check if neighbors are contested
	- mark capturable or uncapturable
	- on trigger enter, check to see if this node is being captured
	
	************************/
	
// sets this node to be contested if it is, or uncontested if it isn't
function CheckContested() {
	var tempContested = false;
	
	for(var node in adjacentNodes) {
		if(node.controllingTeam != controllingTeam)
			tempContested = true;
	}
	
	contested = tempContested;
	
	if(contested) {
		// Create Flag on server and set relevant info
		var flagPrefab : GameObject = Resources.Load("MapFlag",GameObject);
		var flag : GameObject = Network.Instantiate(flagPrefab,transform.position + Vector3.up*2.5,Quaternion.identity,0);
		var flagInfo : CapturableFlag = flag.GetComponent(CapturableFlag);
		
		flagInfo.homeNode = this;
		flagInfo.controllingTeam = controllingTeam;
		relatedFlag = flag;
	}
	else {
		Network.Destroy(relatedFlag.gameObject);
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

function OnTriggerEnter(other : Collider) {
	var otherPlayerData = other.GetComponent(PlayerData);
	
	if(otherPlayerData != null) {
		// if they are on your team and have a flag held, then declare a capture.
		if(controllingTeam == otherPlayerData.team && otherPlayerData.GetComponent(HoldingFlag) != null) {
			var hFlag = otherPlayerData.GetComponent(HoldingFlag);
			hFlag.homeNode.Capture(controllingTeam);
			otherPlayerData.gameObject.Destroy(hFlag);
		}
	}
}

/***********************

 	 Client-Side handles:
	- Change visuals on captured node
	- start repair sequence when clicked
	
	**********************/
	
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