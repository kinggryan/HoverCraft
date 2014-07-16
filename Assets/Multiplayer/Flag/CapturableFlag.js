#pragma strict

// Capturable Flag class
//		Exists on the physical flag on the map. Governs when to start capturing and returning the flag on the server.
//		Collider must be configured as a trigger, as the capture and return triggers use OnTriggerEnter

public var controllingTeam : int;
public var homeNode : CaptureNode;
public var atHome : boolean = true;

private var batteryIcon : Texture;
private var mainCamera : Camera;
private var cameraObjToFollow : GameObject;

private var ICON_MAX_SCALE_DISTANCE = 15.0;
private var ICON_MIN_SCALE_DISTANCE = 150.0;
private var ICON_MAX_SCALE = 1.6;
private var ICON_MIN_SCALE = 0.1;

function Start() {
	if(Network.isClient) {
		// remove collider and rigidbody on clients. Collision detection handled on server
		var colliders = GetComponents(Collider);
		
		for(var col in colliders)
			gameObject.Destroy(col,0);
	
		gameObject.Destroy(rigidbody);	
		
		mainCamera = GameObject.Find("Main Camera").camera;
	//	var cameraFollower = mainCamera.GetComponent(CameraRobotFollower);
	//	cameraObjToFollow = cameraFollower.objToFollow;
		batteryIcon = Resources.Load("battery");
	}
	else {
		GetComponent(TransformInterpolater).enabled = false;
	
		var newID = Network.AllocateViewID();
		networkView.RPC("SetNetworkViewOwnerToServer",RPCMode.All,newID);
	}
}

function OnGUI() {
	if( Network.isClient ) {
		var iconPositionWorldCoords : Vector3 = transform.position + (5 * Vector3.up);
		var iconPositionScreenCoords = mainCamera.WorldToScreenPoint(iconPositionWorldCoords);
	
		if(iconPositionScreenCoords.z > 0) {
			var scaleDistance = iconPositionScreenCoords.z;
			//var scaleDistance = (iconPositionWorldCoords - cameraObjToFollow.transform.position).magnitude;
			scaleDistance -= ICON_MAX_SCALE_DISTANCE;
			
			// Find scale on a range from 0 to 1
			var scaling = (ICON_MIN_SCALE_DISTANCE - ICON_MAX_SCALE_DISTANCE) / scaleDistance;
			
			var scale = Mathf.Clamp(((ICON_MAX_SCALE - ICON_MIN_SCALE) * scaling) + ICON_MIN_SCALE,ICON_MIN_SCALE,ICON_MAX_SCALE);
		
			var iconWidth = 50;
			GUI.DrawTexture(Rect(iconPositionScreenCoords.x - .5*iconWidth,Screen.height - iconPositionScreenCoords.y + .5*iconWidth,scale*iconWidth,scale*iconWidth),batteryIcon);
		}
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