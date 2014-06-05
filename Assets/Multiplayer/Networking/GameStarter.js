#pragma strict

public var HoverPlate : GameObject;
public var Chasis : GameObject;
public var Cannon : GameObject;

var isServer : boolean = false;
var ip : String = "192.168.1.110";
var message = "";
var savefile = "MyDesign";

function Start() {
	Network.sendRate = 25;
}

function OnGUI() {
	if(GUI.Button(Rect(0,0,100,25),"Initialize Server")) {
		var useNat = !Network.HavePublicAddress();
		Debug.Log("Init server... " + Network.InitializeServer(32, 25000, useNat));
		isServer = true;
		
		// make viewID for network
		var viewID = Network.AllocateViewID();
		networkView.RPC("AllocateNetworkView",RPCMode.AllBuffered,viewID);
	}
	
	ip = GUI.TextField(Rect(0,35,500,25),ip);
	if(GUI.Button(Rect(0,50,500,25),"connect")) {
		Network.Connect(ip,25000);
		Debug.Log("connecting...");
		isServer = false;
	}
	GUI.TextField(Rect(0,100,500,25),message);
	
	if(GUI.Button(Rect(0,75,100,25),"Initialize Plate") && Network.isClient) {
		networkView.RPC("AddPlayerToGame",RPCMode.Server);
	}
	
	savefile = GUI.TextField(Rect(0,135,100,25),savefile);
	
	if(GUI.Button(Rect(0,165,100,25),"Load Machine Design") && Network.isClient) {
		var machineDesignNetworkManager : MachineDesignNetworkManager = GetComponent("MachineDesignNetworkManager");
		machineDesignNetworkManager.SendMachineDesignToServer(savefile);
	//	machineDesignNetworkManager.PrintRemote();
	}
}

@RPC
function AddPlayerToGame(messageInfo : NetworkMessageInfo) {
	// initialize start plate,chasis and call RPC set ups on all machines
	var plate : GameObject = Network.Instantiate(HoverPlate,Vector3(0,5,0),Quaternion.identity,0);
	var chasis : GameObject = Network.Instantiate(Chasis,plate.transform.TransformPoint(Vector3(0,3.5,0)),Quaternion.identity,0);
	var cannon : GameObject = Network.Instantiate(Cannon,chasis.transform.TransformPoint(Vector3(0,1,0)),Quaternion.identity,0);
	networkView.RPC("SetUpPlate",RPCMode.All,plate.networkView.viewID,chasis.networkView.viewID,cannon.networkView.viewID,messageInfo.sender);	
	networkView.RPC("StartGamePhysics",RPCMode.Server);
}

// given a viewID of a plate, sets up the plate for all players
@RPC
function SetUpPlate(plateViewID : NetworkViewID, chasisViewID : NetworkViewID, bombViewID : NetworkViewID, player : NetworkPlayer) {
	var nView : NetworkView = NetworkView.Find(plateViewID);
	
	var plate : GameObject = nView.gameObject;
	var plateAttachedPieces : MachinePieceAttachments = plate.GetComponent("MachinePieceAttachments");
	plateAttachedPieces.clearAttachments();
	
	var chasis : GameObject = NetworkView.Find(chasisViewID).gameObject;
	
	plateAttachedPieces.connectedObjects[4] = chasis;
	plate.gameObject.GetComponent(FixedJoint).connectedBody = plateAttachedPieces.connectedObjects[4].rigidbody;
	var otherAttachedPieces : MachinePieceAttachments = plateAttachedPieces.connectedObjects[4].GetComponent("MachinePieceAttachments");
	otherAttachedPieces.clearAttachments();
	otherAttachedPieces.connectedObjects[0] = plate.gameObject; 
	
	var cannon : GameObject = NetworkView.Find(bombViewID).gameObject;
	var connector : Connector = cannon.GetComponent(Connector);
	connector.Connect(chasis,Vector3(4.5,5,0),Quaternion.identity);
	var kban : KeyBindedActivatorNetworked = cannon.AddComponent(KeyBindedActivatorNetworked);
	kban.key = "l";
	
	// if not server, disable all physics simulation components
	if(!Network.isServer) {
		PurgeClientSideComponents(plate);
		PurgeClientSideComponents(chasis);
		PurgeClientSideComponents(cannon);
	}
	
	var controller : HoverControllerNetwork = plate.AddComponent(HoverControllerNetwork);
	
	// if we control this hoverplate, mark that
	if(Network.player == player) {
		controller.controlledByMe = true;
		kban.controlledByMe = true;
	}
}

@RPC
function StartGamePhysics() {
	Physics.gravity = Vector3(0,-9.8,0);
}

function OnServerInitialized(player : NetworkPlayer) {
	Debug.Log("Success! IP : " + player.ipAddress + " and port : " + player.port);
}

function OnConnectedToServer() {
	message = "yes";
	Debug.Log("Connected");
}

function OnFailedToConnect(error : NetworkConnectionError) {
	message = "no";
	Debug.Log("Connection Failed");
}

function OnPlayerConnected(player : NetworkPlayer) {
	Debug.Log("player connected; ip : " +player.ipAddress);
}

@RPC
function AllocateNetworkView(viewID : NetworkViewID) {
	Debug.Log("view id set");
	networkView.viewID = viewID;
}

function PurgeClientSideComponents(piece : GameObject) {
	piece.Destroy(piece.GetComponent(FixedJoint));
	piece.Destroy(piece.rigidbody);
	piece.Destroy(piece.collider);
	piece.Destroy(piece.GetComponent(Connector));
	piece.Destroy(piece.GetComponent(BattleManager));
}