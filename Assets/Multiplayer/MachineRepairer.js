#pragma strict

// Repairs the machine after a set amount of time. Must exist on the chasis.
public var REPAIR_TIME = 5.0;
public var controller : NetworkPlayer;
private var startTime : float;

function Start () {
	Repair();
	
	startTime = Time.time;
	
	Debug.LogError("Attached");
}

function Repair() {
	var pData : PlayerData = GetComponent(PlayerData);

	yield WaitForSeconds(REPAIR_TIME);
	
	Debug.LogError("PD : " +pData+ " is null : "+ (pData == null) + "with player : " +pData.player);
	controller = pData.player;
	
	var position = transform.position;
	var rotation = transform.rotation;
	
	var levelManager : LevelManager = GameObject.Find("MultiplayerControl").GetComponent(LevelManager);

	levelManager.networkView.RPC("RepairMachine",RPCMode.Server,networkView.viewID,controller,position,rotation);
}

function OnGUI() {
	var repairBarWidth = 200;
	var timePassed = Time.time - startTime;
	var barRatio = timePassed / REPAIR_TIME;
	var barWidth = repairBarWidth * barRatio;
	
	GUI.Label(Rect((Screen.width / 2) - (.5*barWidth),50,barWidth,20),"Repairing");
}