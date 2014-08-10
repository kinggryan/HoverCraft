#pragma strict

public var controllingTeam 	: int = -1;			// -1 marks uncontrolled
public var adjacentNodes	: CaptureNode[];	// adjacent nodes
public var contested		: boolean;			// any node adjacent to enemy controlled nodes is contested
public var capturable		: boolean = true;			// nodes are uncapturable for a period of time after being captured

public var relatedFlag		: GameObject;		// the flag that allows capture of this node

public var UNCAPTURABLE_TIME : float = 30.0;	// amount of time a node is uncapturable after it has been captured
public var MAXIMUM_REPAIR_DISTANCE : float = 8.0;
public var FLAG_RELATIVE_SPAWN_POINT : Vector3 = Vector3(0,0,2.5);

private var showTimer : boolean;				// shows time until capturable again when true
private var timeRemaining : float;

function Start() {
	if(Network.isClient) {
		// set the color based on starting team
		ChangeTeam(controllingTeam,false);	
	}
	else {
		// Hide the uncapturable timer and check whether we're contested
		showTimer = false;
		CheckContested();
		
		// Increment number of controlled points for a team in the node level manager
		var levelManager : NodeLevelManager = GameObject.Find("LevelManager").GetComponent(LevelManager);
		if(controllingTeam == 0)
			levelManager.RedTeamNumberOfControlledPoints++;
		else if(controllingTeam == 1)
			levelManager.BlueTeamNumberOfControlledPoints++;
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
		if(node.controllingTeam != -1 && node.controllingTeam != controllingTeam)
			tempContested = true;
	}
	
	contested = tempContested;
	
	if(contested) {
		if(relatedFlag == null) {
			// Create Flag on server and set relevant info
			var flagPrefab : GameObject = Resources.Load("MapFlag",GameObject);
			var flag : GameObject = Network.Instantiate(flagPrefab,transform.position + Vector3.up*2.5,Quaternion.identity,0);
			var flagInfo : CapturableFlag = flag.GetComponent(CapturableFlag);
		
			flagInfo.homeNode = this;
			flagInfo.atHome = true;
			flagInfo.controllingTeam = controllingTeam;
			relatedFlag = flag;
		}
	}
	else {
		Network.Destroy(relatedFlag.gameObject);
	}
}

function Capture(team : int) {
	var previousTeam = controllingTeam;
	controllingTeam = team;
	
	networkView.RPC("ChangeTeam",RPCMode.Others,team,true);
	
	for(node in adjacentNodes) 
		node.CheckContested();
		
	capturable = false;
	
	// Increment and/or decrement number of controlled points for a team in the node level manager
	var levelManager : NodeLevelManager = GameObject.Find("LevelManager").GetComponent(LevelManager);
	if(team == 0)
		levelManager.RedTeamNumberOfControlledPoints++;
	else if(team == 1)
		levelManager.BlueTeamNumberOfControlledPoints++;
		
	if(previousTeam == 0)
		levelManager.RedTeamNumberOfControlledPoints--;
	else if(previousTeam == 1)
		levelManager.BlueTeamNumberOfControlledPoints--;
	
	
	MarkCapturable(UNCAPTURABLE_TIME);	
}

function MarkCapturable(delay : float) {
	networkView.RPC("ToggleDisplayTimer",RPCMode.Others,true);
	yield WaitForSeconds(delay);
	
	networkView.RPC("ToggleDisplayTimer",RPCMode.Others,false);
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
	- Show timer and home node icon, if needed
	
	**********************/
	
@RPC
function ChangeTeam(team : int, showText : boolean) {
	switch(team) {
		case -1 : renderer.material.SetColor("_Color",Color.white); HUDManager.ShowText("Set Neutral?"); break;
		case  0 : renderer.material.SetColor("_Color",Color.red); HUDManager.ShowText("Captured for Red!"); break;
		case  1 : renderer.material.SetColor("_Color",Color.blue); HUDManager.ShowText("Captured for Blue!"); break;
		default : break;
	}
}

@RPC
function ToggleDisplayTimer(turnOn : boolean) {
	if(turnOn) {
		showTimer = true;
		timeRemaining = UNCAPTURABLE_TIME;
	}
	else {
		showTimer = false;
		timeRemaining = 0;
		HUDManager.ShowText("Node Capturable!");
	}
}

function OnGUI() {
	if(showTimer) {
		var mainCamera = GameObject.Find("Main Camera").camera;
		var iconPositionWorldCoords : Vector3 = transform.position + (3 * Vector3.up);
		var iconPositionScreenCoords = mainCamera.WorldToScreenPoint(iconPositionWorldCoords);
		
		var displayTime = Mathf.FloorToInt(timeRemaining);
		
		if(iconPositionScreenCoords.z > 0) {
			var textWidth = 25;
			GUI.Label(Rect(iconPositionScreenCoords.x - .5*textWidth,Screen.height - iconPositionScreenCoords.y + .5*textWidth,textWidth,textWidth),""+displayTime);
		}
	}
}

function Update() {
	if(showTimer) {
		timeRemaining -= Time.deltaTime;
	}
}