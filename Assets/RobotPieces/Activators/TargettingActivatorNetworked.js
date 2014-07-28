#pragma strict

class TargettingActivatorNetworked extends Activator {

	public var controlledByMe : boolean = true;	// HACK fix this later, should be false
	
	private var keyPressed : boolean = false;
	
	var selected : boolean = false;
	var mainCamFollowPiece : GameObject;
	
	function Start() {
		if(Network.isServer) {
			attachedPiece = GetComponent(Connector);
			controlledByMe = false;		// HACK
		}
		else {
			mainCamFollowPiece = GameObject.Find("Main Camera");
		}
		
		Debug.LogError("Being created");
	}
	
	function Update()
	{
		if(controlledByMe) {
			if(Input.GetKeyDown(key)) {
				// allocate the view here, then send to server. This way we write data, rather than reading it
				var nView = Network.AllocateViewID();
				networkView.RPC("CallActivate",RPCMode.Server,nView);
			}
		}
	}
	
	/* ********************
	
		Server-side Functions 
		
		*********************/
	
	function FixedUpdate() {
		if(Network.isServer && keyPressed) {
			attachedPiece.FixedActivateNetworked();
		}
	}
	
	@RPC
	function CallActivate(viewID : NetworkViewID) {
		if(!selected) {
	/*		var CRF : CameraRobotFollower = relatedCamera.GetComponent("CameraRobotFollower");
			Debug.Log(CRF);
			mainCamFollowPiece = CRF.objToFollow;
			relatedCamera.Destroy(CRF);
			relatedCamera.Destroy(relatedCamera.GetComponent("TargettingCamera"));
			var TC : TargettingCamera = relatedCamera.AddComponent("TargettingCamera");
			TC.objToFollow = GetComponent("Connector"); */
			
			selected = true;
			networkView.RPC("AddOrDestroyTargetter",RPCMode.All,true,viewID);
		}
		else {
		/*	relatedCamera.Destroy(relatedCamera.GetComponent("CameraRobotFollower"));
			relatedCamera.Destroy(relatedCamera.GetComponent("TargettingCamera"));
			var camFollower : CameraRobotFollower = relatedCamera.AddComponent("CameraRobotFollower");
			camFollower.objToFollow = mainCamFollowPiece; */
			selected = false;
			networkView.RPC("AddOrDestroyTargetter",RPCMode.All,false, Network.AllocateViewID());
		}
	}
	
	/****************
		
		Client-side Functions
		
		*****************/
	
	@RPC
	function AddOrDestroyTargetter(addTargetter : boolean, viewID : NetworkViewID) {
		if(addTargetter) { // add targetter component
			var targetter = gameObject.AddComponent(TargetterNetworked);
			var nView : NetworkView = gameObject.AddComponent(NetworkView);
			nView.viewID = viewID;
			nView.observed = targetter;
			nView.stateSynchronization = NetworkStateSynchronization.ReliableDeltaCompressed;
			
			// change camera methods
			if(Network.isClient && controlledByMe) {
				gameObject.Destroy(mainCamFollowPiece.GetComponent(CameraRobotFollower));
				var cam : TargettingCameraNetwork = mainCamFollowPiece.AddComponent(TargettingCameraNetwork);
				cam.objToFollow = transform;	
			}
		}
		else {	// destroy targetter component
			gameObject.Destroy(gameObject.GetComponent(TargetterNetworked));
			// TODO destroy new network view
		}
	}
	
	@RPC
	function SetController(player : NetworkPlayer) {
		if(Network.player == player) {
			Debug.LogError("controller set to me");
			controlledByMe = true;
			relatedCamera = GameObject.Find("Main Camera");
		}
		else
			Debug.LogError("controller not me");
	}
}